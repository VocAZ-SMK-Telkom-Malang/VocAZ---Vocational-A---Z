// components/student/talents/talent-detail-content.tsx
'use client'

import { useState } from 'react'
import {
  Award,
  Briefcase,
  ExternalLink,
  FileCheck,
  FolderGit2,
  GraduationCap,
  MapPin,
  Trophy,
  Video,
  BadgeCheck,
  Star,
  Eye,
  Play,
  Calendar,
  ChevronRight,
  Languages,
} from 'lucide-react'
import { ShowcaseVideoPlayer } from '@/components/student/showcase/showcase-video-player'
import { PortfolioModal } from './modals/portfolio-modal'
import { AchievementModal } from './modals/achievement-modal'
import { CertificateModal } from './modals/certificate-modal'
import { EducationModal } from './modals/education-modal'
import { ExperienceModal } from './modals/experience-modal'

type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

type Talent = {
  id: string
  fullName: string
  headline: string | null
  educations: any[]
  experiences: any[]
  skills: {
    id: string
    name: string
    category: string | null
    proficiency: ProficiencyLevel
  }[]
  achievements: any[]
  portfolios: any[]
  certificates: any[]
  showcaseVideos: {
    id: string
    title: string
    thumbnailUrl: string | null
    videoUrl: string
    videoSource: string
    durationSec: number | null
    viewCount: number
    likeCount: number
    publishedAt: string | null
  }[]
}

type Props = {
  talent: Talent
}

const PROFICIENCY_CONFIG: Record<
  ProficiencyLevel,
  { label: string; color: string }
> = {
  beginner: { label: 'Beginner', color: 'bg-slate-100 text-slate-700' },
  intermediate: { label: 'Intermediate', color: 'bg-blue-100 text-blue-700' },
  advanced: { label: 'Advanced', color: 'bg-indigo-100 text-indigo-700' },
  expert: { label: 'Expert', color: 'bg-emerald-100 text-emerald-700' },
}

export function TalentDetailContent({ talent }: Props) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(
    talent.showcaseVideos[0]?.id ?? null
  )
  const [portfolioModal, setPortfolioModal] = useState<any>(null)
  const [achievementModal, setAchievementModal] = useState<any>(null)
  const [certificateModal, setCertificateModal] = useState<any>(null)
  const [educationModal, setEducationModal] = useState<any>(null)
  const [experienceModal, setExperienceModal] = useState<any>(null)

  const activeVideo = talent.showcaseVideos.find((v) => v.id === activeVideoId)

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* SHOWCASE VIDEO — Compact 2/3 + 1/3            */}
      {/* ============================================ */}
      {talent.showcaseVideos.length > 0 && (
        <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-outline-variant/30">
            <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
              <Video className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-black text-on-surface">
              Showcase Video
            </h2>
            <span className="text-on-surface-variant font-bold text-xs">
              ({talent.showcaseVideos.length})
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Main video */}
            <div className="lg:col-span-2 bg-black">
              <div className="aspect-video relative">
                {activeVideo && (
                  <ShowcaseVideoPlayer
                    videoUrl={activeVideo.videoUrl}
                    videoSource={activeVideo.videoSource}
                    thumbnailUrl={activeVideo.thumbnailUrl}
                    className="w-full h-full"
                    autoPlay={true}
                    muted={false}
                  />
                )}
              </div>
              {activeVideo && (
                <div className="px-4 py-3 bg-surface-container-lowest border-t border-outline-variant/30">
                  <h3 className="text-sm font-bold text-on-surface line-clamp-1">
                    {activeVideo.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-on-surface-variant">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {activeVideo.viewCount}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {activeVideo.likeCount}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Video list */}
            <div className="lg:col-span-1 p-2 space-y-1.5 max-h-[400px] overflow-y-auto bg-surface-container-low/30">
              {talent.showcaseVideos.map((video) => {
                const isActive = video.id === activeVideoId
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setActiveVideoId(video.id)}
                    className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-primary/10 ring-1 ring-primary/20'
                        : 'hover:bg-surface-container'
                    }`}
                  >
                    <div className="relative w-16 aspect-video bg-surface-container rounded-md overflow-hidden shrink-0">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-3 h-3 text-on-surface-variant/40" />
                        </div>
                      )}
                      {isActive && (
                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                          <Play className="w-3 h-3 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[11px] font-bold line-clamp-2 ${
                          isActive ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        {video.title}
                      </p>
                      <p className="text-[9px] text-on-surface-variant mt-0.5">
                        {video.viewCount} views
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* SKILLS — Chip horizontal, 1 baris             */}
      {/* ============================================ */}
      {talent.skills.length > 0 && (
        <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-black text-on-surface">
              Skills{' '}
              <span className="text-on-surface-variant font-bold">
                ({talent.skills.length})
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {talent.skills.map((skill) => {
              const cfg =
                PROFICIENCY_CONFIG[skill.proficiency] ??
                PROFICIENCY_CONFIG.intermediate
              return (
                <span
                  key={skill.id}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}
                  title={cfg.label}
                >
                  {skill.name}
                  <span className="text-[9px] opacity-70">· {cfg.label}</span>
                </span>
              )
            })}
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* 2 COLUMNS — Edu/Exp/Cert | Portfolio/Prestasi */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ============ LEFT COLUMN ============ */}
        <div className="space-y-6">
          {/* PENDIDIKAN */}
          {talent.educations.length > 0 && (
            <SectionCard
              icon={<GraduationCap className="w-3.5 h-3.5" />}
              iconBg="bg-amber-100 text-amber-700"
              title="Pendidikan"
              count={talent.educations.length}
            >
              <div className="space-y-2">
                {talent.educations.map((edu) => (
                  <button
                    key={edu.id}
                    type="button"
                    onClick={() => setEducationModal(edu)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface line-clamp-1">
                        {edu.schoolName}
                      </p>
                      {edu.major && (
                        <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">
                          {edu.major}
                        </p>
                      )}
                      {(edu.startYear || edu.endYear) && (
                        <p className="text-[10px] text-on-surface-variant mt-0.5">
                          {edu.startYear ?? '?'} - {edu.endYear ?? 'Sekarang'}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary shrink-0 mt-2 transition-colors" />
                  </button>
                ))}
              </div>
            </SectionCard>
          )}

          {/* PENGALAMAN */}
          {talent.experiences.length > 0 && (
            <SectionCard
              icon={<Briefcase className="w-3.5 h-3.5" />}
              iconBg="bg-indigo-100 text-indigo-700"
              title="Pengalaman"
              count={talent.experiences.length}
            >
              <div className="space-y-2">
                {talent.experiences.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setExperienceModal(exp)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface line-clamp-1">
                        {exp.title}
                      </p>
                      {exp.companyName && (
                        <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">
                          {exp.companyName}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-on-surface-variant">
                        {exp.startDate && (
                          <span>
                            {new Date(exp.startDate).toLocaleDateString(
                              'id-ID',
                              { month: 'short', year: 'numeric' }
                            )}
                            {' - '}
                            {exp.isCurrent
                              ? 'Sekarang'
                              : exp.endDate
                                ? new Date(exp.endDate).toLocaleDateString(
                                    'id-ID',
                                    { month: 'short', year: 'numeric' }
                                  )
                                : '-'}
                          </span>
                        )}
                        {exp.location && (
                          <span className="inline-flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary shrink-0 mt-2 transition-colors" />
                  </button>
                ))}
              </div>
            </SectionCard>
          )}

          {/* SERTIFIKAT */}
          {talent.certificates.length > 0 && (
            <SectionCard
              icon={<FileCheck className="w-3.5 h-3.5" />}
              iconBg="bg-emerald-100 text-emerald-700"
              title="Sertifikat"
              count={talent.certificates.length}
            >
              <div className="space-y-2">
                {talent.certificates.map((cert) => (
                  <button
                    key={cert.id}
                    type="button"
                    onClick={() => setCertificateModal(cert)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface line-clamp-1">
                        {cert.title}
                      </p>
                      {cert.institutionName && (
                        <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">
                          {cert.institutionName}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        {cert.verificationStatus === 'verified' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                            <BadgeCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        {cert.issuedDate && (
                          <span className="text-[10px] text-on-surface-variant">
                            {new Date(cert.issuedDate).toLocaleDateString(
                              'id-ID',
                              { month: 'short', year: 'numeric' }
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary shrink-0 mt-2 transition-colors" />
                  </button>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* ============ RIGHT COLUMN ============ */}
        <div className="space-y-6">
          {/* PORTFOLIO */}
          {talent.portfolios.length > 0 && (
            <SectionCard
              icon={<FolderGit2 className="w-3.5 h-3.5" />}
              iconBg="bg-purple-100 text-purple-700"
              title="Portfolio"
              count={talent.portfolios.length}
            >
              <div className="grid grid-cols-2 gap-2.5">
                {talent.portfolios.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPortfolioModal(p)}
                    className="group text-left rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-all"
                  >
                    <div className="aspect-video bg-surface-container relative overflow-hidden">
                      {p.thumbnailUrl || p.media?.[0] ? (
                        <img
                          src={p.thumbnailUrl || p.media[0].url}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                          <FolderGit2 className="w-6 h-6" />
                        </div>
                      )}
                      {p.media?.length > 0 && (
                        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold">
                          {p.media.length}
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-[11px] font-bold text-on-surface line-clamp-2">
                        {p.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </SectionCard>
          )}

          {/* PRESTASI */}
          {talent.achievements.length > 0 && (
            <SectionCard
              icon={<Trophy className="w-3.5 h-3.5" />}
              iconBg="bg-orange-100 text-orange-700"
              title="Prestasi"
              count={talent.achievements.length}
            >
              <div className="space-y-2">
                {talent.achievements.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAchievementModal(a)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 text-left transition-all group"
                  >
                    {a.certificateUrl ? (
                      <img
                        src={a.certificateUrl}
                        alt={a.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface line-clamp-2">
                        {a.title}
                      </p>
                      {a.issuer && (
                        <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">
                          {a.issuer}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary shrink-0 mt-2 transition-colors" />
                  </button>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* MODALS                                        */}
      {/* ============================================ */}
      {portfolioModal && (
        <PortfolioModal
          portfolio={portfolioModal}
          onClose={() => setPortfolioModal(null)}
        />
      )}
      {achievementModal && (
        <AchievementModal
          achievement={achievementModal}
          onClose={() => setAchievementModal(null)}
        />
      )}
      {certificateModal && (
        <CertificateModal
          certificate={certificateModal}
          onClose={() => setCertificateModal(null)}
        />
      )}
      {educationModal && (
        <EducationModal
          education={educationModal}
          onClose={() => setEducationModal(null)}
        />
      )}
      {experienceModal && (
        <ExperienceModal
          experience={experienceModal}
          onClose={() => setExperienceModal(null)}
        />
      )}
    </div>
  )
}

function SectionCard({
  icon,
  iconBg,
  title,
  count,
  children,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  count: number
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <h2 className="text-sm font-black text-on-surface">
          {title}{' '}
          <span className="text-on-surface-variant font-bold">({count})</span>
        </h2>
      </div>
      {children}
    </section>
  )
}