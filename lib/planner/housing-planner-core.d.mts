export type HousingProfile = Record<"goal" | "age" | "householdSize" | "housingIncome" | "annualIncome" | "incomeType" | "maritalStatus" | "newborn" | "homeless" | "depositPaid" | "existingHousingLoan", string>;
export type HousingResult = { id: string; name: string; href: string; officialUrl: string; checkedAt: string; kind: string; level: "priority" | "consider" | "check" | "unlikely"; reasons: string[]; missing: string[]; cautions: string[] };
export const initialHousingProfile: HousingProfile;
export function createHousingPlan(profile?: HousingProfile): { results: HousingResult[]; summary: Record<string, number>; compatibility: Array<{ title: string; description: string }>; documents: string[]; timeline: Array<{ title: string; description: string }> };
