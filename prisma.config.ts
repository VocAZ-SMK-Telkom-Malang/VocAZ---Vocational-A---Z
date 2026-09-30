// prisma.config.ts
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',   // ← INI KUNCINYA
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})