import fs from "node:fs";

const grantsData = JSON.parse(fs.readFileSync("data/grants.json", "utf8"));
const updatesData = JSON.parse(fs.readFileSync("data/updates.json", "utf8"));
const categories = new Set(["youth", "family", "business", "welfare", "senior"]);
const topics = new Set(["housing", "employment", "education", "health", "living", "finance"]);
const statuses = new Set(["open", "closing", "upcoming", "closed"]);
const updateTypes = new Set(["new", "changed", "closing", "closed"]);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function validateTextArray(value, field, slug) {
  assert(Array.isArray(value) && value.length > 0, `${slug}: ${field} must not be empty`);
  assert(value.every(hasText), `${slug}: ${field} contains an empty value`);
}

assert(Array.isArray(grantsData.grants), "grants must be an array");
assert(Array.isArray(updatesData.updates), "updates must be an array");

const grantIds = new Set();
const grantSlugs = new Set();

for (const grant of grantsData.grants) {
  assert(hasText(grant.id), "grant id is required");
  assert(hasText(grant.slug), `${grant.id}: slug is required`);
  assert(!grantIds.has(grant.id), `duplicate grant id: ${grant.id}`);
  assert(!grantSlugs.has(grant.slug), `duplicate grant slug: ${grant.slug}`);
  grantIds.add(grant.id);
  grantSlugs.add(grant.slug);

  assert(hasText(grant.name) && hasText(grant.summary) && hasText(grant.overview), `${grant.slug}: core copy is required`);
  assert(Array.isArray(grant.category) && grant.category.length > 0 && grant.category.every((item) => categories.has(item)), `${grant.slug}: invalid category`);
  assert(Array.isArray(grant.topic) && grant.topic.length > 0 && grant.topic.every((item) => topics.has(item)), `${grant.slug}: invalid topic`);
  assert(statuses.has(grant.status), `${grant.slug}: invalid status`);
  assert(datePattern.test(grant.last_updated), `${grant.slug}: invalid last_updated`);
  assert(isUrl(grant.apply_url) && isUrl(grant.source_url), `${grant.slug}: invalid official URL`);
  validateTextArray(grant.target?.conditions, "target.conditions", grant.slug);
  validateTextArray(grant.benefit_details, "benefit_details", grant.slug);
  validateTextArray(grant.application_steps, "application_steps", grant.slug);
  validateTextArray(grant.required_documents, "required_documents", grant.slug);
  validateTextArray(grant.tags, "tags", grant.slug);
  assert(Array.isArray(grant.faq) && grant.faq.length > 0 && grant.faq.every((item) => hasText(item.question) && hasText(item.answer)), `${grant.slug}: invalid faq`);
  assert(grant.editorial && hasText(grant.editorial.reviewer), `${grant.slug}: editorial review is required`);
  assert(datePattern.test(grant.editorial.verified_at), `${grant.slug}: invalid editorial date`);
  validateTextArray(grant.editorial.exclusions, "editorial.exclusions", grant.slug);
  validateTextArray(grant.editorial.calculation_examples, "editorial.calculation_examples", grant.slug);
  validateTextArray(grant.editorial.timeline, "editorial.timeline", grant.slug);
  assert(Array.isArray(grant.editorial.scenarios) && grant.editorial.scenarios.length >= 3, `${grant.slug}: at least three scenarios are required`);
  assert(Array.isArray(grant.editorial.evidence) && grant.editorial.evidence.length > 0, `${grant.slug}: evidence is required`);
  for (const evidence of grant.editorial.evidence) {
    assert(hasText(evidence.title) && isUrl(evidence.url), `${grant.slug}: invalid evidence`);
    assert(datePattern.test(evidence.checked_at), `${grant.slug}: invalid evidence date`);
    validateTextArray(evidence.supports, "evidence.supports", grant.slug);
  }
}

const updateIds = new Set();
for (const update of updatesData.updates) {
  assert(hasText(update.id) && !updateIds.has(update.id), `duplicate or missing update id: ${update.id}`);
  updateIds.add(update.id);
  assert(grantSlugs.has(update.grant_slug), `${update.id}: unknown grant slug`);
  assert(updateTypes.has(update.type), `${update.id}: invalid update type`);
  assert(hasText(update.title) && hasText(update.summary), `${update.id}: update copy is required`);
  assert(datePattern.test(update.published_at), `${update.id}: invalid published_at`);
}

console.log(`Validated ${grantsData.grants.length} grants and ${updatesData.updates.length} updates.`);
