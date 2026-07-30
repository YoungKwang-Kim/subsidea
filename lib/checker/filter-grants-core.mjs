const situationRules = {
  "job-seeking": {
    topics: ["employment"],
    keywords: ["구직", "취업", "일자리", "채용"],
  },
  employed: {
    keywords: ["재직", "근로", "직장", "육아휴직", "근무"],
  },
  "self-employed": {
    categories: ["business"],
    keywords: ["소상공인", "자영업", "사업자", "창업"],
  },
  parenting: {
    keywords: ["출산", "육아", "양육", "아동", "아이돌봄", "자녀"],
  },
  student: {
    topics: ["education"],
    keywords: ["학생", "장학", "학자금", "재학"],
  },
  senior: {
    categories: ["senior"],
    keywords: ["노인", "어르신", "기초연금", "노후", "돌봄"],
  },
  medical: {
    topics: ["health"],
    keywords: ["의료비", "병원비", "진료", "질환", "건강보험"],
  },
};

const ageRanges = {
  under19: { min: 0, max: 18 },
  "19to34": { min: 19, max: 34 },
  "35to49": { min: 35, max: 49 },
  "50to64": { min: 50, max: 64 },
  "65plus": { min: 65, max: 200 },
};

const incomeBandFloors = {
  under50: 0,
  "50to100": 50.01,
  "100to150": 100.01,
};

function ageMatches(grant, ageGroup) {
  if (!ageGroup) return true;

  const selected = ageRanges[ageGroup];
  const grantMin = grant.target.age_min ?? 0;
  const grantMax = grant.target.age_max ?? 200;

  return selected.max >= grantMin && selected.min <= grantMax;
}

function textPool(grant) {
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

function situationsMatch(grant, situations) {
  if (situations.length === 0) return true;

  const haystack = textPool(grant);

  return situations.some((situation) => {
    const rule = situationRules[situation];
    const categoryMatch = rule.categories?.some((category) => grant.category.includes(category));
    const topicMatch = rule.topics?.some((topic) => grant.topic.includes(topic));
    const keywordMatch = rule.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));

    return Boolean(categoryMatch || topicMatch || keywordMatch);
  });
}

function housingMatches(grant, housing) {
  if (!housing || !grant.topic.includes("housing")) return true;
  if (housing === "other") return true;

  const haystack = textPool(grant);
  const keywords = {
    jeonse: ["전세", "임대", "주거"],
    wolse: ["월세", "임대", "주거"],
    homeowner: ["자가", "주택", "주거"],
  };

  return keywords[housing].some((keyword) => haystack.includes(keyword));
}

function incomeMatches(grant, income) {
  if (!income || income === "any") return true;

  const percentages = [...grant.target.income.matchAll(/(\d{1,3}(?:\.\d+)?)\s*%/g)].map(
    (match) => Number(match[1]),
  );

  // 매출·건강보험료처럼 중위소득 비율로 표현되지 않는 기준은 상세 확인 대상으로 남깁니다.
  if (percentages.length === 0) return true;

  return Math.max(...percentages) >= incomeBandFloors[income];
}

export function filterGrantsByChecker(grants, answers) {
  return grants.filter((grant) => {
    return (
      grant.status !== "closed" &&
      ageMatches(grant, answers.ageGroup) &&
      situationsMatch(grant, answers.situations) &&
      housingMatches(grant, answers.housing) &&
      incomeMatches(grant, answers.income)
    );
  });
}
