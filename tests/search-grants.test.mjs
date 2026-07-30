import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { searchGrantsCore } from "../lib/search/search-grants-core.mjs";

const grants = JSON.parse(fs.readFileSync(new URL("../data/grants.json", import.meta.url), "utf8")).grants;
const taxonomy = {
  categories: {
    youth: "청년",
    family: "가족",
    business: "소상공인",
    welfare: "복지",
    senior: "노인",
  },
  topics: {
    housing: "주거",
    employment: "취업",
    education: "교육",
    health: "건강",
    living: "생활",
    finance: "금융",
  },
};
const resultSlugs = (query) => searchGrantsCore(grants, query, taxonomy).map((grant) => grant.slug);

test("multi-word business query finds the stability voucher first", () => {
  const results = resultSlugs("사업자 공과금");
  assert.equal(results[0], "small-business-stability-voucher");
});

test("everyday medical wording finds catastrophic medical support", () => {
  assert.equal(resultSlugs("병원비").includes("catastrophic-medical-expense-support"), true);
});

test("senior care synonyms find the tailored care service", () => {
  const results = resultSlugs("어르신 돌봄");
  assert.equal(results[0], "tailored-elderly-care-service");
});

test("spaced jeonse loan query finds the Buteumok loan", () => {
  assert.equal(resultSlugs("전세 대출").includes("buteumok-jeonse-loan"), true);
});

test("closure and demolition terms find the Hope Return package", () => {
  assert.equal(resultSlugs("폐업 철거")[0], "hope-return-package-closure");
});

test("exact grant title ranks ahead of partial matches", () => {
  assert.equal(resultSlugs("기초연금")[0], "basic-pension");
});

test("an unrelated query returns no grants", () => {
  assert.deepEqual(resultSlugs("반려동물 예방접종"), []);
});
