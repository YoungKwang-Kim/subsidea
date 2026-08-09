import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const pageSourceUrl = new URL("../app/grant/[slug]/page.tsx", import.meta.url);
const guideSourceUrl = new URL("../lib/grants/core-decision-guides.ts", import.meta.url);

test("지원금 상세 템플릿에 공통 필러 문구가 다시 들어가지 않는다", async () => {
  const source = await readFile(pageSourceUrl, "utf8");
  const fillerPhrases = [
    "지원금 이름만 보고 신청 가능하다고 판단하지 말고",
    "비슷한 제도라도 현금, 바우처, 대출",
    "최종 신청 전에는 반드시 공식 공고문",
    "이 페이지는 {grant.name}의 핵심 조건",
  ];

  for (const phrase of fillerPhrases) {
    assert.equal(source.includes(phrase), false, `공통 필러 문구가 남아 있습니다: ${phrase}`);
  }
});

test("검색 노출 핵심 지원금은 독립적인 판단 가이드를 갖는다", async () => {
  const source = await readFile(guideSourceUrl, "utf8");
  const coreSlugs = [
    "national-work-scholarship",
    "youth-future-savings",
    "national-employment-support-program",
    "youth-monthly-rent-support",
    "newborn-special-jeonse-loan",
  ];

  for (const slug of coreSlugs) {
    assert.match(source, new RegExp(`"${slug}"\\s*:`));
  }
});
