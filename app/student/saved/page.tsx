// app/student/saved/page.tsx
import { redirect } from 'next/navigation'
import {
  getSavedJobs,
  getSavedCompanies,
  getSavedStats,
} from '@/lib/queries/saved'
import { SavedClientView } from '@/components/student/saved/saved-client-view'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

// ============================================
// Ambil user ID dari session (PER-USER)
// ============================================
async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession()

  if (!session?.user?.id) {
    console.warn('❌ [saved/page] Tidak ada session')
    return null
  }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: { id: true, email: true },
  })

  if (!user) {
    console.warn('❌ [saved/page] User tidak ditemukan')
    return null
  }

  console.log('✓ [saved/page] User:', user.email, '| ID:', user.id)
  return user.id
}

export default async function StudentSavedPage() {
  const userId = await getCurrentUserId()

  // Kalau belum login → redirect ke login
  if (!userId) {
    redirect('/login')
  }

  const [savedJobs, savedCompanies, stats] = await Promise.all([
    getSavedJobs(userId),
    getSavedCompanies(userId),
    getSavedStats(userId),
  ])

  console.log('🔵 [saved/page] result:', {
    userId,
    savedJobs: savedJobs.length,
    savedCompanies: savedCompanies.length,
  })

  return (
    <SavedClientView
      initialSavedJobs={savedJobs}
      initialSavedCompanies={savedCompanies}
      initialStats={stats}
      studentUserId={userId}
    />
  )
}