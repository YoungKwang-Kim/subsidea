import assert from "node:assert/strict";
import test from "node:test";
import {
  auditFreshness,
  renderFreshnessMarkdown,
} from "../scripts/content-audit/freshness.mjs";

function makeGrant(overrides = {}) {
  return {
    slug: "sample-grant",
    name: "예시 지원금",
    status: "open",
    last_updated: "2026-07-20",
    period: {
      start: "2026-07-01",
      end: "2026-12-31",
      is_ongoing: false,
    },
    editorial: {
      evidence: [
        { checked_at: "2026-07-20" },
        { checked_at: "2026-07-20" },
      ],
    },
    ...overrides,
  };
}

test("healthy active grant remains ok", () => {
  const report = auditFreshness([makeGrant()], { asOf: "2026-07-30" });

  assert.equal(report.summary.ok, 1);
  assert.equal(report.results[0].nextReviewAt, "2026-08-19");
});

test("expired active status is critical", () => {
  const report = auditFreshness(
    [
      makeGrant({
        period: {
          start: "2026-05-01",
          end: "2026-07-01",
          is_ongoing: false,
        },
      }),
    ],
    { asOf: "2026-07-30" },
  );

  assert.equal(report.summary.critical, 1);
  assert.ok(
    report.results[0].findings.some(
      (finding) => finding.code === "expired-active-status",
    ),
  );
});

test("thin evidence and unknown period require review", () => {
  const report = auditFreshness(
    [
      makeGrant({
        period: { start: null, end: null, is_ongoing: false },
        editorial: { evidence: [{ checked_at: "2026-07-20" }] },
      }),
    ],
    { asOf: "2026-07-30" },
  );

  assert.equal(report.summary.warning, 1);
  assert.deepEqual(
    report.results[0].findings.map((finding) => finding.code),
    ["unknown-application-period", "thin-evidence"],
  );
});

test("closed grants use the longer review period", () => {
  const report = auditFreshness(
    [
      makeGrant({
        status: "closed",
        last_updated: "2026-05-01",
        editorial: { evidence: [{ checked_at: "2026-05-01" }] },
      }),
    ],
    { asOf: "2026-07-30" },
  );

  assert.equal(report.summary.ok, 1);
  assert.equal(report.results[0].nextReviewAt, "2026-08-29");
});

test("markdown report surfaces review findings", () => {
  const report = auditFreshness(
    [
      makeGrant({
        period: { start: null, end: null, is_ongoing: false },
        editorial: { evidence: [{ checked_at: "2026-07-20" }] },
      }),
    ],
    { asOf: "2026-07-30" },
  );
  const markdown = renderFreshnessMarkdown(report);

  assert.match(markdown, /지원금 콘텐츠 최신성 점검/);
  assert.match(markdown, /예시 지원금/);
  assert.match(markdown, /확인 필요/);
});
