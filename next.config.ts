import type { NextConfig } from "next";
import webpack from 'webpack';

const nextConfig: NextConfig = {
  /* config options here */
  // serverExternalPackages: ['ssh2'],
  experimental: {
    serverActions: {
      bodySizeLimit: "10gb",
    },
  }
};

export default nextConfig;
