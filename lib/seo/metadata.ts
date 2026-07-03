import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants/site";
import { getPublicEnv } from "@/lib/env";

type CreateMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
};

function getSiteUrl() {
  const env = getPublicEnv();
  return env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl;
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
}: CreateMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}