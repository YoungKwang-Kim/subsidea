export type ScholarshipProfile = {
  goals: string[]; nationality: string; academicStatus: string; year: string; major: string;
  grade: string; credits: string; supportBand: string; siblingCount: string; birthOrder: string;
  maritalStatus: string; age: string; remoteStudy: string; canWork: string; existingPrograms: string[];
};
export type ScholarshipResult = {
  id: string; name: string; href: string; officialUrl: string; checkedAt: string;
  level: "priority" | "consider" | "check" | "unlikely"; score: number;
  reasons: string[]; missing: string[]; cautions: string[];
};
export const initialScholarshipProfile: ScholarshipProfile;
export function createScholarshipPlan(profile: Partial<ScholarshipProfile>): {
  profile: ScholarshipProfile; results: ScholarshipResult[];
  compatibility: Array<{ title: string; status: string; description: string; programIds: string[] }>;
  timeline: Array<{ title: string; description: string }>; documents: string[];
  summary: Record<string, number>;
};
export function getPlannerProgramCount(): number;
