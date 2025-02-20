import { readFileSync } from "fs";
import type { NextConfig } from "next";
const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version, // Inject version
  },
};

export default nextConfig;
