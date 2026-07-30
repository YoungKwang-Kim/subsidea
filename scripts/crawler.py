from __future__ import annotations

import argparse
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from scripts.grants_crawler.common import FetchOptions
from scripts.grants_crawler.models import CrawlResult
from scripts.grants_crawler.normalizer import (
    build_updates,
    load_existing_grants,
    load_existing_updates,
    merge_grants,
    write_outputs,
)
from scripts.grants_crawler.sources.bokjiro import BokjiroSource
from scripts.grants_crawler.sources.work24 import Work24Source

FIXTURES_DIR = ROOT_DIR / "scripts" / "fixtures"
DEFAULT_SOURCES = ["work24"]

SOURCE_FACTORIES = {
    "bokjiro": BokjiroSource,
    "work24": Work24Source,
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Subsidea grants crawler")
    parser.add_argument("--live", action="store_true", help="Fetch live pages instead of local fixtures")
    parser.add_argument(
        "--sources",
        nargs="*",
        default=DEFAULT_SOURCES,
        choices=list(SOURCE_FACTORIES.keys()),
        help="Subset of sources to crawl",
    )
    parser.add_argument("--log-level", default="INFO", help="Python logging level")
    return parser.parse_args()


def run_crawl(
    use_live: bool,
    source_names: list[str],
    existing_grants: list[dict],
    observed_date: str,
) -> CrawlResult:
    result = CrawlResult()
    options = FetchOptions(
        use_live=use_live,
        fixtures_dir=FIXTURES_DIR,
        existing_grants={grant["slug"]: grant for grant in existing_grants},
        observed_date=observed_date,
    )

    for source_name in source_names:
        source = SOURCE_FACTORIES[source_name]()
        try:
            grants = source.crawl(options)
            result.grants.extend(grants)
            result.successful_sources.append(source_name)
            logging.info("Collected %s verified grants from %s", len(grants), source_name)
        except Exception as exc:  # noqa: BLE001
            message = f"{source_name}: {exc}"
            result.errors.append(message)
            logging.exception("Failed to crawl %s", source_name)

    return result


def main() -> int:
    args = parse_args()
    logging.basicConfig(level=args.log_level.upper(), format="[%(levelname)s] %(message)s")

    now = datetime.now(timezone.utc).replace(microsecond=0)
    observed_date = now.date().isoformat()
    generated_at = now.isoformat().replace("+00:00", "Z")
    previous_grants = load_existing_grants()
    previous_updates = load_existing_updates()
    crawl_result = run_crawl(
        use_live=args.live,
        source_names=args.sources,
        existing_grants=previous_grants,
        observed_date=observed_date,
    )

    if not crawl_result.successful_sources:
        logging.error("All crawler sources failed: %s", "; ".join(crawl_result.errors))
        return 1

    merged_grants = merge_grants(previous_grants, crawl_result.grants)
    updates = build_updates(previous_grants, merged_grants, previous_updates)
    changed = write_outputs(merged_grants, updates, generated_at)

    if changed:
        logging.info(
            "Wrote %s grants and %s retained updates",
            len(merged_grants),
            len(updates),
        )
    else:
        logging.info("No material policy changes detected; data files were left untouched")

    if crawl_result.errors:
        logging.warning("Completed with partial source failures: %s", "; ".join(crawl_result.errors))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
