export type UpdateType = "new" | "changed" | "closing";

export type GrantUpdate = {
  id: string;
  grant_slug: string;
  type: UpdateType;
  title: string;
  summary: string;
  published_at: string;
};

export type GrantUpdatesData = {
  updated_at: string;
  updates: GrantUpdate[];
};
