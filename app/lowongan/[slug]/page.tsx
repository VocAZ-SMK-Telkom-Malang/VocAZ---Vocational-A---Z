// app/lowongan/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LandingHeader } from '@/components/landing/header'
import { LandingFooter } from '@/components/landing/footer'
import { getPublicJobBySlug } from '@/lib/lowongan/queries'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params
  const job = await getPublicJobBySlug(slug)

  if (!job) notFound()

  return (
    <>
      <LandingHeader />
      <main className="w-full min-h-screen pt-24 pb-16 bg-gradient-to-b from-[#fffaf5] via-[#fef4ea] to-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/lowongan"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Lowongan
          </Link>

          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm ring-1 ring-outline-variant/30">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface mb-2">
              {job.title}
            </h1>
            <p className="text-sm text-on-surface-variant mb-6">
              {job.company.name} · {job.city || 'Remote'}
            </p>

            {job.description && (
              <div className="prose prose-sm max-w-none text-on-surface-variant whitespace-pre-line">
                {job.description}
              </div>
            )}

            {/* CTA Login */}
            <div className="mt-8 pt-6 border-t border-outline-variant/30">
              <Link
                href={`/auth/sign-in?next=/lowongan/${job.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display font-semibold shadow-md hover:brightness-105 transition-all"
              >
                Login untuk Melamar
              </Link>
              <p className="text-center text-xs text-on-surface-variant mt-2">
                Khusus Akun Siswa Terverifikasi
              </p>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </>
  )
}