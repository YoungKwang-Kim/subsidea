import type { Grant } from "@/types/grant";

export function relatedGrantsCore(grants: Grant[], grant: Grant, limit?: number): Grant[];
