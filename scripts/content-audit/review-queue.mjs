import { auditFreshness } from "./freshness.mjs";

const DAY_MS = 24 * 60 * 60 * 1000;

const parseDate = (value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const daysBetween = (from, to) =>
  Math.floor((to.getTime() - from.getTime()) / DAY_MS);

function collectSources(grant) {
  const sources = [
    ...(grant.editorial?.evidence ?? []).map((evidence) => ({
      title: evidence.title,
      url: evidence.url,
      checkedAt: evidence.checked_at,
    })),
    grant.source_url
      ? {
          title: "대표 공식 출처",
          url: grant.source_url,
          checkedAt: grant.last_updated,
        }
      : null,
  ].filter(Boolean);

  return sources.filter(
    (source, index) =>
      source.url &&
      sources.findIndex((candidate) => candidate.url === source.url) === index,
  );
}

export function createFreshnessReviewQueue(grants, options = {}) {
  const leadDays = options.leadDays ?? 7;
  if (!Number.isInteger(leadDays) || leadDays < 0) {
    throw new Error("leadDays must be a non-negative integer.");
  }

  const report = auditFreshness(grants, options);
  const asOf = parseDate(report.asOf);
  const grantsBySlug = new Map(grants.map((grant) => [grant.slug, grant]));
  const items = report.results
    .map((result) => {
      const nextReviewAt = parseDate(result.nextReviewAt);
      const daysUntilReview = nextReviewAt
        ? daysBetween(asOf, nextReviewAt)
        : null;
      const dueSoon = daysUntilReview !== null && daysUntilReview <= leadDays;

      if (result.level === "ok" && !dueSoon) return null;

      const grant = grantsBySlug.get(result.slug);
      return {
        ...result,
        daysUntilReview,
        urgency:
          result.level === "critical" ||
          (daysUntilReview !== null && daysUntilReview < 0)
            ? "overdue"
            : daysUntilReview === 0
              ? "due-today"
              : dueSoon
                ? "due-soon"
                : "attention",
        sources: grant ? collectSources(grant) : [],
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const urgencyOrder = {
        overdue: 0,
        "due-today": 1,
        attention: 2,
        "due-soon": 3,
      };
      return (
        urgencyOrder[a.urgency] - urgencyOrder[b.urgency] ||
        (a.daysUntilReview ?? Number.MAX_SAFE_INTEGER) -
          (b.daysUntilReview ?? Number.MAX_SAFE_INTEGER) ||
        a.name.localeCompare(b.name, "ko")
      );
    });

  return {
    asOf: report.asOf,
    leadDays,
    summary: {
      total: items.length,
      overdue: items.filter((item) => item.urgency === "overdue").length,
      dueToday: items.filter((item) => item.urgency === "due-today").length,
      dueSoon: items.filter((item) => item.urgency === "due-soon").length,
      attention: items.filter((item) => item.urgency === "attention").length,
    },
    items,
  };
}

const urgencyLabel = {
  overdue: "기한 초과",
  "due-today": "오늘 검토",
  "due-soon": "검토 예정",
  attention: "추가 확인",
};

export function renderReviewQueueMarkdown(queue) {
  const lines = [
    "# 지원금 콘텐츠 검토 대기열",
    "",
    `- 기준일: ${queue.asOf} (Asia/Seoul)`,
    `- 사전 알림: 검토 예정일 ${queue.leadDays}일 전부터`,
    `- 대상: ${queue.summary.total}개 · 기한 초과 ${queue.summary.overdue}개 · 오늘 ${queue.summary.dueToday}개 · 예정 ${queue.summary.dueSoon}개 · 추가 확인 ${queue.summary.attention}개`,
    "",
  ];

  if (queue.items.length === 0) {
    lines.push("현재 검토 대기 항목이 없습니다.", "");
    return lines.join("\n");
  }

  lines.push(
    "| 우선순위 | 지원금 | 상태 | 마지막 확인 | 다음 검토 | 공식 출처 |",
    "| --- | --- | --- | --- | --- | ---: |",
    ...queue.items.map(
      (item) =>
        `| ${urgencyLabel[item.urgency]} | [${item.name}](https://subsidea.net/grant/${item.slug}) | ${item.status} | ${item.lastUpdated ?? "-"} | ${item.nextReviewAt ?? "-"} | ${item.sources.length} |`,
    ),
    "",
    "## 확인할 공식 출처",
    "",
  );

  for (const item of queue.items) {
    lines.push(`### ${item.name}`, "");
    if (item.findings.length > 0) {
      lines.push(...item.findings.map((finding) => `- ${finding.message}`));
    }
    if (item.sources.length > 0) {
      lines.push(
        ...item.sources.map(
          (source) =>
            `- [${source.title || "공식 자료"}](${source.url}) · 마지막 확인 ${source.checkedAt ?? "-"}`,
        ),
      );
    } else {
      lines.push("- 등록된 공식 출처가 없습니다.");
    }
    lines.push("");
  }

  lines.push(
    "## 운영 원칙",
    "",
    "- 공식 기관 자료를 직접 확인한 뒤에만 내용과 확인일을 갱신합니다.",
    "- 자동화는 검토 대기열만 만들며 `data/grants.json`을 수정하지 않습니다.",
    "- 변경 후 데이터 검증, 콘텐츠 테스트, 배포 결과를 함께 확인합니다.",
    "",
  );

  return lines.join("\n");
}
