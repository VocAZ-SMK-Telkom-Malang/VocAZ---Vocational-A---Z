// components/shared/student-profile/profile-content.tsx
'use client'

import { useState } from 'react'
import {
  Award,
  Briefcase,
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
  ChevronRight,
} from 'lucide-react'
import { ShowcaseVideoPlayer } from '@/components/student/showcase/showcase-video-player'
import { PortfolioModal } from './modals/portfolio-modal'
import { AchievementModal } from './modals/achievement-modal'
import { CertificateModal } from './modals/certificate-modal'
import { EducationModal } from './modals/education-modal'
import { ExperienceModal } from './modals/experience-modal'
import type {
  StudentProfileDetail,
  ViewerContext,
} from '@/lib/queries/student-profile-detail'

type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

type Props = {
  profile: StudentProfileDetail
  viewer: ViewerContext
  applicationContext?: {
    applicationId: string
    jobId: string
    jobTitle: string
    status: string
    appliedAt: string
    coverLetter: string | null
    resumeUrl: string | null
    matchScore: number | null
  }
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

export function ProfileContent({ profile, viewer, applicationContext }: Props) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(
    profile.showcaseVideos[0]?.id ?? null
  )
  const [portfolioModal, setPortfolioModal] = useState<any>(null)
  const [achievementModal, setAchievementModal] = useState<any>(null)
  const [certificateModal, setCertificateModal] = useState<any>(null)
  const [educationModal, setEducationModal] = useState<any>(null)
  const [experienceModal, setExperienceModal] = useState<any>(null)

  const activeVideo = profile.showcaseVideos.find(
    (v) => v.id === activeVideoId
  )

  return (
    <div className="space-y-6">
      {/* APPLICATION CONTEXT (kalau dari recruiter view) */}
      {applicationContext && (
        <section className="rounded-2xl bg-primary/5 border border-primary/20 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-on-surface">
                Lamaran untuk: {applicationContext.jobTitle}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-on-surface-variant">
                <span>
                  Applied:{' '}
                  {new Date(applicationContext.appliedAt).toLocaleDateString(
                    'id-ID',
                    { day: 'numeric', month: 'short', year: 'numeric' }
                  )}
                </span>
                <span>Status: {applicationContext.status}</span>
                {applicationContext.matchScore !== null && (
                  <span className="font-bold text-emerald-600">
                    {applicationContext.matchScore}% Match
                  </span>
                )}
              </div>

              {applicationContext.coverLetter && (
                <div className="mt-4 pt-4 border-t border-primary/20">
                  <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">
                    Surat Lamaran
                  </div>
                  <p className="text-sm text-on-surface whitespace-pre-line leading-relaxed">
                    {applicationContext.coverLetter}
                  </p>
                </div>
              )}

              {applicationContext.resumeUrl && (
                <a
                  href={applicationContext.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-container transition-colors"
                >
                  <FileCheck className="w-4 h-4" />
                  Download CV
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SHOWCASE VIDEO */}
      {profile.showcaseVideos.length > 0 && (
        <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-outline-variant/30">
            <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
              <Video className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-black text-on-surface">
              Showcase Video
            </h2>
            <span className="text-on-surface-variant font-bold text-xs">
              ({profile.showcaseVideos.length})
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-black">
              <div className="aspect-video relative">
                {activeVideo && (
                  <ShowcaseVideoPlayer
                    videoUrl={activeVideo.videoUrl}
                    videoSource={activeVideo.videoSource}
                    thumbnailUrl={activeVideo.thumbnailUrl}
                    className="w-full h-full"
                    autoPlay={true}
                    muted={true}
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

            <div className="lg:col-span-1 p-2 space-y-1.5 max-h-[400px] overflow-y-auto bg-surface-container-low/30">
              {profile.showcaseVideos.map((video) => {
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
                        // eslint-disable-next-line @next/next/no-img-element
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

      {/* SKILLS */}
      {profile.skills.length > 0 && (
        <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-black text-on-surface">
              Skills{' '}
              <span className="text-on-surface-variant font-bold">
                ({profile.skills.length})
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => {
              const cfg =
                PROFICIENCY_CONFIG[skill.proficiency as ProficiencyLevel] ??
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

      {/* 2 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {profile.educations.length > 0 && (
            <SectionCard
              icon={<GraduationCap className="w-3.5 h-3.5" />}
              iconBg="bg-amber-100 text-amber-700"
              title="Pendidikan"
              count={profile.educations.length}
            >
              <div className="space-y-2">
                {profile.educations.map((edu) => (
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

          {profile.experiences.length > 0 && (
            <SectionCard
              icon={<Briefcase className="w-3.5 h-3.5" />}
              iconBg="bg-indigo-100 text-indigo-700"
              title="Pengalaman"
              count={profile.experiences.length}
            >
              <div className="space-y-2">
                {profile.experiences.map((exp) => (
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

          {profile.certificates.length > 0 && (
            <SectionCard
              icon={<FileCheck className="w-3.5 h-3.5" />}
              iconBg="bg-emerald-100 text-emerald-700"
              title="Sertifikat"
              count={profile.certificates.length}
            >
              <div className="space-y-2">
                {profile.certificates.map((cert) => (
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

        <div className="space-y-6">
          {profile.portfolios.length > 0 && (
            <SectionCard
              icon={<FolderGit2 className="w-3.5 h-3.5" />}
              iconBg="bg-purple-100 text-purple-700"
              title="Portfolio"
              count={profile.portfolios.length}
            >
              <div className="grid grid-cols-2 gap-2.5">
                {profile.portfolios.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPortfolioModal(p)}
                    className="group text-left rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-all"
                  >
                    <div className="aspect-video bg-surface-container relative overflow-hidden">
                      {p.thumbnailUrl || p.media?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
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

          {profile.achievements.length > 0 && (
            <SectionCard
              icon={<Trophy className="w-3.5 h-3.5" />}
              iconBg="bg-orange-100 text-orange-700"
              title="Prestasi"
              count={profile.achievements.length}
            >
              <div className="space-y-2">
                {profile.achievements.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAchievementModal(a)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 text-left transition-all group"
                  >
                    {a.certificateUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
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

      {/* MODALS */}
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
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}
        >
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