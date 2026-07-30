import assert from "node:assert/strict";
import test from "node:test";
import { sortGuidesByFreshness } from "../lib/guides/sort-guides-core.mjs";

const guide = (slug, updatedAt, publishedAt = updatedAt, title = slug) => ({
  slug,
  title,
  updatedAt,
  publishedAt,
});

test("guides are ordered by most recent update", () => {
  const results = sortGuidesByFreshness([
    guide("old", "2026-07-18"),
    guide("new", "2026-07-30"),
    guide("middle", "2026-07-27"),
  ]);

  assert.deepEqual(results.map((item) => item.slug), ["new", "middle", "old"]);
});

test("published date breaks an equal update-date tie", () => {
  const results = sortGuidesByFreshness([
    guide("earlier", "2026-07-30", "2026-07-18"),
    guide("later", "2026-07-30", "2026-07-30"),
  ]);

  assert.deepEqual(results.map((item) => item.slug), ["later", "earlier"]);
});

test("sorting does not mutate the source array", () => {
  const source = [guide("old", "2026-07-18"), guide("new", "2026-07-30")];
  const before = source.map((item) => item.slug);

  sortGuidesByFreshness(source);

  assert.deepEqual(source.map((item) => item.slug), before);
});
