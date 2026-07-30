const curatedRelations = {
  "catastrophic-medical-expense-support": [
    "livelihood-benefit",
    "disability-pension",
    "disability-allowance",
  ],
  "tailored-elderly-care-service": [
    "basic-pension",
    "senior-job-support",
    "energy-voucher",
  ],
  "small-business-stability-voucher": [
    "small-business-policy-fund",
    "hope-return-package-closure",
    "earned-income-tax-credit",
  ],
  "buteumok-jeonse-loan": [
    "housing-benefit",
    "earned-income-tax-credit",
    "child-tax-credit",
  ],
  "housing-benefit": [
    "buteumok-jeonse-loan",
    "livelihood-benefit",
    "energy-voucher",
  ],
  "small-business-policy-fund": [
    "small-business-stability-voucher",
    "hope-return-package-closure",
  ],
  "hope-return-package-closure": [
    "small-business-stability-voucher",
    "small-business-policy-fund",
  ],
  "basic-pension": [
    "tailored-elderly-care-service",
    "senior-job-support",
  ],
};

const topicWeights = {
  housing: 10,
  health: 8,
  education: 7,
  employment: 6,
  finance: 4,
  living: 2,
};

const categoryWeights = {
  business: 7,
  senior: 7,
  youth: 5,
  family: 4,
  welfare: 1,
};

const statusRank = {
  closing: 0,
  open: 1,
  upcoming: 2,
  closed: 3,
};

function ageRangesOverlap(left, right) {
  const leftMin = left.target.age_min ?? 0;
  const leftMax = left.target.age_max ?? 200;
  const rightMin = right.target.age_min ?? 0;
  const rightMax = right.target.age_max ?? 200;

  return leftMax >= rightMin && rightMax >= leftMin;
}

function curatedScore(grant, candidate) {
  const relations = curatedRelations[grant.slug] ?? [];
  const index = relations.indexOf(candidate.slug);

  return index === -1 ? 0 : 100 - index * 20;
}

function similarityScore(grant, candidate) {
  const sharedTopics = candidate.topic.filter((topic) => grant.topic.includes(topic));
  const sharedCategories = candidate.category.filter((category) => grant.category.includes(category));
  const sharedTags = candidate.tags.filter((tag) => grant.tags.includes(tag));

  const topicScore = sharedTopics.reduce((sum, topic) => sum + topicWeights[topic], 0);
  const categoryScore = sharedCategories.reduce(
    (sum, category) => sum + categoryWeights[category],
    0,
  );
  const tagScore = sharedTags.length * 3;
  const ageScore = ageRangesOverlap(grant, candidate) ? 2 : -6;

  return topicScore + categoryScore + tagScore + ageScore;
}

export function relatedGrantsCore(grants, grant, limit = 3) {
  return grants
    .filter((candidate) => candidate.id !== grant.id && candidate.status !== "closed")
    .map((candidate) => ({
      candidate,
      curated: curatedScore(grant, candidate),
      similarity: similarityScore(grant, candidate),
    }))
    .map((entry) => ({
      ...entry,
      score: entry.curated + entry.similarity,
    }))
    .filter((entry) => entry.curated > 0 || entry.similarity >= 8)
    .sort((left, right) => {
      const scoreDifference = right.score - left.score;
      if (scoreDifference !== 0) return scoreDifference;

      const statusDifference =
        statusRank[left.candidate.status] - statusRank[right.candidate.status];
      if (statusDifference !== 0) return statusDifference;

      const updatedDifference = right.candidate.last_updated.localeCompare(
        left.candidate.last_updated,
      );
      if (updatedDifference !== 0) return updatedDifference;

      return left.candidate.name.localeCompare(right.candidate.name, "ko");
    })
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
