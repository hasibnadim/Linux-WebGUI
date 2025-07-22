import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // serverExternalPackages: ['ssh2'],
  experimental: {
    serverActions: {
      bodySizeLimit: "10gb",
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "cpu-features": false,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        crypto: false,
        ssh2: false,
      };
    }
    return config;
  },
};

export default nextConfig;
