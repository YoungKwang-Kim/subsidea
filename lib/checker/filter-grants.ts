import type { Grant } from "@/types/grant";
import { filterGrantsByChecker as filterGrantsByCheckerCore } from "./filter-grants-core.mjs";

export type CheckerAgeGroup = "under19" | "19to34" | "35to49" | "50to64" | "65plus";
export type CheckerSituation =
  | "job-seeking"
  | "employed"
  | "self-employed"
  | "parenting"
  | "student"
  | "senior"
  | "medical";
export type CheckerHousing = "jeonse" | "wolse" | "homeowner" | "other";
export type CheckerIncome = "under50" | "50to100" | "100to150" | "any";

export type CheckerAnswers = {
  ageGroup: CheckerAgeGroup | null;
  situations: CheckerSituation[];
  housing: CheckerHousing | null;
  income: CheckerIncome | null;
};

export function filterGrantsByChecker(grants: Grant[], answers: CheckerAnswers): Grant[] {
  return filterGrantsByCheckerCore(grants, answers);
}
