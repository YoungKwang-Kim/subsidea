from __future__ import annotations

import re

from bs4 import BeautifulSoup

from scripts.grants_crawler.common import FetchOptions
from scripts.grants_crawler.models import RawGrant
from scripts.grants_crawler.sources.base import SourceAdapter, SourceParseError


class Work24Source(SourceAdapter):
    source_name = "work24"
    fixture_file = "work24_sample.html"
    live_url = "https://www.work24.go.kr/hr/h/a/1100/selectIssuGudn.do"
    monitored_slug = "national-learning-card"

    def crawl(self, options: FetchOptions) -> list[RawGrant]:
        html = self.load_html(options)
        if not options.use_live:
            grants = self.parse(html)
            if not grants:
                raise SourceParseError("work24 fixture did not contain a grant record")
            return grants

        existing = options.existing_grants.get(self.monitored_slug)
        if existing is None:
            raise SourceParseError(
                f"existing grant is required for monitored slug: {self.monitored_slug}"
            )
        return [self.parse_live(html, existing, options.observed_date)]

    def parse_live(
        self,
        html: str,
        existing: dict,
        observed_date: str,
    ) -> RawGrant:
        soup = BeautifulSoup(html, "lxml")
        title = soup.title.get_text(" ", strip=True) if soup.title else ""
        content = soup.select_one("#section3")
        if "국민내일배움카드" not in title or content is None:
            raise SourceParseError(
                "work24 page structure changed: title or #section3 was not found"
            )

        text = _normalize_text(content.get_text(" ", strip=True))
        page_text = _normalize_text(soup.get_text(" ", strip=True))
        amount_match = re.search(
            r"훈련비 지원액:\s*5년간\s*([0-9,]+)만원\s*\+?\s*([0-9,]+)만원 추가 지원",
            text,
        )
        if amount_match is None or "상시신청" not in page_text:
            raise SourceParseError(
                "work24 policy markers changed: support amount or ongoing application text is missing"
            )

        base_amount = int(amount_match.group(1).replace(",", ""))
        extra_amount = int(amount_match.group(2).replace(",", ""))
        return _raw_from_existing(
            existing,
            benefit_amount=f"5년간 기본 {base_amount:,}만 원",
            benefit_type=f"훈련비 지원, 대상별 {extra_amount:,}만 원 추가 가능",
            observed_date=observed_date,
        )

    def parse(self, html: str) -> list[RawGrant]:
        soup = BeautifulSoup(html, "lxml")
        grants: list[RawGrant] = []

        for item in soup.select("article[data-program-card]"):
            grants.append(
                RawGrant(
                    source_name="work24",
                    id=item["data-id"],
                    name=item["data-name"],
                    slug=item["data-slug"],
                    category=item["data-category"].split(","),
                    topic=item["data-topic"].split(","),
                    summary=item.select_one("[data-summary]").get_text(strip=True),
                    overview=item.select_one("[data-overview]").get_text(strip=True),
                    age_min=_parse_int(item.get("data-age-min")),
                    age_max=_parse_int(item.get("data-age-max")),
                    income=item["data-income"],
                    conditions=_split_lines(item.select_one("[data-conditions]").get_text("|", strip=True)),
                    benefit_amount=item["data-benefit-amount"],
                    benefit_duration=item["data-benefit-duration"],
                    benefit_type=item["data-benefit-type"],
                    benefit_details=_split_lines(item.select_one("[data-benefit-details]").get_text("|", strip=True)),
                    application_organization=item["data-organization"],
                    application_steps=_split_lines(item.select_one("[data-steps]").get_text("|", strip=True)),
                    required_documents=_split_lines(item.select_one("[data-documents]").get_text("|", strip=True)),
                    faq=_parse_faq(item),
                    apply_url=item["data-apply-url"],
                    source_url=item["data-source-url"],
                    status=item["data-status"],
                    tags=item["data-tags"].split(","),
                    last_updated=item["data-last-updated"],
                    period_start=item.get("data-period-start"),
                    period_end=item.get("data-period-end"),
                    is_ongoing=item.get("data-ongoing", "false") == "true",
                )
            )

        return grants


def _raw_from_existing(
    grant: dict,
    *,
    benefit_amount: str,
    benefit_type: str,
    observed_date: str,
) -> RawGrant:
    target = grant["target"]
    benefit = grant["benefit"]
    period = grant["period"]
    return RawGrant(
        source_name="work24",
        id=grant["id"],
        name=grant["name"],
        slug=grant["slug"],
        category=list(grant["category"]),
        topic=list(grant["topic"]),
        summary=grant["summary"],
        overview=grant["overview"],
        age_min=target["age_min"],
        age_max=target["age_max"],
        income=target["income"],
        conditions=list(target["conditions"]),
        benefit_amount=benefit_amount,
        benefit_duration=benefit["duration"],
        benefit_type=benefit_type,
        benefit_details=list(grant["benefit_details"]),
        application_organization=grant["application_organization"],
        application_steps=list(grant["application_steps"]),
        required_documents=list(grant["required_documents"]),
        faq=[dict(item) for item in grant["faq"]],
        apply_url=grant["apply_url"],
        source_url=Work24Source.live_url,
        status="open",
        tags=list(grant["tags"]),
        last_updated=observed_date,
        period_start=period["start"],
        period_end=period["end"],
        is_ongoing=True,
    )


def _normalize_text(value: str) -> str:
    return " ".join(value.replace("\xa0", " ").split())


def _split_lines(value: str) -> list[str]:
    return [item.strip() for item in value.split("|") if item.strip()]


def _parse_int(value: str | None) -> int | None:
    if value in (None, "", "null"):
        return None
    return int(value)


def _parse_faq(item) -> list[dict[str, str]]:
    faq_entries: list[dict[str, str]] = []
    for faq in item.select("[data-faq-item]"):
        question = faq.get("data-question", "").strip()
        answer = faq.get("data-answer", "").strip()
        if question and answer:
            faq_entries.append({"question": question, "answer": answer})
    return faq_entries
