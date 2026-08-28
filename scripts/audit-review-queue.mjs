import fs from "node:fs";
import path from "node:path";
import {
  createFreshnessReviewQueue,
  renderReviewQueueMarkdown,
} from "./content-audit/review-queue.mjs";

const args = process.argv.slice(2);
const getOption = (name) => {
  const index = args.indexOf(name);
  if (index >= 0) return args[index + 1];
  const inline = args.find((argument) => argument.startsWith(`${name}=`));
  return inline?.slice(name.length + 1);
};

const leadDaysOption = getOption("--lead-days");
const leadDays = leadDaysOption === undefined ? 7 : Number(leadDaysOption);
const grantsData = JSON.parse(fs.readFileSync("data/grants.json", "utf8"));
const queue = createFreshnessReviewQueue(grantsData.grants, {
  asOf: getOption("--as-of"),
  leadDays,
});
const format = getOption("--format") ?? "markdown";
const output = getOption("--output");
const rendered =
  format === "json"
    ? `${JSON.stringify(queue, null, 2)}\n`
    : renderReviewQueueMarkdown(queue);

if (output) {
  const target = path.resolve(output);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, rendered, "utf8");
  console.log(`Freshness review queue written to ${target}`);
} else {
  process.stdout.write(rendered);
}
