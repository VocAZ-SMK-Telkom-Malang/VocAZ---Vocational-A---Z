// app/onboarding/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getDashboardPath } from '@/lib/auth/redirects'

export default async function OnboardingPage() {
  const session = await getServerSession()

  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      select: { role: true },
    })

    if (dbUser?.role) {
      redirect(getDashboardPath(dbUser.role))
    }
  }

  // Jika tidak ada session / belum selesai pilih role -> ke /join
  redirect('/join')
}