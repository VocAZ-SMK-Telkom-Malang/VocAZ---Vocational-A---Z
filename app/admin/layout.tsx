import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { AdminShell } from '@/components/admin/layout/admin-shell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  if (!session?.user) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      fullName: true,
      email: true,
      role: true,
    },
  })

  if (!user || user.role !== 'admin') {
    redirect('/')
  }

  return (
    <AdminShell
      user={{
        fullName: user.fullName,
        email: user.email,
      }}
      title="Admin Dashboard"
    >
      {children}
    </AdminShell>
  )
}