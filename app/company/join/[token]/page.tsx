// app/company/join/[token]/page.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import {
  Building2,
  AlertCircle,
  CheckCircle2,
  Mail,
  UserPlus,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ token: string }>
}

export default async function CompanyJoinPage({ params }: Props) {
  const { token } = await params

  // Cari invitation
  const invitation = await prisma.companyInvitation.findUnique({
    where: { token },
    include: {
      company: {
        select: { id: true, name: true, slug: true, logoUrl: true },
      },
    },
  })

  if (!invitation) {
    return <ErrorState title="Undangan tidak ditemukan" desc="Link mungkin salah atau sudah dihapus." />
  }

  if (invitation.status === 'revoked') {
    return <ErrorState title="Undangan dibatalkan" desc="Owner telah membatalkan undangan ini." />
  }

  if (invitation.status === 'accepted') {
    return <ErrorState title="Undangan sudah diterima" desc="Kamu sudah bergabung ke team ini." />
  }

  if (invitation.expiresAt.getTime() < Date.now()) {
    return <ErrorState title="Undangan kadaluarsa" desc="Undangan ini sudah lewat batas waktu. Minta owner untuk kirim ulang." />
  }

  // Cek session
  const session = await getServerSession()

  if (!session?.user?.id) {
    // Belum login → redirect ke sign-in dengan return URL
    redirect(`/auth/sign-in?redirect=/company/join/${token}`)
  }

  // User sudah login
  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      email: true,
      role: true,
      fullName: true,
    },
  })

  if (!user) {
    redirect('/onboarding')
  }

  // Cek apakah email user sama dengan email invitation
  if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
    return (
      <ErrorState
        title="Email tidak cocok"
        desc={`Undangan ini ditujukan untuk ${invitation.email}, tapi kamu login dengan ${user.email}. Logout dan login dengan email yang benar.`}
      />
    )
  }

  // Cek sudah jadi member?
  const existingMember = await prisma.companyMember.findFirst({
    where: {
      companyId: invitation.companyId,
      userId: user.id,
    },
  })

  if (existingMember) {
    // Sudah member → redirect
    redirect('/company/dashboard')
  }

  // ✅ Auto-accept: tambahkan ke company member
  try {
    await prisma.$transaction([
      prisma.companyMember.create({
        data: {
          companyId: invitation.companyId,
          userId: user.id,
          role: invitation.role,
        },
      }),
      prisma.companyInvitation.update({
        where: { id: invitation.id },
        data: {
          status: 'accepted',
          acceptedAt: new Date(),
        },
      }),
    ])

    redirect('/company/dashboard?joined=1')
  } catch (err) {
    console.error('[joinCompany] Error:', err)
    return <ErrorState title="Gagal bergabung" desc="Terjadi kesalahan. Hubungi owner perusahaan." />
  }
}

function ErrorState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 text-center shadow-lg">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-error" />
        </div>
        <h1 className="text-xl font-black text-on-surface mb-2">{title}</h1>
        <p className="text-sm text-on-surface-variant mb-6">{desc}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-container transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}