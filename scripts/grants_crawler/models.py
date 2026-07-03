from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

SourceName = Literal["bokjiro", "work24"]
GrantStatus = Literal["open", "closing", "closed"]


@dataclass(slots=True)
class RawGrant:
    source_name: SourceName
    id: str
    name: str
    slug: str
    category: list[str]
    topic: list[str]
    summary: str
    overview: str
    age_min: int | None
    age_max: int | None
    income: str
    conditions: list[str]
    benefit_amount: str
    benefit_duration: str
    benefit_type: str
    benefit_details: list[str]
    application_organization: str
    application_steps: list[str]
    required_documents: list[str]
    faq: list[dict[str, str]]
    apply_url: str
    source_url: str
    status: GrantStatus
    tags: list[str]
    last_updated: str
    period_start: str | None = None
    period_end: str | None = None
    is_ongoing: bool = False


@dataclass(slots=True)
class CrawlResult:
    grants: list[RawGrant] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
