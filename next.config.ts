import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a self-contained server in .next/standalone for the Docker image.
  output: "standalone",
  // Static security headers for every response. The Content-Security-Policy
  // needs a per-request nonce, so it is set in src/proxy.ts instead.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      // JSON import sends up to a 1 MB deck file (LIMITS.importFileBytes)
      // plus request overhead; the default limit is 1 MB.
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
