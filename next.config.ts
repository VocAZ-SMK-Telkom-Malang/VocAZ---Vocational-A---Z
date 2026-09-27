// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Exclude package server-only yang tidak perlu di-bundle ke client
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-neon',
    '@neondatabase/serverless',
    '@aws-sdk/client-s3',
    '@aws-sdk/s3-request-presigner',
    'ws',
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Di client bundle, jangan resolve node: modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        async_hooks: false,
        stream: false,
      }
    }

    return config
  },
}

export default nextConfig