import type { Grant } from "@/types/grant";
import { categoryMap, topicMap } from "@/lib/grants/taxonomy";
import { searchGrantsCore } from "./search-grants-core.mjs";

const taxonomy = {
  categories: Object.fromEntries(
    Object.entries(categoryMap).map(([key, value]) => [key, value.label]),
  ),
  topics: Object.fromEntries(
    Object.entries(topicMap).map(([key, value]) => [key, value.label]),
  ),
};

export function searchGrants(grants: Grant[], rawQuery: string): Grant[] {
  return searchGrantsCore(grants, rawQuery, taxonomy);
}
