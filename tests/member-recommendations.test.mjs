import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createMemberRecommendations } from "../lib/recommendation/member-recommendations-core.mjs";

const grantsUrl = new URL("../data/grants.json", import.meta.url);
const grantsData = JSON.parse(await readFile(grantsUrl, "utf8"));

const answers = {
  ageGroup: "19to34",
  situations: ["job-seeking"],
  housing: "wolse",
  income: "50to100",
  residenceSido: "서울",
};

test("회원 추천은 종료된 지원금을 제외하고 최대 개수를 지킨다", () => {
  const recommendations = createMemberRecommendations(
    grantsData.grants,
    answers,
    5,
  );

  assert.ok(recommendations.length <= 5);
  assert.ok(recommendations.every(({ grant }) => grant.status !== "closed"));
});

test("회원 추천은 추천 이유와 공식 확인 주의를 함께 제공한다", () => {
  const [recommendation] = createMemberRecommendations(
    grantsData.grants,
    answers,
    1,
  );

  assert.ok(recommendation);
  assert.ok(recommendation.reasons.length > 0);
  assert.match(recommendation.cautions.join(" "), /공식 공고/);
  assert.match(recommendation.cautions.join(" "), /서울/);
});
