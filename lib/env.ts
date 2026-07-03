type PublicEnv = {
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
};

export function getPublicEnv(): PublicEnv {
  return {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  };
}