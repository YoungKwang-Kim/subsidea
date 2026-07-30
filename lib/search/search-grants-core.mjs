const synonymGroups = [
  ["병원비", "의료비", "진료비"],
  ["어르신", "노인", "고령자"],
  ["자영업", "소상공인", "사업자"],
  ["전세대출", "전세자금", "버팀목", "보증금"],
  ["월세", "임차료"],
  ["육아", "양육", "아이돌봄", "아동"],
  ["학비", "교육비", "장학금", "학자금"],
  ["폐업", "사업정리", "희망리턴"],
  ["취업", "구직", "일자리", "채용"],
  ["생활비", "생계비", "생계급여"],
];

const statusRank = {
  open: 0,
  closing: 1,
  upcoming: 2,
  closed: 3,
};

export function normalizeSearchText(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}%]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function variantsFor(token) {
  const group = synonymGroups.find((items) => items.includes(token));
  return group ?? [token];
}

function searchableFields(grant, taxonomy) {
  const categoryLabels = grant.category.map((item) => taxonomy.categories[item] ?? item);
  const topicLabels = grant.topic.map((item) => taxonomy.topics[item] ?? item);

  return [
    { weight: 14, text: grant.name },
    { weight: 8, text: grant.tags.join(" ") },
    { weight: 6, text: grant.summary },
    { weight: 4, text: grant.overview },
    { weight: 3, text: grant.benefit.amount },
    { weight: 3, text: grant.target.income },
    { weight: 2, text: grant.target.conditions.join(" ") },
    { weight: 2, text: grant.benefit_details.join(" ") },
    { weight: 2, text: categoryLabels.join(" ") },
    { weight: 2, text: topicLabels.join(" ") },
  ].map((field) => ({ ...field, text: normalizeSearchText(field.text) }));
}

function scoreToken(fields, token) {
  const variants = variantsFor(token);
  let best = 0;

  for (const field of fields) {
    if (variants.some((variant) => field.text.includes(variant))) {
      best = Math.max(best, field.weight);
    }
  }

  return best;
}

export function searchGrantsCore(grants, rawQuery, taxonomy) {
  const query = normalizeSearchText(rawQuery);
  if (!query) return [];

  const tokens = [...new Set(query.split(" ").filter(Boolean))];

  return grants
    .map((grant) => {
      const fields = searchableFields(grant, taxonomy);
      const tokenScores = tokens.map((token) => scoreToken(fields, token));

      if (tokenScores.some((score) => score === 0)) return null;

      const exactName = normalizeSearchText(grant.name).includes(query) ? 20 : 0;
      const exactSummary = normalizeSearchText(grant.summary).includes(query) ? 8 : 0;

      return {
        grant,
        score: tokenScores.reduce((sum, score) => sum + score, 0) + exactName + exactSummary,
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const scoreDifference = right.score - left.score;
      if (scoreDifference !== 0) return scoreDifference;

      const statusDifference = statusRank[left.grant.status] - statusRank[right.grant.status];
      if (statusDifference !== 0) return statusDifference;

      const updatedDifference = right.grant.last_updated.localeCompare(left.grant.last_updated);
      if (updatedDifference !== 0) return updatedDifference;

      return left.grant.name.localeCompare(right.grant.name, "ko");
    })
    .map((entry) => entry.grant);
}
