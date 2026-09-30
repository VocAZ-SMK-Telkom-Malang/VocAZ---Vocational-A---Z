// app/student/applications/page.tsx
import {
  getApplicationsByStudent,
  getApplicationStats,
} from '@/lib/queries/applications'
import { ApplicationsClientView } from '@/components/student/applications/applications-client-view'
import { prisma } from '@/lib/prisma'
import type { ComponentProps } from 'react'

export const dynamic = 'force-dynamic'

export default async function StudentApplicationsPage() {
  // ============================================
  // SEMENTARA — pakai user student pertama di DB
  // Nanti kalau auth udah setup, ganti pakai session
  // ============================================
  const firstUser = await prisma.user.findFirst({
    where: { role: 'student' },
    select: { id: true, email: true, fullName: true },
  })

  // Kalau belum ada user student di DB → tampilkan pesan
  if (!firstUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 text-2xl">
          ⚠️
        </div>
        <h2 className="text-lg font-black text-on-surface mb-2">
          Belum Ada Data Student
        </h2>
        <p className="text-sm text-on-surface-variant mb-5">
          Jalankan seed untuk membuat data dummy student & lamaran:
        </p>
        <code className="px-4 py-2.5 rounded-lg bg-surface-container font-mono text-xs text-on-surface border border-outline-variant/30">
          npx tsx prisma/seed-applications.ts
        </code>
      </div>
    )
  }

  // Fetch data
  const [applications, stats] = await Promise.all([
    getApplicationsByStudent(firstUser.id),
    getApplicationStats(firstUser.id),
  ])

  return (
    <ApplicationsClientView
      initialApplications={
        applications as unknown as ComponentProps<
          typeof ApplicationsClientView
        >['initialApplications']
      }
      initialStats={stats}
    />
  )
}