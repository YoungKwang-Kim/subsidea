import type { Grant } from "@/types/grant";

export type SearchTaxonomy = {
  categories: Record<string, string>;
  topics: Record<string, string>;
};

export function normalizeSearchText(value: string): string;
export function searchGrantsCore(grants: Grant[], rawQuery: string, taxonomy: SearchTaxonomy): Grant[];
