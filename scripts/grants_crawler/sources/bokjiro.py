from __future__ import annotations

from bs4 import BeautifulSoup

from scripts.grants_crawler.models import RawGrant
from scripts.grants_crawler.sources.base import SourceAdapter


class BokjiroSource(SourceAdapter):
    source_name = "bokjiro"
    fixture_file = "bokjiro_sample.html"
    live_url = "https://www.bokjiro.go.kr/"

    def parse(self, html: str) -> list[RawGrant]:
        soup = BeautifulSoup(html, "lxml")
        grants: list[RawGrant] = []

        for card in soup.select("[data-grant-card]"):
            grants.append(
                RawGrant(
                    source_name="bokjiro",
                    id=card["data-id"],
                    name=card["data-name"],
                    slug=card["data-slug"],
                    category=card["data-category"].split(","),
                    topic=card["data-topic"].split(","),
                    summary=card.select_one("[data-summary]").get_text(strip=True),
                    overview=card.select_one("[data-overview]").get_text(strip=True),
                    age_min=_parse_int(card.get("data-age-min")),
                    age_max=_parse_int(card.get("data-age-max")),
                    income=card["data-income"],
                    conditions=_split_lines(card.select_one("[data-conditions]").get_text("|", strip=True)),
                    benefit_amount=card["data-benefit-amount"],
                    benefit_duration=card["data-benefit-duration"],
                    benefit_type=card["data-benefit-type"],
                    benefit_details=_split_lines(card.select_one("[data-benefit-details]").get_text("|", strip=True)),
                    application_organization=card["data-organization"],
                    application_steps=_split_lines(card.select_one("[data-steps]").get_text("|", strip=True)),
                    required_documents=_split_lines(card.select_one("[data-documents]").get_text("|", strip=True)),
                    faq=_parse_faq(card),
                    apply_url=card["data-apply-url"],
                    source_url=card["data-source-url"],
                    status=card["data-status"],
                    tags=card["data-tags"].split(","),
                    last_updated=card["data-last-updated"],
                    period_start=card.get("data-period-start"),
                    period_end=card.get("data-period-end"),
                    is_ongoing=card.get("data-ongoing", "false") == "true",
                )
            )

        return grants


def _split_lines(value: str) -> list[str]:
    return [item.strip() for item in value.split("|") if item.strip()]


def _parse_int(value: str | None) -> int | None:
    if value in (None, "", "null"):
        return None
    return int(value)


def _parse_faq(card) -> list[dict[str, str]]:
    faq_entries: list[dict[str, str]] = []
    for faq in card.select("[data-faq-item]"):
        question = faq.get("data-question", "").strip()
        answer = faq.get("data-answer", "").strip()
        if question and answer:
            faq_entries.append({"question": question, "answer": answer})
    return faq_entries

