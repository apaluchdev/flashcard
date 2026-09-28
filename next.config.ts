import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a self-contained server in .next/standalone for the Docker image.
  output: "standalone",
  experimental: {
    serverActions: {
      // JSON import sends up to a 1 MB deck file (LIMITS.importFileBytes)
      // plus request overhead; the default limit is 1 MB.
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
