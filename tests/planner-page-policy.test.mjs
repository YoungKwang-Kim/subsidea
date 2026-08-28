import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { isMonetizablePath } from "../lib/ads/monetization-policy-core.mjs";

const plannerPageUrl = new URL("../app/planner/scholarship/page.tsx", import.meta.url);
const plannerComponentUrl = new URL("../components/planner/scholarship-planner.tsx", import.meta.url);
const sitemapUrl = new URL("../app/sitemap.ts", import.meta.url);

test("신청 설계도와 개인 결과 화면에는 광고를 노출하지 않는다", () => {
  assert.equal(isMonetizablePath("/planner"), false);
  assert.equal(isMonetizablePath("/planner/scholarship"), false);
  assert.equal(isMonetizablePath("/planner/scholarship/result"), false);
});

test("플래너 소개 페이지는 방법론·사례·FAQ와 공식 확인일을 제공한다", async () => {
  const source = await readFile(plannerPageUrl, "utf8");
  assert.match(source, /판정 방법과 한계/);
  assert.match(source, /자주 묻는 질문/);
  assert.match(source, /scholarshipPlannerUpdatedAt/);
  assert.match(source, /cases\.map/);
});

test("개인 입력은 브라우저에만 저장하고 삭제·인쇄 기능을 제공한다", async () => {
  const source = await readFile(plannerComponentUrl, "utf8");
  assert.match(source, /window\.localStorage/);
  assert.match(source, /dataLayer\?\.push/);
  assert.match(source, /planner_complete/);
  assert.match(source, /입력 전체 삭제/);
  assert.match(source, /window\.print\(\)/);
  assert.equal(source.includes("fetch("), false);
});

test("플래너 공개 페이지를 사이트맵에 포함한다", async () => {
  const source = await readFile(sitemapUrl, "utf8");
  assert.match(source, /\/planner\/scholarship/);
});
