// app/student/layout.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { StudentShell } from '@/components/student/layout/student-shell'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      role: true,
    },
  })

  if (!user) {
    redirect('/join')
  }

  // Guard: hanya student yang boleh masuk
  if (user.role !== 'student') {
    redirect('/')
  }

  return (
    <StudentShell
      user={{
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      }}
    >
      {children}
    </StudentShell>
  )
}