from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from scripts.grants_crawler.common import FetchOptions
from scripts.grants_crawler.models import RawGrant
from scripts.grants_crawler.normalizer import (
    build_updates,
    merge_grants,
    write_outputs,
)
from scripts.grants_crawler.sources.base import SourceParseError
from scripts.grants_crawler.sources.work24 import Work24Source


def make_existing_grant() -> dict:
    return {
        "id": "national-learning-card",
        "name": "국민내일배움카드",
        "slug": "national-learning-card",
        "category": ["youth", "welfare"],
        "topic": ["education", "employment"],
        "summary": "편집팀이 작성한 요약",
        "overview": "편집팀이 작성한 상세 설명",
        "target": {
            "age_min": None,
            "age_max": None,
            "income": "공식 기준 확인",
            "conditions": ["조건"],
        },
        "benefit": {
            "amount": "5년간 기본 300만 원",
            "duration": "5년",
            "type": "훈련비 지원, 대상별 200만 원 추가 가능",
        },
        "benefit_details": ["상세"],
        "period": {"start": None, "end": None, "is_ongoing": True},
        "application_organization": "고용24",
        "application_steps": ["신청"],
        "required_documents": ["신분증"],
        "faq": [{"question": "질문", "answer": "답변"}],
        "apply_url": Work24Source.live_url,
        "source_url": Work24Source.live_url,
        "status": "open",
        "tags": ["훈련"],
        "last_updated": "2026-07-27",
        "editorial": {
            "reviewer": "지원바다 편집팀",
            "verified_at": "2026-07-27",
            "scenarios": [],
            "exclusions": [],
            "calculation_examples": [],
            "timeline": [],
            "evidence": [],
        },
    }


def make_raw(*, amount: str = "5년간 기본 300만 원", status: str = "open") -> RawGrant:
    grant = make_existing_grant()
    return RawGrant(
        source_name="work24",
        id=grant["id"],
        name="크롤러가 덮어쓰면 안 되는 이름",
        slug=grant["slug"],
        category=["business"],
        topic=["finance"],
        summary="크롤러 요약",
        overview="크롤러 본문",
        age_min=None,
        age_max=None,
        income="크롤러 기준",
        conditions=["크롤러 조건"],
        benefit_amount=amount,
        benefit_duration="다른 기간",
        benefit_type=grant["benefit"]["type"],
        benefit_details=["크롤러 상세"],
        application_organization="크롤러 기관",
        application_steps=["크롤러 신청"],
        required_documents=["크롤러 서류"],
        faq=[],
        apply_url=grant["apply_url"],
        source_url=grant["source_url"],
        status=status,
        tags=["크롤러"],
        last_updated="2026-07-30",
        is_ongoing=True,
    )


class NormalizerTests(unittest.TestCase):
    def test_merge_preserves_editorial_and_curated_fields(self) -> None:
        existing = make_existing_grant()
        merged = merge_grants([existing], [make_raw(amount="5년간 기본 400만 원")])[0]

        self.assertEqual(merged["name"], existing["name"])
        self.assertEqual(merged["summary"], existing["summary"])
        self.assertEqual(merged["editorial"], existing["editorial"])
        self.assertEqual(merged["benefit"]["amount"], "5년간 기본 400만 원")
        self.assertEqual(merged["benefit"]["duration"], existing["benefit"]["duration"])
        self.assertEqual(merged["last_updated"], "2026-07-30")

    def test_unchanged_merge_keeps_last_updated(self) -> None:
        existing = make_existing_grant()
        merged = merge_grants([existing], [make_raw()])[0]
        self.assertEqual(merged, existing)

    def test_updates_are_content_based_and_retained(self) -> None:
        previous = make_existing_grant()
        current = merge_grants([previous], [make_raw(amount="5년간 기본 400만 원")])[0]
        retained = {
            "id": "older-update",
            "grant_slug": previous["slug"],
            "type": "changed",
            "title": "이전 업데이트",
            "summary": "이전 내용",
            "published_at": "2026-07-01",
        }

        updates = build_updates([previous], [current], [retained])
        self.assertEqual(len(updates), 2)
        self.assertEqual(updates[0]["published_at"], "2026-07-30")
        self.assertIn(retained, updates)

    def test_closed_transition_creates_closed_update(self) -> None:
        previous = make_existing_grant()
        current = merge_grants([previous], [make_raw(status="closed")])[0]

        updates = build_updates([previous], [current])

        self.assertEqual(len(updates), 1)
        self.assertEqual(updates[0]["type"], "closed")
        self.assertIn("접수가 마감", updates[0]["summary"])

    def test_write_outputs_does_not_touch_unchanged_files(self) -> None:
        grant = make_existing_grant()
        with tempfile.TemporaryDirectory() as directory:
            data_dir = Path(directory)
            grants_path = data_dir / "grants.json"
            updates_path = data_dir / "updates.json"
            grants_path.write_text(
                json.dumps({"updated_at": "old", "grants": [grant]}, ensure_ascii=False),
                encoding="utf-8",
            )
            updates_path.write_text(
                json.dumps({"updated_at": "old", "updates": []}, ensure_ascii=False),
                encoding="utf-8",
            )

            changed = write_outputs(
                [grant],
                [],
                "2026-07-30T00:00:00Z",
                grants_path,
                updates_path,
            )
            self.assertFalse(changed)
            self.assertEqual(
                json.loads(grants_path.read_text(encoding="utf-8"))["updated_at"],
                "old",
            )


class Work24SourceTests(unittest.TestCase):
    def test_live_parser_reads_stable_policy_markers(self) -> None:
        html = """
        <html>
          <head><title>발급안내 | 국민내일배움카드 | 직업능력개발</title></head>
          <body>
            <section id="section3">
              <p>신청기간 상시신청 가능합니다.</p>
              <p>훈련비 지원액: 5년간 300만원 + 200만원 추가 지원</p>
            </section>
          </body>
        </html>
        """
        parsed = Work24Source().parse_live(
            html,
            make_existing_grant(),
            "2026-07-30",
        )
        self.assertEqual(parsed.slug, "national-learning-card")
        self.assertEqual(parsed.benefit_amount, "5년간 기본 300만 원")
        self.assertEqual(parsed.status, "open")

    def test_live_parser_fails_when_structure_changes(self) -> None:
        with self.assertRaises(SourceParseError):
            Work24Source().parse_live(
                "<html><title>다른 페이지</title></html>",
                make_existing_grant(),
                "2026-07-30",
            )

    def test_fixture_parser_returns_current_slug(self) -> None:
        root = Path(__file__).resolve().parents[1]
        options = FetchOptions(
            use_live=False,
            fixtures_dir=root / "scripts" / "fixtures",
        )
        grants = Work24Source().crawl(options)
        self.assertEqual([grant.slug for grant in grants], ["national-learning-card"])


if __name__ == "__main__":
    unittest.main()
