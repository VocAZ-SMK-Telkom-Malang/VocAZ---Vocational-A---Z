// lib/prisma.ts
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

function createPrisma() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  })

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  })
}

// ============================================
// DEVELOPMENT: SELALU bikin instance baru
// biar schema update langsung kepake
// ============================================
// PRODUCTION: pakai global singleton biar ga boros koneksi
// ============================================

export const prisma =
  process.env.NODE_ENV === 'production'
    ? globalForPrisma.prisma ?? createPrisma()
    : createPrisma()

if (process.env.NODE_ENV === 'production') {
  globalForPrisma.prisma = prisma
}