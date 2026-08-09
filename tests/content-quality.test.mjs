import test from "node:test";
import assert from "node:assert/strict";
import { auditQuality, renderQualityMarkdown } from "../scripts/content-audit/quality.mjs";

function makeGrant(overrides = {}) {
  return {
    slug: "quality-grant",
    title: "품질 지원금",
    summary: "충분한 요약 정보".repeat(15),
    overview: "신청자가 판단에 사용할 수 있는 상세한 제도 설명".repeat(40),
    target: { income: "중위소득 기준", conditions: ["조건 1", "조건 2", "조건 3"] },
    benefit: { amount: "월 10만원", duration: "12개월", type: "현금" },
    benefit_details: ["혜택 1", "혜택 2", "혜택 3"],
    application_steps: ["절차 1", "절차 2", "절차 3"],
    required_documents: ["서류 1", "서류 2", "서류 3"],
    faq: [
      { question: "질문 1", answer: "답변 1" },
      { question: "질문 2", answer: "답변 2" },
      { question: "질문 3", answer: "답변 3" },
    ],
    editorial: {
      evidence: [{ url: "https://example.com/1" }, { url: "https://example.com/2" }],
      scenarios: [
        { title: "사례 1", description: "해당 가능성이 높은 사례" },
        { title: "사례 2", description: "추가 확인이 필요한 사례" },
        { title: "사례 3", description: "해당 가능성이 낮은 사례" },
      ],
      exclusions: ["제외 1", "제외 2", "제외 3"],
      calculation_examples: ["예시 1", "예시 2", "예시 3"],
      timeline: ["일정 1", "일정 2", "일정 3", "일정 4"],
    },
    ...overrides,
  };
}

test("완성도 기준을 충족한 콘텐츠는 통과한다", () => {
  const report = auditQuality([makeGrant()]);

  assert.equal(report.summary.passed, 1);
  assert.equal(report.findings.length, 0);
});

test("얇은 콘텐츠의 부족 항목을 각각 보고한다", () => {
  const report = auditQuality([
    makeGrant({
      summary: "짧음",
      overview: "짧음",
      faq: [],
      editorial: { ...makeGrant().editorial, evidence: [] },
    }),
  ]);
  const codes = new Set(report.findings.map((item) => item.code));

  assert.equal(report.summary.affected, 1);
  assert.equal(codes.has("insufficient-content"), true);
  assert.equal(codes.has("thin-faq"), true);
  assert.equal(codes.has("thin-evidence"), true);
});

test("마크다운 보고서에 감사 결과를 표시한다", () => {
  const markdown = renderQualityMarkdown(auditQuality([makeGrant()]));

  assert.match(markdown, /콘텐츠 품질 감사/);
  assert.match(markdown, /기준 통과: 1개/);
});

test("긴 설명 문장이 여러 지원금에 복제되면 경고한다", () => {
  const repeatedCopy =
    "신청 전에 공식 공고를 확인하고 필요한 서류와 접수 일정을 준비해야 한다는 동일한 설명 문장입니다.";
  const grants = ["grant-a", "grant-b", "grant-c"].map((slug) =>
    makeGrant({
      slug,
      summary: repeatedCopy,
    }),
  );
  const report = auditQuality(grants);
  const repeatedFindings = report.findings.filter((item) => item.code === "repeated-long-copy");

  assert.equal(repeatedFindings.length, 3);
  assert.deepEqual(
    repeatedFindings.map((item) => item.slug).sort(),
    ["grant-a", "grant-b", "grant-c"],
  );
});
