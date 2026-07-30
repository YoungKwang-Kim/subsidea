import type { Grant } from "@/types/grant";
import type { CheckerAnswers } from "./filter-grants";

export function filterGrantsByChecker(grants: Grant[], answers: CheckerAnswers): Grant[];
