import grantsData from "@/data/grants.json";
import { relatedGrantsCore } from "./related-grants-core.mjs";
import type {
  Grant,
  GrantCategory,
  GrantsData,
  GrantTopic,
} from "@/types/grant";

function getData(): GrantsData {
  return grantsData as GrantsData;
}

function sortByUpdatedDesc(grants: Grant[]): Grant[] {
  return [...grants].sort(
    (left, right) =>
      new Date(right.last_updated).getTime() -
      new Date(left.last_updated).getTime(),
  );
}

const statusRank = {
  closing: 0,
  open: 1,
  upcoming: 2,
  closed: 3,
} as const;

function sortForListings(grants: Grant[]): Grant[] {
  return [...grants].sort((left, right) => {
    const statusDiff = statusRank[left.status] - statusRank[right.status];

    if (statusDiff !== 0) {
      return statusDiff;
    }

    return (
      new Date(right.last_updated).getTime() -
      new Date(left.last_updated).getTime()
    );
  });
}

export async function getGrants(): Promise<Grant[]> {
  return sortForListings(getData().grants);
}

export async function getGrantBySlug(slug: string): Promise<Grant | null> {
  const grants = await getGrants();

  return grants.find((grant) => grant.slug === slug) ?? null;
}

export async function getGrantSlugs(): Promise<string[]> {
  const grants = await getGrants();

  return grants.map((grant) => grant.slug);
}

export async function getGrantsByCategory(
  category: GrantCategory,
): Promise<Grant[]> {
  const grants = await getGrants();

  return grants.filter((grant) => grant.category.includes(category));
}

export async function getGrantsByTopic(topic: GrantTopic): Promise<Grant[]> {
  const grants = await getGrants();

  return grants.filter((grant) => grant.topic.includes(topic));
}

export async function getFeaturedGrants(limit = 3): Promise<Grant[]> {
  const grants = await getGrants();

  return grants.slice(0, limit);
}

export async function getClosingGrants(limit = 3): Promise<Grant[]> {
  const grants = await getGrants();

  return grants.filter((grant) => grant.status === "closing").slice(0, limit);
}

export async function getLatestGrants(limit = 4): Promise<Grant[]> {
  const grants = await getGrants();

  return sortByUpdatedDesc(grants).slice(0, limit);
}

export async function getRelatedGrants(
  grant: Grant,
  limit = 3,
): Promise<Grant[]> {
  const grants = await getGrants();

  return relatedGrantsCore(grants, grant, limit);
}
