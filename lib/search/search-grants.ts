import type { Grant } from "@/types/grant";
import { categoryMap, topicMap } from "@/lib/grants/taxonomy";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function getSearchText(grant: Grant): string[] {
  const categoryLabels = grant.category.map((item) => categoryMap[item].label);
  const topicLabels = grant.topic.map((item) => topicMap[item].label);

  return [
    grant.name,
    grant.summary,
    grant.overview,
    grant.target.income,
    grant.benefit.amount,
    ...grant.tags,
    ...grant.target.conditions,
    ...categoryLabels,
    ...topicLabels,
  ];
}

export function searchGrants(grants: Grant[], rawQuery: string): Grant[] {
  const query = normalize(rawQuery);

  if (!query) {
    return [];
  }

  return grants
    .map((grant) => {
      const haystack = getSearchText(grant).map(normalize);
      let score = 0;

      if (normalize(grant.name).includes(query)) {
        score += 10;
      }

      if (normalize(grant.summary).includes(query)) {
        score += 5;
      }

      for (const text of haystack) {
        if (text.includes(query)) {
          score += 2;
        }
      }

      return { grant, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.grant);
}
