const DEFAULT_THRESHOLDS = {
  contentCharacters: 900,
  faq: 3,
  evidence: 2,
  conditions: 3,
  benefitDetails: 3,
  applicationSteps: 3,
  requiredDocuments: 3,
  exclusions: 3,
  calculationExamples: 3,
  timeline: 4,
  repeatedLongCopyCharacters: 45,
  repeatedLongCopyGrants: 2,
};

function normalizeText(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function collectEditorialTextBlocks(grant) {
  return [
    grant.summary,
    grant.overview,
    grant.target?.income,
    ...(grant.target?.conditions ?? []),
    ...(grant.conditions ?? []),
    ...(grant.benefit_details ?? []),
    ...(grant.application_steps ?? []),
    ...(grant.faq ?? []).flatMap((item) => [item.question, item.answer]),
    ...(grant.editorial?.scenarios ?? []).flatMap((item) => [item.title, item.description]),
    ...(grant.editorial?.exclusions ?? []),
    ...(grant.editorial?.calculation_examples ?? []),
    ...(grant.editorial?.timeline ?? []),
  ]
    .map(normalizeText)
    .filter(Boolean);
}

function countCharacters(grant) {
  const values = [
    grant.summary,
    grant.overview,
    grant.target?.income,
    ...(grant.target?.conditions ?? []),
    grant.benefit?.amount,
    grant.benefit?.duration,
    grant.benefit?.type,
    ...(grant.conditions ?? []),
    ...(grant.benefit_details ?? []),
    ...(grant.application_steps ?? []),
    ...(grant.required_documents ?? []),
    ...(grant.faq ?? []).flatMap((item) => [item.question, item.answer]),
    ...(grant.editorial?.scenarios ?? []).flatMap((item) => [item.title, item.description]),
    ...(grant.editorial?.exclusions ?? []),
    ...(grant.editorial?.calculation_examples ?? []),
    ...(grant.editorial?.timeline ?? []),
  ];

  return values.filter(Boolean).join("").replace(/\s/g, "").length;
}

function addFinding(findings, grant, code, level, actual, expected, message) {
  findings.push({
    slug: grant.slug,
    title: grant.name ?? grant.title,
    code,
    level,
    actual,
    expected,
    message,
  });
}

export function auditQuality(grants, options = {}) {
  const thresholds = { ...DEFAULT_THRESHOLDS, ...options.thresholds };
  const findings = [];

  for (const grant of grants) {
    const checks = [
      ["insufficient-content", "critical", countCharacters(grant), thresholds.contentCharacters, "본문 정보량"],
      ["thin-faq", "critical", grant.faq?.length ?? 0, thresholds.faq, "자주 묻는 질문"],
      ["thin-evidence", "critical", grant.editorial?.evidence?.length ?? 0, thresholds.evidence, "공식 근거"],
      ["thin-conditions", "warning", grant.target?.conditions?.length ?? 0, thresholds.conditions, "신청 조건"],
      ["thin-benefits", "warning", grant.benefit_details?.length ?? 0, thresholds.benefitDetails, "지원 내용"],
      ["thin-steps", "warning", grant.application_steps?.length ?? 0, thresholds.applicationSteps, "신청 절차"],
      ["thin-documents", "warning", grant.required_documents?.length ?? 0, thresholds.requiredDocuments, "필요 서류"],
      ["thin-exclusions", "warning", grant.editorial?.exclusions?.length ?? 0, thresholds.exclusions, "제외·주의 조건"],
      ["thin-examples", "warning", grant.editorial?.calculation_examples?.length ?? 0, thresholds.calculationExamples, "계산 예시"],
      ["thin-timeline", "warning", grant.editorial?.timeline?.length ?? 0, thresholds.timeline, "신청 일정"],
    ];

    for (const [code, level, actual, expected, label] of checks) {
      if (actual < expected) {
        addFinding(
          findings,
          grant,
          code,
          level,
          actual,
          expected,
          label + "이(가) 품질 기준보다 부족합니다.",
        );
      }
    }
  }

  const textUsage = new Map();

  for (const grant of grants) {
    const uniqueBlocks = new Set(
      collectEditorialTextBlocks(grant).filter(
        (text) => text.replace(/\s/g, "").length >= thresholds.repeatedLongCopyCharacters,
      ),
    );

    for (const text of uniqueBlocks) {
      const slugs = textUsage.get(text) ?? new Set();
      slugs.add(grant.slug);
      textUsage.set(text, slugs);
    }
  }

  const grantsWithRepeatedCopy = new Set();

  for (const slugs of textUsage.values()) {
    if (slugs.size > thresholds.repeatedLongCopyGrants) {
      for (const slug of slugs) {
        grantsWithRepeatedCopy.add(slug);
      }
    }
  }

  for (const grant of grants) {
    if (grantsWithRepeatedCopy.has(grant.slug)) {
      addFinding(
        findings,
        grant,
        "repeated-long-copy",
        "warning",
        ">" + thresholds.repeatedLongCopyGrants,
        thresholds.repeatedLongCopyGrants,
        "긴 설명 문장이 여러 지원금에 반복됩니다. 제도별 판단 정보로 다시 작성하세요.",
      );
    }
  }

  const affectedSlugs = new Set(findings.map((item) => item.slug));
  return {
    generatedAt: new Date().toISOString(),
    thresholds,
    findings,
    summary: {
      total: grants.length,
      passed: grants.length - affectedSlugs.size,
      affected: affectedSlugs.size,
      critical: findings.filter((item) => item.level === "critical").length,
      warning: findings.filter((item) => item.level === "warning").length,
    },
  };
}

export function renderQualityMarkdown(report) {
  const lines = [
    "## 콘텐츠 품질 감사",
    "",
    "- 전체 지원금: " + report.summary.total + "개",
    "- 기준 통과: " + report.summary.passed + "개",
    "- 보완 필요: " + report.summary.affected + "개",
    "- 심각: " + report.summary.critical + "건",
    "- 경고: " + report.summary.warning + "건",
    "",
  ];

  if (report.findings.length === 0) {
    lines.push("모든 지원금 상세 콘텐츠가 현재 품질 기준을 충족했습니다.");
    return lines.join("\n");
  }

  lines.push("| 수준 | 지원금 | 항목 | 현재/기준 |", "| --- | --- | --- | --- |");
  for (const finding of report.findings) {
    lines.push(
      "| " +
        finding.level +
        " | " +
        finding.title +
        " (" +
        finding.slug +
        ") | " +
        finding.message +
        " | " +
        finding.actual +
        "/" +
        finding.expected +
        " |",
    );
  }

  return lines.join("\n");
}
