from __future__ import annotations

import copy
import json
from pathlib import Path

from scripts.grants_crawler.models import RawGrant

ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT_DIR / "data"
GRANTS_PATH = DATA_DIR / "grants.json"
UPDATES_PATH = DATA_DIR / "updates.json"
SAFE_TOP_LEVEL_FIELDS = ("status", "period", "apply_url", "source_url")
TRACKED_UPDATE_FIELDS = (
    "name",
    "summary",
    "target",
    "benefit",
    "period",
    "status",
    "apply_url",
    "source_url",
)


def raw_to_grant(raw: RawGrant) -> dict:
    return {
        "id": raw.id,
        "name": raw.name,
        "slug": raw.slug,
        "category": raw.category,
        "topic": raw.topic,
        "summary": raw.summary,
        "overview": raw.overview,
        "target": {
            "age_min": raw.age_min,
            "age_max": raw.age_max,
            "income": raw.income,
            "conditions": raw.conditions,
        },
        "benefit": {
            "amount": raw.benefit_amount,
            "duration": raw.benefit_duration,
            "type": raw.benefit_type,
        },
        "benefit_details": raw.benefit_details,
        "period": {
            "start": raw.period_start,
            "end": raw.period_end,
            "is_ongoing": raw.is_ongoing,
        },
        "application_organization": raw.application_organization,
        "application_steps": raw.application_steps,
        "required_documents": raw.required_documents,
        "faq": raw.faq,
        "apply_url": raw.apply_url,
        "source_url": raw.source_url,
        "status": raw.status,
        "tags": raw.tags,
        "last_updated": raw.last_updated,
    }


def load_existing_grants(path: Path = GRANTS_PATH) -> list[dict]:
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8-sig")).get("grants", [])


def load_existing_updates(path: Path = UPDATES_PATH) -> list[dict]:
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8-sig")).get("updates", [])


def merge_grants(existing: list[dict], crawled: list[RawGrant]) -> list[dict]:
    crawled_by_slug = {raw.slug: raw_to_grant(raw) for raw in crawled}
    merged: list[dict] = []
    existing_slugs: set[str] = set()

    for grant in existing:
        slug = grant["slug"]
        existing_slugs.add(slug)
        candidate = crawled_by_slug.get(slug)
        if candidate is None:
            merged.append(grant)
            continue
        merged.append(_merge_existing_grant(grant, candidate))

    for raw in crawled:
        if raw.slug not in existing_slugs:
            merged.append(raw_to_grant(raw))

    return merged


def _merge_existing_grant(existing: dict, candidate: dict) -> dict:
    merged = copy.deepcopy(existing)
    changed = False

    for field in SAFE_TOP_LEVEL_FIELDS:
        if merged.get(field) != candidate.get(field):
            merged[field] = copy.deepcopy(candidate[field])
            changed = True

    candidate_benefit = candidate["benefit"]
    merged_benefit = merged["benefit"]
    for field in ("amount", "type"):
        if merged_benefit.get(field) != candidate_benefit.get(field):
            merged_benefit[field] = candidate_benefit[field]
            changed = True

    if changed:
        merged["last_updated"] = candidate["last_updated"]

    return merged


def build_updates(
    previous: list[dict],
    current: list[dict],
    existing_updates: list[dict] | None = None,
) -> list[dict]:
    previous_by_slug = {grant["slug"]: grant for grant in previous}
    new_updates: list[dict] = []

    for grant in current:
        old = previous_by_slug.get(grant["slug"])
        update_type = None
        summary = grant["summary"]

        if old is None:
            update_type = "new"
            summary = f"{grant['name']} 항목이 새로 수집되어 목록에 추가되었습니다."
        elif _tracked_content(old) != _tracked_content(grant):
            update_type = "changed"
            summary = f"{grant['name']}의 공식 안내 또는 주요 운영 정보가 변경되었습니다."

        if grant["status"] == "closing" and (old is None or old.get("status") != "closing"):
            update_type = "closing"
            summary = f"{grant['name']}은(는) 마감 임박 상태로 변경되어 일정 확인이 필요합니다."
        elif grant["status"] == "closed" and (old is None or old.get("status") != "closed"):
            update_type = "closed"
            summary = f"{grant['name']}은(는) 접수가 마감되어 다음 모집 공고를 확인해야 합니다."

        if update_type:
            published_at = grant["last_updated"]
            new_updates.append(
                {
                    "id": f"update-{grant['slug']}-{published_at}-{update_type}",
                    "grant_slug": grant["slug"],
                    "type": update_type,
                    "title": f"{grant['name']} 업데이트",
                    "summary": summary,
                    "published_at": published_at,
                }
            )

    combined = [*(existing_updates or []), *new_updates]
    deduplicated = {item["id"]: item for item in combined}
    return sorted(
        deduplicated.values(),
        key=lambda item: item["published_at"],
        reverse=True,
    )[:50]


def _tracked_content(grant: dict) -> dict:
    return {
        field: copy.deepcopy(grant.get(field))
        for field in TRACKED_UPDATE_FIELDS
    }


def write_outputs(
    grants: list[dict],
    updates: list[dict],
    generated_at: str,
    grants_path: Path = GRANTS_PATH,
    updates_path: Path = UPDATES_PATH,
) -> bool:
    current_grants = load_existing_grants(grants_path)
    current_updates = load_existing_updates(updates_path)
    if current_grants == grants and current_updates == updates:
        return False

    grants_path.parent.mkdir(parents=True, exist_ok=True)
    updates_path.parent.mkdir(parents=True, exist_ok=True)
    grants_path.write_text(
        json.dumps({"updated_at": generated_at, "grants": grants}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    updates_path.write_text(
        json.dumps({"updated_at": generated_at, "updates": updates}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return True
