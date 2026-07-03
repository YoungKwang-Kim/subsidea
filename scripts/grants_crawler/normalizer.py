from __future__ import annotations

import json
from pathlib import Path

from scripts.grants_crawler.models import RawGrant

ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT_DIR / "data"
GRANTS_PATH = DATA_DIR / "grants.json"
UPDATES_PATH = DATA_DIR / "updates.json"


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


def load_existing_grants() -> list[dict]:
    if not GRANTS_PATH.exists():
        return []
    return json.loads(GRANTS_PATH.read_text(encoding="utf-8-sig")).get("grants", [])


def merge_grants(existing: list[dict], crawled: list[RawGrant]) -> list[dict]:
    merged = {grant["slug"]: grant for grant in existing}
    for raw in crawled:
        merged[raw.slug] = raw_to_grant(raw)

    def sort_key(grant: dict) -> tuple[int, str]:
        rank = {"closing": 0, "open": 1, "closed": 2}.get(grant["status"], 3)
        return (rank, grant["last_updated"])

    return sorted(merged.values(), key=sort_key, reverse=False)


def build_updates(previous: list[dict], current: list[dict]) -> list[dict]:
    previous_by_slug = {grant["slug"]: grant for grant in previous}
    updates: list[dict] = []

    for grant in current:
        old = previous_by_slug.get(grant["slug"])
        update_type = None
        summary = grant["summary"]

        if old is None:
            update_type = "new"
            summary = f"{grant['name']} 항목이 새로 수집되어 목록에 추가되었습니다."
        elif old.get("last_updated") != grant["last_updated"]:
            update_type = "changed"
            summary = f"{grant['name']}의 최신 안내 또는 세부 정보가 갱신되었습니다."

        if grant["status"] == "closing":
            update_type = "closing"
            summary = f"{grant['name']}은(는) 마감 임박 상태로 분류되어 일정 확인이 필요합니다."

        if update_type:
            updates.append(
                {
                    "id": f"update-{grant['slug']}",
                    "grant_slug": grant["slug"],
                    "type": update_type,
                    "title": f"{grant['name']} 업데이트",
                    "summary": summary,
                    "published_at": grant["last_updated"],
                }
            )

    updates.sort(key=lambda item: item["published_at"], reverse=True)
    return updates[:20]


def write_outputs(grants: list[dict], updates: list[dict], generated_at: str) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    GRANTS_PATH.write_text(
        json.dumps({"updated_at": generated_at, "grants": grants}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    UPDATES_PATH.write_text(
        json.dumps({"updated_at": generated_at, "updates": updates}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


