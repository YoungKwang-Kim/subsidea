import { isIndexableGrantSlug } from "../grants/index-policy-core.mjs";

export const monetizableGuideSlugs = [
  "youth-support-guide-2026",
  "housing-support-checklist",
  "small-business-support-comparison",
  "birth-childcare-benefits-roadmap-2026",
  "application-rejection-reasons",
  "documents-checklist-for-grants",
  "youth-asset-building-comparison-2026",
  "employment-training-support-comparison-2026",
  "earned-child-tax-credit-guide-2026",
  "basic-pension-senior-support-guide-2026",
  "low-income-living-support-guide-2026",
  "disability-income-support-guide-2026",
  "medical-cost-support-guide-2026",
  "senior-care-service-guide-2026",
  "pregnancy-medical-support-roadmap-2026",
  "dementia-support-roadmap-2026",
  "college-scholarship-comparison-2026",
];

const monetizableGuideSlugSet = new Set(monetizableGuideSlugs);

export function isMonetizablePath(pathname) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length !== 2) {
    return false;
  }

  if (segments[0] === "guides") {
    return monetizableGuideSlugSet.has(segments[1]);
  }

  return segments[0] === "grant" && isIndexableGrantSlug(segments[1]);
}
