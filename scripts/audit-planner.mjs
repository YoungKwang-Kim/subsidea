import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { scholarshipPrograms, scholarshipPlannerUpdatedAt } from "../lib/planner/scholarship-data.mjs";
import { housingPrograms, housingPlannerUpdatedAt } from "../lib/planner/housing-data.mjs";

const root = path.resolve(import.meta.dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "data", "grants.json"), "utf8"));
const grants = Array.isArray(data) ? data : data.grants;
const grantSlugs = new Set(grants.map((grant) => grant.slug));
const findings = [];
const ids = new Set();

if (scholarshipPrograms.length !== 7) findings.push(`MVP 장학금 수가 7개가 아닙니다: ${scholarshipPrograms.length}개`);

for (const program of scholarshipPrograms) {
  if (ids.has(program.id)) findings.push(`${program.id}: 중복된 장학금 ID입니다.`);
  ids.add(program.id);
  if (!grantSlugs.has(program.id)) findings.push(`${program.id}: 지원금 원본 데이터가 없습니다.`);
  if (!program.officialUrl?.startsWith("https://www.kosaf.go.kr/")) findings.push(`${program.id}: 한국장학재단 공식 근거 URL이 없습니다.`);
  if (!program.checkedAt) findings.push(`${program.id}: 공식 근거 확인일이 없습니다.`);
}

const ageDays = Math.floor((Date.now() - Date.parse(scholarshipPlannerUpdatedAt)) / 86_400_000);
if (!Number.isFinite(ageDays) || ageDays > 120) findings.push(`플래너 정책 확인일이 ${ageDays}일 경과했습니다. 공식 기준을 다시 검토하세요.`);

if (housingPrograms.length !== 5) findings.push(`MVP 주거지원 수가 5개가 아닙니다: ${housingPrograms.length}개`);
for (const program of housingPrograms) {
  if (ids.has(program.id)) findings.push(`${program.id}: 플래너 간 중복된 지원금 ID입니다.`);
  ids.add(program.id);
  if (!grantSlugs.has(program.id)) findings.push(`${program.id}: 지원금 원본 데이터가 없습니다.`);
  if (!/^https:\/\/(www\.molit\.go\.kr|www\.myhome\.go\.kr|nhuf\.molit\.go\.kr)\//.test(program.officialUrl)) findings.push(`${program.id}: 국토교통부·주택도시기금 공식 근거 URL이 없습니다.`);
  if (!program.checkedAt) findings.push(`${program.id}: 공식 근거 확인일이 없습니다.`);
}
const housingAgeDays = Math.floor((Date.now() - Date.parse(housingPlannerUpdatedAt)) / 86_400_000);
if (!Number.isFinite(housingAgeDays) || housingAgeDays > 120) findings.push(`주거 플래너 정책 확인일이 ${housingAgeDays}일 경과했습니다.`);

console.log(`장학금 플래너 정책: ${scholarshipPrograms.length}종`);
console.log(`공식 근거 확인일: ${scholarshipPlannerUpdatedAt}`);
console.log(`주거 플래너 정책: ${housingPrograms.length}종`);
console.log(`주거 공식 근거 확인일: ${housingPlannerUpdatedAt}`);

for (const finding of findings) console.error(`[planner] ${finding}`);
if (findings.length > 0) process.exitCode = 1;
