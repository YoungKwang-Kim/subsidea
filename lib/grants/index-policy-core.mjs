export const indexableGrantSlugs = [
  "national-work-scholarship",
  "youth-future-savings",
  "national-employment-support-program",
  "youth-monthly-rent-support",
  "newborn-special-jeonse-loan",
  "housing-stability-scholarship",
  "humanities-100-years-scholarship",
  "national-scholarship-type-2",
  "multi-child-national-scholarship",
  "national-science-engineering-excellence-scholarship",
];

const indexableGrantSlugSet = new Set(indexableGrantSlugs);

export function isIndexableGrantSlug(slug) {
  return indexableGrantSlugSet.has(slug);
}
