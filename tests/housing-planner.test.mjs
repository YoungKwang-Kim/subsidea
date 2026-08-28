import test from "node:test";
import assert from "node:assert/strict";
import { createHousingPlan, initialHousingProfile } from "../lib/planner/housing-planner-core.mjs";

const profile = (overrides) => ({ ...initialHousingProfile, goal: "both", homeless: "yes", depositPaid: "yes", existingHousingLoan: "no", ...overrides });
const result = (plan, id) => plan.results.find((item) => item.id === id);

const scenarios = [
  ["저소득 월세가구", { goal: "monthly", housingIncome: "eligible" }, "housing-benefit", "priority"],
  ["주거급여 소득초과", { goal: "monthly", housingIncome: "over" }, "housing-benefit", "unlikely"],
  ["청년 전세 기본", { age: "youth", annualIncome: "under50" }, "youth-buteumok-jeonse-loan", "priority"],
  ["청년 연령 초과", { age: "over34", annualIncome: "under50" }, "youth-buteumok-jeonse-loan", "unlikely"],
  ["청년 소득 초과", { age: "youth", annualIncome: "under75" }, "youth-buteumok-jeonse-loan", "unlikely"],
  ["신혼 전세 기본", { maritalStatus: "newlywed", annualIncome: "under75" }, "newlywed-jeonse-loan", "priority"],
  ["신혼 요건 불일치", { maritalStatus: "other", annualIncome: "under50" }, "newlywed-jeonse-loan", "unlikely"],
  ["신혼 소득 초과", { maritalStatus: "newlywed", annualIncome: "under130" }, "newlywed-jeonse-loan", "unlikely"],
  ["신생아 특례 기본", { newborn: "yes", annualIncome: "under130" }, "newborn-special-jeonse-loan", "priority"],
  ["신생아 요건 없음", { newborn: "no", annualIncome: "under50" }, "newborn-special-jeonse-loan", "unlikely"],
  ["신생아 맞벌이 상한", { newborn: "yes", annualIncome: "under200", incomeType: "dual" }, "newborn-special-jeonse-loan", "priority"],
  ["신생아 외벌이 1.3억 초과", { newborn: "yes", annualIncome: "under200", incomeType: "single" }, "newborn-special-jeonse-loan", "unlikely"],
  ["신생아 소득형태 미정", { newborn: "yes", annualIncome: "under200", incomeType: "unknown" }, "newborn-special-jeonse-loan", "check"],
  ["신생아 소득 초과", { newborn: "yes", annualIncome: "over200" }, "newborn-special-jeonse-loan", "unlikely"],
  ["주택 보유", { homeless: "no", age: "youth", annualIncome: "under50" }, "youth-buteumok-jeonse-loan", "unlikely"],
  ["계약금 미지급", { depositPaid: "no", age: "youth", annualIncome: "under50" }, "youth-buteumok-jeonse-loan", "check"],
  ["기존 대출 있음", { existingHousingLoan: "yes", age: "youth", annualIncome: "under50" }, "youth-buteumok-jeonse-loan", "check"],
  ["일반 버팀목 기본", { age: "over34", annualIncome: "under50" }, "buteumok-jeonse-loan", "consider"],
  ["일반 버팀목 소득초과", { age: "over34", annualIncome: "under75" }, "buteumok-jeonse-loan", "unlikely"],
  ["월세 목표에서 전세대출", { goal: "monthly", age: "youth", annualIncome: "under50" }, "youth-buteumok-jeonse-loan", "unlikely"],
  ["모든 정보 미정", {}, "housing-benefit", "consider"],
];

for (const [name, values, id, level] of scenarios) {
  test(`주거 시나리오: ${name}`, () => {
    const plan = createHousingPlan(name === "모든 정보 미정" ? initialHousingProfile : profile(values));
    assert.equal(result(plan, id)?.level, level);
  });
}

test("우선 확인은 최대 3개다", () => {
  const plan = createHousingPlan(profile({ age: "youth", maritalStatus: "newlywed", newborn: "yes", annualIncome: "under50", housingIncome: "eligible" }));
  assert.ok(plan.results.filter((item) => item.level === "priority").length <= 3);
});

test("실행계획은 서류와 신청 순서를 제공한다", () => {
  const plan = createHousingPlan(profile({ age: "youth", annualIncome: "under50" }));
  assert.ok(plan.documents.length >= 5);
  assert.ok(plan.timeline.length >= 5);
  assert.ok(plan.compatibility.some((item) => item.title.includes("전세대출")));
});
