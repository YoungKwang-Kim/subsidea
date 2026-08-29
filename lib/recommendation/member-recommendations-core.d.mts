import type { CheckerAnswers } from "../checker/filter-grants";
import type { Grant } from "../../types/grant";

export type MemberRecommendationCore = {
  grant: Grant;
  reasons: string[];
  cautions: string[];
};

export function createMemberRecommendations(
  grants: Grant[],
  answers: CheckerAnswers & { residenceSido?: string | null },
  limit?: number,
): MemberRecommendationCore[];
