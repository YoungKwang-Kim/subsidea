import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { auditQuality, renderQualityMarkdown } from "./content-audit/quality.mjs";

const root = path.resolve(import.meta.dirname, "..");
const source = JSON.parse(
  fs.readFileSync(path.join(root, "data", "grants.json"), "utf8"),
);
const grants = Array.isArray(source) ? source : source.grants;
const report = auditQuality(grants);
const markdown = process.argv.includes("--format") &&
  process.argv[process.argv.indexOf("--format") + 1] === "markdown";

if (markdown) {
  console.log(renderQualityMarkdown(report));
} else {
  console.log(
    "Content quality: " +
      report.summary.passed +
      "/" +
      report.summary.total +
      " grants passed",
  );
  for (const finding of report.findings) {
    console.error(
      "[" +
        finding.level +
        "] " +
        finding.slug +
        " " +
        finding.code +
        ": " +
        finding.actual +
        "/" +
        finding.expected,
    );
  }
}

if (process.argv.includes("--strict") && report.findings.length > 0) {
  process.exitCode = 1;
}
