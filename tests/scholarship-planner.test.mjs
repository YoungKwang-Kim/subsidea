import test from "node:test";
import assert from "node:assert/strict";
import {
  createScholarshipPlan,
  getPlannerProgramCount,
  initialScholarshipProfile,
} from "../lib/planner/scholarship-planner-core.mjs";

const readyStudent = {
  ...initialScholarshipProfile,
  goals: ["tuition", "living", "housing"],
  nationality: "korean",
  academicStatus: "continuing",
  year: "3",
  major: "humanities",
  grade: "90plus",
  credits: "eligible",
  supportBand: "basic",
  siblingCount: "3plus",
  birthOrder: "thirdplus",
  maritalStatus: "unmarried",
  age: "under40",
  remoteStudy: "yes",
  canWork: "yes",
};

function resultFor(profile, id) {
  return createScholarshipPlan(profile).results.find((result) => result.id === id);
}

test("플래너는 검토 대상 장학금 7종을 유지한다", () => {
  assert.equal(getPlannerProgramCount(), 7);
  assert.equal(createScholarshipPlan(readyStudent).results.length, 7);
});

const scenarios = [
  ["I유형 기본 대상", {}, "national-scholarship-type-1", ["priority", "consider"]],
  ["II유형 대학 확인 필요", {}, "national-scholarship-type-2", ["consider"]],
  ["다자녀 기본 대상", {}, "multi-child-national-scholarship", ["priority", "consider"]],
  ["국가근로 기본 대상", {}, "national-work-scholarship", ["priority", "consider"]],
  ["주거안정 기본 대상", {}, "housing-stability-scholarship", ["priority", "consider"]],
  ["인문100년 3학년", {}, "humanities-100-years-scholarship", ["priority", "consider"]],
  ["이공계 전공 불일치", {}, "national-science-engineering-excellence-scholarship", ["unlikely"]],
  ["비국적자", { nationality: "other" }, "national-scholarship-type-1", ["unlikely"]],
  ["비재학생", { academicStatus: "not-enrolled" }, "national-work-scholarship", ["unlikely"]],
  ["10구간 I유형", { supportBand: "10plus" }, "national-scholarship-type-1", ["unlikely"]],
  ["10구간 다자녀", { supportBand: "10plus" }, "multi-child-national-scholarship", ["unlikely"]],
  ["10구간 국가근로", { supportBand: "10plus" }, "national-work-scholarship", ["unlikely"]],
  ["세 자녀 미만", { siblingCount: "under3" }, "multi-child-national-scholarship", ["unlikely"]],
  ["기혼 다자녀 신청자", { maritalStatus: "married" }, "multi-child-national-scholarship", ["unlikely"]],
  ["근로 불가능", { canWork: "no" }, "national-work-scholarship", ["unlikely"]],
  ["원거리 아님", { remoteStudy: "no" }, "housing-stability-scholarship", ["unlikely"]],
  ["40세 이상 주거안정", { age: "40plus" }, "housing-stability-scholarship", ["unlikely"]],
  ["기혼 주거안정", { maritalStatus: "married" }, "housing-stability-scholarship", ["unlikely"]],
  ["일반 지원구간 주거안정", { supportBand: "4to6" }, "housing-stability-scholarship", ["unlikely"]],
  ["인문 전공 인문100년", { major: "humanities" }, "humanities-100-years-scholarship", ["priority", "consider"]],
  ["이공계 전공 이공계장학", { major: "stem" }, "national-science-engineering-excellence-scholarship", ["priority", "consider"]],
  ["기타 전공 인문100년", { major: "other" }, "humanities-100-years-scholarship", ["unlikely"]],
  ["인문 전공 이공계장학", { major: "humanities" }, "national-science-engineering-excellence-scholarship", ["unlikely"]],
  ["이공계 전공 인문100년", { major: "stem" }, "humanities-100-years-scholarship", ["unlikely"]],
  ["성적 70점 미만 국가근로", { grade: "below70" }, "national-work-scholarship", ["check", "unlikely"]],
  ["성적 70점대 I유형", { grade: "70to79" }, "national-scholarship-type-1", ["check", "unlikely"]],
  ["신입생 성적 미입력", { academicStatus: "first-year", grade: "unknown", credits: "unknown" }, "national-scholarship-type-1", ["priority", "consider"]],
  ["정보 미입력 안전 판정", initialScholarshipProfile, "national-scholarship-type-1", ["check"]],
  ["생활비 목표 국가근로", { goals: ["living"] }, "national-work-scholarship", ["priority", "consider"]],
  ["주거비 목표 주거안정", { goals: ["housing"] }, "housing-stability-scholarship", ["priority", "consider"]],
];

for (const [name, override, id, expectedLevels] of scenarios) {
  test(`시나리오: ${name}`, () => {
    const base = override === initialScholarshipProfile ? initialScholarshipProfile : { ...readyStudent, ...override };
    const result = resultFor(base, id);
    assert.ok(expectedLevels.includes(result.level), `${id} 결과가 ${result.level}입니다.`);
    assert.ok(result.reasons.length + result.missing.length + result.cautions.length > 0);
  });
}

test("실행계획은 신청 순서와 통합 서류를 만든다", () => {
  const plan = createScholarshipPlan(readyStudent);
  assert.ok(plan.summary.priority <= 3);
  assert.ok(plan.timeline.some((item) => item.title.includes("통합 신청")));
  assert.ok(plan.timeline.some((item) => item.title.includes("교내 추천")));
  assert.ok(plan.documents.some((item) => item.includes("주거비")));
  assert.ok(plan.documents.some((item) => item.includes("희망근로지")));
});

test("통합신청과 목적별 조합 관계를 설명한다", () => {
  const plan = createScholarshipPlan(readyStudent);
  assert.ok(plan.compatibility.some((item) => item.status === "integrated"));
  assert.ok(plan.compatibility.some((item) => item.status === "compatible"));
  assert.ok(plan.compatibility.some((item) => item.status === "tuition-cap"));
});
