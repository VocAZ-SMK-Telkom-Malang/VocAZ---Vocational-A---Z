// app/talenta/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  BadgeCheck,
  Briefcase,
  Mail,
} from 'lucide-react'
import { LandingHeader } from '@/components/landing/header'
import { LandingFooter } from '@/components/landing/footer'
import { getPublicTalentById } from '@/lib/talenta/queries'
import { TalentDetailContent } from '@/components/student/talents/talent-detail-content'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function TalentDetailPage({ params }: Props) {
  const { id } = await params
  const talent = await getPublicTalentById(id)

  if (!talent) notFound()

  return (
    <>
      <LandingHeader />
      <main className="w-full min-h-screen pt-24 bg-gradient-to-b from-[#FDFBF7] via-[#FFF8F5] to-[#FAF8F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/talenta"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Direktori
          </Link>

          {/* Header card */}
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm ring-1 ring-outline-variant/30 mb-6 relative">
            {talent.coverImageUrl ? (
              <div className="w-full h-32 sm:h-48">
                <img
                  src={talent.coverImageUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-32 sm:h-48 bg-gradient-to-r from-primary/10 to-tertiary/10" />
            )}
            <div className="p-6 sm:p-8 relative">
              <div className="flex flex-col sm:flex-row gap-6 -mt-16 sm:-mt-20">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-white bg-white shrink-0 mx-auto sm:mx-0 shadow-sm relative z-10">
                  {talent.avatarUrl ? (
                    <img
                      src={talent.avatarUrl}
                      alt={talent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-display font-extrabold text-2xl sm:text-4xl">
                      {talent.initials}
                    </div>
                  )}
                </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 flex-wrap">
                  {talent.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed/60 text-tertiary-container text-[10px] font-bold uppercase tracking-wider">
                      <BadgeCheck className="w-3 h-3 fill-current" />
                      LSP-BNSP Certified
                    </span>
                  )}
                  {talent.isOpenToWork && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Open to Work
                    </span>
                  )}
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface mb-1">
                  {talent.name}
                </h1>
                {talent.headline && (
                  <p className="text-sm text-primary font-semibold mb-3">
                    {talent.headline}
                  </p>
                )}

                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant">
                  {talent.school && (
                    <span className="inline-flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                      <span className="font-medium text-on-surface">
                        {talent.school}
                      </span>
                      {talent.major && ` · ${talent.major}`}
                    </span>
                  )}
                  {talent.city && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {talent.city}
                      {talent.province ? `, ${talent.province}` : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {talent.bio && (
              <p className="mt-6 text-sm text-on-surface-variant leading-relaxed">
                {talent.bio}
              </p>
            )}
            </div>
          </div>

          {/* Talent Detail Content */}
          <div className="mb-6">
            <TalentDetailContent talent={talent as any} />
          </div>

          {/* CTA Login */}
          <div className="bg-gradient-to-r from-primary-container via-primary to-tertiary-container rounded-2xl p-6 text-white text-center">
            <h3 className="font-display text-lg font-bold mb-2">
              Ingin Menghubungi {talent.name.split(' ')[0]}?
            </h3>
            <p className="text-sm text-white/90 mb-4 max-w-md mx-auto">
              Login atau daftar sebagai perusahaan mitra untuk melihat kontak
              lengkap, CV, dan mengirim pesan langsung.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-display font-semibold shadow-md hover:bg-white/90 transition-all"
              >
                <Mail className="w-4 h-4" />
                Login untuk Menghubungi
              </Link>
              <Link
                href="/register/company/1"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-display font-semibold transition-all"
              >
                <Briefcase className="w-4 h-4" />
                Daftar sebagai Perusahaan
              </Link>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </>
  )
}
