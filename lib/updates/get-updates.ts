import updatesData from "@/data/updates.json";
import type { GrantUpdatesData, GrantUpdate } from "@/types/update";

export async function getUpdates(): Promise<GrantUpdate[]> {
  const data = updatesData as GrantUpdatesData;

  return [...data.updates].sort(
    (left, right) =>
      new Date(right.published_at).getTime() - new Date(left.published_at).getTime(),
  );
}
