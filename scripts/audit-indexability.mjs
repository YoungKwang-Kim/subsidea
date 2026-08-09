import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { monetizableGuideSlugs } from "../lib/ads/monetization-policy-core.mjs";
import { indexableGrantSlugs } from "../lib/grants/index-policy-core.mjs";

const root = path.resolve(import.meta.dirname, "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "data", "grants.json"), "utf8"));
const grants = Array.isArray(source) ? source : source.grants;
const decisionGuideSource = fs.readFileSync(
  path.join(root, "lib", "grants", "core-decision-guides.ts"),
  "utf8",
);
const decisionGuideSlugs = new Set(
  [...decisionGuideSource.matchAll(/^\s{2}"([a-z0-9-]+)": \{/gm)].map((match) => match[1]),
);
const grantSlugs = new Set(grants.map((grant) => grant.slug));
const approvedSlugs = new Set(indexableGrantSlugs);
const guideSource = fs.readFileSync(path.join(root, "lib", "guides.ts"), "utf8");
const guideSlugs = new Set(
  [...guideSource.matchAll(/^\s{4}slug: "([a-z0-9-]+)",/gm)].map((match) => match[1]),
);
const approvedGuideSlugs = new Set(monetizableGuideSlugs);
const findings = [];

for (const slug of guideSlugs) {
  if (!approvedGuideSlugs.has(slug)) {
    findings.push(`${slug}: published guide is missing from the monetization allowlist.`);
  }
}

for (const slug of approvedGuideSlugs) {
  if (!guideSlugs.has(slug)) {
    findings.push(`${slug}: monetization allowlist points to a missing guide.`);
  }
}

for (const slug of approvedSlugs) {
  if (!grantSlugs.has(slug)) {
    findings.push(`${slug}: 색인 승인 목록에 있지만 지원금 데이터가 없습니다.`);
  }
  if (!decisionGuideSlugs.has(slug)) {
    findings.push(`${slug}: 색인 승인 목록에 있지만 독립 판단 가이드가 없습니다.`);
  }
}

for (const slug of decisionGuideSlugs) {
  if (!approvedSlugs.has(slug)) {
    findings.push(`${slug}: 독립 판단 가이드가 있지만 색인 승인 목록에 없습니다.`);
  }
}

const heldGrantCount = grants.length - approvedSlugs.size;
console.log(`색인 승인 지원금: ${approvedSlugs.size}개`);
console.log(`편집 검토 대기 지원금: ${heldGrantCount}개`);

for (const finding of findings) {
  console.error(`[indexability] ${finding}`);
}

if (findings.length > 0 || approvedSlugs.size === 0 || heldGrantCount < 0) {
  process.exitCode = 1;
}
