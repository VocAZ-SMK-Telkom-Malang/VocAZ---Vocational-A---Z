// app/school/join/[token]/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { acceptInviteAction } from '../../team/actions'
import Link from 'next/link'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

type Props = {
  params: Promise<{ token: string }>
}

export async function generateMetadata() {
  return { title: 'Join Sekolah — VocAZ' }
}

export default async function SchoolJoinPage({ params }: Props) {
  const { token } = await params

  const session = await getServerSession()
  if (!session?.user?.id) {
    // Redirect ke sign-in dengan return URL
    redirect(`/auth/sign-in?redirect=/school/join/${token}`)
  }

  // Cari sekolah dari token
  const school = await prisma.school.findUnique({
    where: { inviteToken: token },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      inviteActive: true,
      adminSeatQuota: true,
    },
  })

  if (!school) {
    return <ErrorPage
      icon={XCircle}
      title="Link Tidak Valid"
      desc="Invite link ini tidak ditemukan atau sudah kadaluarsa."
    />
  }

  if (!school.inviteActive) {
    return <ErrorPage
      icon={AlertTriangle}
      title="Invite Tidak Aktif"
      desc={`Admin BKK ${school.name} telah menonaktifkan invite link ini.`}
    />
  }

  // Coba accept
  const result = await acceptInviteAction(token)

  if (!result.ok) {
    const errorMessage =
      typeof result.error === 'string' ? result.error : 'Terjadi kesalahan'

    return <ErrorPage
      icon={AlertTriangle}
      title="Gagal Join"
      desc={errorMessage}
    />
  }

  // Redirect ke dashboard setelah 3 detik
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" strokeWidth={2.5} />
        </div>

        <h1 className="text-xl font-black text-on-surface mb-2">
          🎉 Berhasil Bergabung!
        </h1>

        <p className="text-sm text-on-surface-variant mb-6">
          Kamu sekarang jadi <strong>Admin</strong> di BKK{' '}
          <strong>{school.name}</strong>.
        </p>

        <Link
          href="/school/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-white text-sm font-bold shadow-md hover:brightness-110 transition-all"
        >
          Ke Dashboard BKK
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

function ErrorPage({
  icon: Icon,
  title,
  desc,
}: {
  icon: any
  title: string
  desc: string
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-rose-600" strokeWidth={2.5} />
        </div>

        <h1 className="text-xl font-black text-on-surface mb-2">{title}</h1>
        <p className="text-sm text-on-surface-variant mb-6">{desc}</p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  )
}