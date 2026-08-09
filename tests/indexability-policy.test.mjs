import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  indexableGrantSlugs,
  isIndexableGrantSlug,
} from "../lib/grants/index-policy-core.mjs";
import { isMonetizablePath } from "../lib/ads/monetization-policy-core.mjs";

const grantPageUrl = new URL("../app/grant/[slug]/page.tsx", import.meta.url);
const sitemapUrl = new URL("../app/sitemap.ts", import.meta.url);

test("편집 승인된 지원금만 색인과 광고 대상이 된다", () => {
  assert.equal(indexableGrantSlugs.length, 10);

  for (const slug of indexableGrantSlugs) {
    assert.equal(isIndexableGrantSlug(slug), true);
    assert.equal(isMonetizablePath(`/grant/${slug}`), true);
  }

  assert.equal(isIndexableGrantSlug("sickness-benefit-pilot"), false);
  assert.equal(isMonetizablePath("/grant/sickness-benefit-pilot"), false);
});

test("해설 상세만 광고 대상이며 탐색·정책·오류 경로는 제외한다", () => {
  assert.equal(isMonetizablePath("/guides/college-scholarship-comparison-2026"), true);
  assert.equal(isMonetizablePath("/guides"), false);
  assert.equal(isMonetizablePath("/search"), false);
  assert.equal(isMonetizablePath("/privacy"), false);
  assert.equal(isMonetizablePath("/missing-page"), false);
});

test("상세 메타데이터와 사이트맵이 같은 승인 정책을 사용한다", async () => {
  const [grantPageSource, sitemapSource] = await Promise.all([
    readFile(grantPageUrl, "utf8"),
    readFile(sitemapUrl, "utf8"),
  ]);

  assert.match(grantPageSource, /index: isIndexableGrantSlug\(grant\.slug\)/);
  assert.match(sitemapSource, /filter\(\(grant\) => isIndexableGrantSlug\(grant\.slug\)\)/);
});
