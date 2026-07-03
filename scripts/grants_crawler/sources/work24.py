from __future__ import annotations

from bs4 import BeautifulSoup

from scripts.grants_crawler.models import RawGrant
from scripts.grants_crawler.sources.base import SourceAdapter


class Work24Source(SourceAdapter):
    source_name = "work24"
    fixture_file = "work24_sample.html"
    live_url = "https://www.work24.go.kr/"

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

