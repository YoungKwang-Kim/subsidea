from __future__ import annotations

from abc import ABC, abstractmethod

from scripts.grants_crawler.common import BaseCrawlerSource, FetchOptions
from scripts.grants_crawler.models import RawGrant


class SourceParseError(RuntimeError):
    """Raised when a source responds but expected policy content is missing."""


class SourceAdapter(BaseCrawlerSource, ABC):
    @abstractmethod
    def parse(self, html: str) -> list[RawGrant]:
        raise NotImplementedError

    def crawl(self, options: FetchOptions) -> list[RawGrant]:
        html = self.load_html(options)
        grants = self.parse(html)
        if not grants:
            raise SourceParseError(
                f"{self.source_name} returned HTML but no supported grant records were found"
            )
        return grants
