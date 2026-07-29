import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/grant/youth-employment-success-package",
        destination: "/grant/national-employment-support-program",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
