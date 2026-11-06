import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use local directory for tracing locally, but allow Vercel's build environment to manage it automatically
  outputFileTracingRoot: process.env.VERCEL ? undefined : __dirname,
  reactStrictMode: true,
  eslint: {
    // Prevent unhandled lint warnings from blocking production deployments on Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ensure strict TypeScript compilation remains active
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
