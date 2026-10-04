// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ============================================
  // IMAGE OPTIMIZATION — REMOTE PATTERNS
  // ============================================
  images: {
    remotePatterns: [
      // Neon Object Storage (avatar, logo, dokumen)
      {
        protocol: 'https',
        hostname: '**.neon.tech',
      },

      // Cloudflare R2
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },

      // AWS S3 & CloudFront
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },

      // CDN umum (kalau perlu)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // ============================================
  // EXCLUDE SERVER-ONLY PACKAGES
  // ============================================
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-neon',
    '@neondatabase/serverless',
    '@aws-sdk/client-s3',
    '@aws-sdk/s3-request-presigner',
    'ws',
  ],

  // ============================================
  // WEBPACK
  // ============================================
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