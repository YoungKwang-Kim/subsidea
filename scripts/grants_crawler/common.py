from __future__ import annotations

import time
from dataclasses import dataclass
from pathlib import Path

import requests

USER_AGENT = "SubsideaBot/0.1 (+https://subsidea.kr; contact: admin@subsidea.kr)"
REQUEST_INTERVAL_SECONDS = 2


@dataclass(slots=True)
class FetchOptions:
    use_live: bool
    fixtures_dir: Path


class BaseCrawlerSource:
    source_name: str
    fixture_file: str
    live_url: str

    def __init__(self) -> None:
        self._last_request_at = 0.0

    def load_html(self, options: FetchOptions) -> str:
        if options.use_live:
            return self._fetch_live_html()

        fixture_path = options.fixtures_dir / self.fixture_file
        return fixture_path.read_text(encoding="utf-8")

    def _fetch_live_html(self) -> str:
        elapsed = time.monotonic() - self._last_request_at
        if elapsed < REQUEST_INTERVAL_SECONDS:
            time.sleep(REQUEST_INTERVAL_SECONDS - elapsed)

        response = requests.get(
            self.live_url,
            headers={"User-Agent": USER_AGENT},
            timeout=20,
        )
        response.raise_for_status()
        self._last_request_at = time.monotonic()
        return response.text
