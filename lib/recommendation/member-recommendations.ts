import type { CheckerAnswers } from "@/lib/checker/filter-grants";
import type { Grant } from "@/types/grant";
import {
  createMemberRecommendations,
  type MemberRecommendationCore,
} from "./member-recommendations-core.mjs";

export type MemberRecommendation = MemberRecommendationCore;

export function getMemberRecommendations(
  grants: Grant[],
  answers: CheckerAnswers & { residenceSido?: string | null },
  limit = 12,
): MemberRecommendation[] {
  return createMemberRecommendations(grants, answers, limit);
}
