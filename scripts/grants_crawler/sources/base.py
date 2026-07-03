from __future__ import annotations

from abc import ABC, abstractmethod

from scripts.grants_crawler.common import BaseCrawlerSource, FetchOptions
from scripts.grants_crawler.models import RawGrant


class SourceAdapter(BaseCrawlerSource, ABC):
    @abstractmethod
    def parse(self, html: str) -> list[RawGrant]:
        raise NotImplementedError

    def crawl(self, options: FetchOptions) -> list[RawGrant]:
        html = self.load_html(options)
        return self.parse(html)

