import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants/site";
import { getGuides } from "@/lib/guides";
import { getGrants } from "@/lib/grants/get-grants";
import { categoryMap, topicMap } from "@/lib/grants/taxonomy";
import type { GrantCategory, GrantTopic } from "@/types/grant";

const staticRoutes = [
  { path: "", lastModified: "2026-07-30" },
  { path: "/checker", lastModified: "2026-07-30" },
  { path: "/updates", lastModified: "2026-07-30" },
  { path: "/guides", lastModified: "2026-07-30" },
  { path: "/about", lastModified: "2026-07-27" },
  { path: "/editorial-policy", lastModified: "2026-07-27" },
  { path: "/privacy", lastModified: "2026-07-18" },
  { path: "/terms", lastModified: "2026-07-18" },
  { path: "/contact", lastModified: "2026-07-18" },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [grants, guides] = await Promise.all([
    getGrants(),
    Promise.resolve(getGuides()),
  ]);

  const staticEntries = staticRoutes.map(({ path, lastModified }) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified,
  }));

  const categoryRoutes = (Object.keys(categoryMap) as GrantCategory[]).map((slug) => ({
    url: `${siteConfig.siteUrl}/category/${slug}`,
    lastModified:
      grants
        .filter((grant) => grant.category.includes(slug))
        .map((grant) => grant.last_updated)
        .sort()
        .at(-1) ?? "2026-07-27",
  }));

  const topicRoutes = (Object.keys(topicMap) as GrantTopic[]).map((slug) => ({
    url: `${siteConfig.siteUrl}/topic/${slug}`,
    lastModified:
      grants
        .filter((grant) => grant.topic.includes(slug))
        .map((grant) => grant.last_updated)
        .sort()
        .at(-1) ?? "2026-07-27",
  }));

  const grantRoutes = grants.map((grant) => ({
    url: `${siteConfig.siteUrl}/grant/${grant.slug}`,
    lastModified: grant.last_updated,
  }));

  const guideRoutes = guides.map((guide) => ({
    url: `${siteConfig.siteUrl}/guides/${guide.slug}`,
    lastModified: guide.updatedAt,
  }));

  return [...staticEntries, ...categoryRoutes, ...topicRoutes, ...grantRoutes, ...guideRoutes];
}
