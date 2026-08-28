import assert from "node:assert/strict";
import test from "node:test";
import {
  createFreshnessReviewQueue,
  renderReviewQueueMarkdown,
} from "../scripts/content-audit/review-queue.mjs";

function makeGrant(overrides = {}) {
  return {
    slug: "sample-grant",
    name: "예시 지원금",
    status: "open",
    last_updated: "2026-08-01",
    source_url: "https://example.go.kr/grant",
    period: { start: "2026-08-01", end: "2026-12-31", is_ongoing: false },
    editorial: {
      evidence: [
        {
          title: "공식 공고",
          url: "https://example.go.kr/grant",
          checked_at: "2026-08-01",
        },
        {
          title: "공식 FAQ",
          url: "https://example.go.kr/faq",
          checked_at: "2026-08-01",
        },
      ],
    },
    ...overrides,
  };
}

test("queues a healthy grant seven days before its review date", () => {
  const queue = createFreshnessReviewQueue([makeGrant()], {
    asOf: "2026-08-24",
    leadDays: 7,
  });

  assert.equal(queue.summary.total, 1);
  assert.equal(queue.summary.dueSoon, 1);
  assert.equal(queue.items[0].nextReviewAt, "2026-08-31");
  assert.equal(queue.items[0].sources.length, 2);
});

test("does not queue a healthy grant before the lead window", () => {
  const queue = createFreshnessReviewQueue([makeGrant()], {
    asOf: "2026-08-23",
    leadDays: 7,
  });

  assert.equal(queue.summary.total, 0);
});

test("always queues findings that need attention", () => {
  const queue = createFreshnessReviewQueue(
    [
      makeGrant({
        last_updated: "2026-08-20",
        period: { start: null, end: null, is_ongoing: false },
        editorial: {
          evidence: [
            {
              title: "공식 공고",
              url: "https://example.go.kr/grant",
              checked_at: "2026-08-20",
            },
          ],
        },
      }),
    ],
    { asOf: "2026-08-24", leadDays: 7 },
  );

  assert.equal(queue.summary.attention, 1);
  assert.match(renderReviewQueueMarkdown(queue), /공식 공고/);
  assert.match(
    renderReviewQueueMarkdown(queue),
    /자동화는 검토 대기열만 만들며/,
  );
});

test("rejects an invalid lead window", () => {
  assert.throws(
    () =>
      createFreshnessReviewQueue([makeGrant()], {
        asOf: "2026-08-24",
        leadDays: -1,
      }),
    /leadDays/,
  );
});
