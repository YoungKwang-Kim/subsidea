import { siteConfig } from "@/lib/constants/site";

type PublicEnv = {
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
};

export function getPublicEnv(): PublicEnv {
  return {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.siteUrl,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  };
}