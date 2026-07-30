import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { relatedGrantsCore } from "../lib/grants/related-grants-core.mjs";

const grants = JSON.parse(fs.readFileSync(new URL("../data/grants.json", import.meta.url), "utf8")).grants;
const bySlug = (slug) => grants.find((grant) => grant.slug === slug);
const recommendations = (slug, limit = 3) =>
  relatedGrantsCore(grants, bySlug(slug), limit).map((grant) => grant.slug);

test("housing loan recommends housing benefit first", () => {
  assert.equal(recommendations("buteumok-jeonse-loan")[0], "housing-benefit");
});

test("business voucher prioritizes operating and closure support", () => {
  assert.deepEqual(recommendations("small-business-stability-voucher").slice(0, 2), [
    "small-business-policy-fund",
    "hope-return-package-closure",
  ]);
});

test("senior care prioritizes pension and senior activity support", () => {
  assert.deepEqual(recommendations("tailored-elderly-care-service").slice(0, 2), [
    "basic-pension",
    "senior-job-support",
  ]);
});

test("medical expense support connects to household income protection", () => {
  assert.equal(recommendations("catastrophic-medical-expense-support")[0], "livelihood-benefit");
});

test("closed grants and the current grant are never recommended", () => {
  for (const source of grants) {
    const results = relatedGrantsCore(grants, source, 10);
    assert.equal(results.some((candidate) => candidate.id === source.id), false);
    assert.equal(results.some((candidate) => candidate.status === "closed"), false);
  }
});

test("limit is respected", () => {
  assert.equal(recommendations("housing-benefit", 2).length, 2);
});
