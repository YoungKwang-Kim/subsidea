const ACTIVE_STATUSES = new Set(["open", "closing", "upcoming"]);
const DAY_MS = 24 * 60 * 60 * 1000;

const parseDate = (value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const daysBetween = (from, to) =>
  Math.floor((to.getTime() - from.getTime()) / DAY_MS);

const addDays = (date, days) =>
  new Date(date.getTime() + days * DAY_MS).toISOString().slice(0, 10);

function createFinding(severity, code, message) {
  return { severity, code, message };
}

export function auditFreshness(grants, options = {}) {
  const asOf = parseDate(options.asOf ?? new Date().toISOString().slice(0, 10));

  if (!asOf) {
    throw new Error("asOf must use YYYY-MM-DD format.");
  }

  const activeReviewDays = options.activeReviewDays ?? 30;
  const closedReviewDays = options.closedReviewDays ?? 120;
  const results = grants.map((grant) => {
    const findings = [];
    const lastUpdated = parseDate(grant.last_updated);
    const active = ACTIVE_STATUSES.has(grant.status);
    const reviewDays = active ? activeReviewDays : closedReviewDays;

    if (!lastUpdated) {
      findings.push(createFinding("critical", "invalid-review-date", "마지막 확인일 형식이 올바르지 않습니다."));
    } else {
      const ageDays = daysBetween(lastUpdated, asOf);
      if (ageDays > reviewDays) {
        findings.push(
          createFinding(
            "critical",
            "stale-review",
            `마지막 확인 후 ${ageDays}일이 지나 재검토 주기 ${reviewDays}일을 초과했습니다.`,
          ),
        );
      }
    }

    const periodStart = grant.period?.start ? parseDate(grant.period.start) : null;
    const periodEnd = grant.period?.end ? parseDate(grant.period.end) : null;

    if (["open", "closing"].includes(grant.status) && periodEnd && periodEnd < asOf) {
      findings.push(
        createFinding(
          "critical",
          "expired-active-status",
          `접수 종료일 ${grant.period.end}이 지났지만 상태가 ${grant.status}입니다.`,
        ),
      );
    }

    if (grant.status === "upcoming" && periodStart && periodStart < asOf) {
      findings.push(
        createFinding(
          "critical",
          "started-upcoming-status",
          `접수 시작일 ${grant.period.start}이 지났지만 상태가 upcoming입니다.`,
        ),
      );
    }

    if (
      active &&
      !grant.period?.is_ongoing &&
      !grant.period?.start &&
      !grant.period?.end
    ) {
      findings.push(
        createFinding(
          "warning",
          "unknown-application-period",
          "신청 가능 상태지만 상시 여부와 접수기간이 명확하지 않습니다.",
        ),
      );
    }

    const evidence = grant.editorial?.evidence ?? [];
    if (evidence.length === 0) {
      findings.push(
        createFinding("critical", "missing-evidence", "공식 근거가 등록되지 않았습니다."),
      );
    } else if (active && evidence.length < 2) {
      findings.push(
        createFinding(
          "warning",
          "thin-evidence",
          "신청 가능 항목의 공식 근거가 1개뿐이어서 교차 확인이 필요합니다.",
        ),
      );
    }

    const staleEvidence = evidence.filter((item) => {
      const checkedAt = parseDate(item.checked_at);
      return !checkedAt || daysBetween(checkedAt, asOf) > reviewDays;
    });

    if (staleEvidence.length > 0) {
      findings.push(
        createFinding(
          "warning",
          "stale-evidence",
          `공식 근거 ${staleEvidence.length}개의 확인일이 재검토 주기를 초과했습니다.`,
        ),
      );
    }

    const hasCritical = findings.some((item) => item.severity === "critical");
    const hasWarning = findings.some((item) => item.severity === "warning");

    return {
      slug: grant.slug,
      name: grant.name,
      status: grant.status,
      lastUpdated: grant.last_updated,
      nextReviewAt: lastUpdated ? addDays(lastUpdated, reviewDays) : null,
      evidenceCount: evidence.length,
      level: hasCritical ? "critical" : hasWarning ? "warning" : "ok",
      findings,
    };
  });

  return {
    asOf: asOf.toISOString().slice(0, 10),
    policy: { activeReviewDays, closedReviewDays },
    summary: {
      total: results.length,
      ok: results.filter((item) => item.level === "ok").length,
      warning: results.filter((item) => item.level === "warning").length,
      critical: results.filter((item) => item.level === "critical").length,
    },
    results,
  };
}

const levelLabel = {
  ok: "정상",
  warning: "확인 필요",
  critical: "기한 초과",
};

export function renderFreshnessMarkdown(report) {
  const attention = report.results.filter((item) => item.level !== "ok");
  const lines = [
    "# 지원금 콘텐츠 최신성 점검",
    "",
    `- 점검 기준일: ${report.asOf}`,
    `- 재검토 주기: 신청 가능·예정 ${report.policy.activeReviewDays}일 / 마감 ${report.policy.closedReviewDays}일`,
    `- 결과: 전체 ${report.summary.total}개 · 정상 ${report.summary.ok}개 · 확인 필요 ${report.summary.warning}개 · 기한 초과 ${report.summary.critical}개`,
    "",
    "## 우선 확인 항목",
    "",
  ];

  if (attention.length === 0) {
    lines.push("현재 우선 확인이 필요한 항목이 없습니다.", "");
  } else {
    for (const item of attention) {
      lines.push(
        `### ${item.name} (\`${item.slug}\`) · ${levelLabel[item.level]}`,
        "",
        ...item.findings.map(
          (finding) =>
            `- [${finding.severity === "critical" ? "긴급" : "점검"}] ${finding.message}`,
        ),
        "",
      );
    }
  }

  lines.push(
    "## 전체 검토 일정",
    "",
    "| 지원금 | 상태 | 마지막 확인 | 다음 검토 | 근거 | 판정 |",
    "| --- | --- | --- | --- | ---: | --- |",
    ...report.results
      .slice()
      .sort((a, b) => {
        const levelOrder = { critical: 0, warning: 1, ok: 2 };
        return (
          levelOrder[a.level] - levelOrder[b.level] ||
          (a.nextReviewAt ?? "").localeCompare(b.nextReviewAt ?? "")
        );
      })
      .map(
        (item) =>
          `| ${item.name} | ${item.status} | ${item.lastUpdated} | ${item.nextReviewAt ?? "-"} | ${item.evidenceCount} | ${levelLabel[item.level]} |`,
      ),
    "",
    "## 판정 기준",
    "",
    "- 신청 가능·마감 임박·신청 예정 항목은 마지막 확인 후 30일 안에 재검토합니다.",
    "- 마감 항목은 마지막 확인 후 120일 안에 상태와 다음 모집 여부를 재검토합니다.",
    "- 접수 종료일이 지난 신청 가능 항목과 시작일이 지난 신청 예정 항목은 기한 초과로 처리합니다.",
    "- 신청 가능 항목의 공식 근거가 1개뿐이거나 접수기간이 불명확하면 확인 필요로 표시합니다.",
    "",
  );

  return lines.join("\n");
}
