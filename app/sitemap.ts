import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants/site";
import { getGrantSlugs } from "@/lib/grants/get-grants";
import { categoryMap, topicMap } from "@/lib/grants/taxonomy";
import type { GrantCategory, GrantTopic } from "@/types/grant";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const grantSlugs = await getGrantSlugs();

  const staticRoutes = [
    "",
    "/search",
    "/checker",
    "/updates",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
  ].map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: now,
  }));

  const categoryRoutes = (Object.keys(categoryMap) as GrantCategory[]).map((slug) => ({
    url: `${siteConfig.siteUrl}/category/${slug}`,
    lastModified: now,
  }));

  const topicRoutes = (Object.keys(topicMap) as GrantTopic[]).map((slug) => ({
    url: `${siteConfig.siteUrl}/topic/${slug}`,
    lastModified: now,
  }));

  const grantRoutes = grantSlugs.map((slug) => ({
    url: `${siteConfig.siteUrl}/grant/${slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...categoryRoutes, ...topicRoutes, ...grantRoutes];
}