import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { filterGrantsByChecker } from "../lib/checker/filter-grants-core.mjs";

const grants = JSON.parse(fs.readFileSync(new URL("../data/grants.json", import.meta.url), "utf8")).grants;
const slugs = (answers) => new Set(filterGrantsByChecker(grants, answers).map((grant) => grant.slug));
const base = {
  ageGroup: null,
  situations: [],
  housing: null,
  income: null,
};

test("business voucher matches self-employed but not parenting", () => {
  assert.equal(slugs({ ...base, situations: ["self-employed"] }).has("small-business-stability-voucher"), true);
  assert.equal(slugs({ ...base, situations: ["parenting"] }).has("small-business-stability-voucher"), false);
});

test("medical support remains available regardless of housing answer", () => {
  const results = slugs({
    ...base,
    situations: ["medical"],
    housing: "jeonse",
    income: "under50",
  });

  assert.equal(results.has("catastrophic-medical-expense-support"), true);
});

test("senior care requires an overlapping age group", () => {
  assert.equal(
    slugs({ ...base, ageGroup: "65plus", situations: ["senior"] }).has("tailored-elderly-care-service"),
    true,
  );
  assert.equal(
    slugs({ ...base, ageGroup: "50to64", situations: ["senior"] }).has("tailored-elderly-care-service"),
    false,
  );
});

test("jeonse selection includes the Buteumok loan", () => {
  assert.equal(slugs({ ...base, housing: "jeonse" }).has("buteumok-jeonse-loan"), true);
});

test("closed grants are never presented as currently eligible", () => {
  const results = slugs(base);
  const closedSlugs = grants.filter((grant) => grant.status === "closed").map((grant) => grant.slug);

  for (const slug of closedSlugs) assert.equal(results.has(slug), false);
});

test("income bands exclude programs whose ceiling is below the selected band", () => {
  assert.equal(slugs({ ...base, income: "50to100" }).has("education-benefit"), false);
  assert.equal(slugs({ ...base, income: "under50" }).has("education-benefit"), true);
  assert.equal(slugs({ ...base, income: "100to150" }).has("catastrophic-medical-expense-support"), true);
});
