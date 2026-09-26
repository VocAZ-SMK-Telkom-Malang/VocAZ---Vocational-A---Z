import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { LogoutButton } from '@/components/shared/logout-button'

export default async function CompanyDashboard() {
  const session = await getServerSession()
  if (!session?.user) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
  })
  if (!user) redirect('/onboarding')

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard Company 🏢</h1>
          <LogoutButton />
        </div>
        <p className="text-gray-600">
          Selamat datang, <strong>{user.fullName}</strong>!
        </p>
      </div>
    </div>
  )
}