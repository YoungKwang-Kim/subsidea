import type { Grant } from "@/types/grant";

export type CheckerAgeGroup = "under19" | "19to34" | "35to49" | "50plus";
export type CheckerSituation = "job-seeking" | "employed" | "self-employed" | "parenting" | "student";
export type CheckerHousing = "jeonse" | "wolse" | "homeowner" | "other";
export type CheckerIncome = "under50" | "under100" | "under150" | "any";

export type CheckerAnswers = {
  ageGroup: CheckerAgeGroup | null;
  situations: CheckerSituation[];
  housing: CheckerHousing | null;
  income: CheckerIncome | null;
};

const situationKeywords: Record<CheckerSituation, string[]> = {
  "job-seeking": ["구직", "취업", "일자리", "청년", "채용"],
  employed: ["재직", "근로", "직장", "육아휴직", "근무"],
  "self-employed": ["소상공인", "자영업", "사업", "정책자금", "창업"],
  parenting: ["출산", "육아", "가정", "아이", "바우처"],
  student: ["학생", "장학", "학자금", "교육"],
};

const housingKeywords: Record<CheckerHousing, string[]> = {
  jeonse: ["전세", "주거", "임대"],
  wolse: ["월세", "주거", "임대"],
  homeowner: ["자가", "주거", "주택"],
  other: ["생활", "복지", "지원"],
};

function ageMatches(grant: Grant, ageGroup: CheckerAgeGroup | null): boolean {
  if (!ageGroup) {
    return true;
  }

  const ageRanges = {
    under19: { min: 0, max: 18 },
    "19to34": { min: 19, max: 34 },
    "35to49": { min: 35, max: 49 },
    "50plus": { min: 50, max: 200 },
  } as const;

  const selected = ageRanges[ageGroup];
  const grantMin = grant.target.age_min ?? 0;
  const grantMax = grant.target.age_max ?? 200;

  return selected.max >= grantMin && selected.min <= grantMax;
}

function textPool(grant: Grant): string {
  return [
    grant.name,
    grant.summary,
    grant.overview,
    grant.target.income,
    ...grant.tags,
    ...grant.target.conditions,
    ...grant.topic,
    ...grant.category,
  ]
    .join(" ")
    .toLowerCase();
}

function situationsMatch(grant: Grant, situations: CheckerSituation[]): boolean {
  if (situations.length === 0) {
    return true;
  }

  const haystack = textPool(grant);

  return situations.some((situation) => situationKeywords[situation].some((keyword) => haystack.includes(keyword.toLowerCase())));
}

function housingMatches(grant: Grant, housing: CheckerHousing | null): boolean {
  if (!housing) {
    return true;
  }

  const haystack = textPool(grant);
  return housingKeywords[housing].some((keyword) => haystack.includes(keyword.toLowerCase()));
}

function incomeMatches(grant: Grant, income: CheckerIncome | null): boolean {
  if (!income || income === "any") {
    return true;
  }

  const source = grant.target.income;

  if (income === "under50") {
    return source.includes("50") || source.includes("차상위") || source.includes("수급");
  }

  if (income === "under100") {
    return source.includes("50") || source.includes("100") || source.includes("차상위") || source.includes("수급");
  }

  return source.includes("50") || source.includes("100") || source.includes("150") || source.includes("180") || source.includes("무관") || source.includes("완화");
}

export function filterGrantsByChecker(grants: Grant[], answers: CheckerAnswers): Grant[] {
  return grants.filter((grant) => {
    return (
      ageMatches(grant, answers.ageGroup) &&
      situationsMatch(grant, answers.situations) &&
      housingMatches(grant, answers.housing) &&
      incomeMatches(grant, answers.income)
    );
  });
}
