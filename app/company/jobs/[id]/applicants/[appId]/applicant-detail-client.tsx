// app/company/jobs/[id]/applicants/[appId]/applicant-detail-client.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  MapPin,
  Briefcase,
  Mail,
  Phone,
} from 'lucide-react'
import { ApplicantStatusPanel } from '@/components/company/applicants/applicant-status-panel'
import { AiInterviewResult } from '@/components/company/applicants/ai-interview-result'
import { InviteAiInterviewModal } from '@/components/company/applicants/invite-ai-interview-modal'
import { ApplicantInterviewPanel } from '@/components/company/applicants/applicant-interview-panel'
import { ApplicantNotesPanel } from '@/components/company/applicants/applicant-notes-panel'
import { ApplicantTimeline } from '@/components/company/applicants/applicant-timeline'
import { ApplicantActions } from '@/components/company/applicants/applicant-actions'
import type { ApplicantDetail } from '@/lib/queries/company-applicant-detail'
import { MatchScoreBadge } from '@/components/company/applicants/match-score-badge'
import { SaveTalentButton } from '@/components/company/saved/save-talent-button'

type Props = {
  detail: ApplicantDetail
  jobId: string
  defaultRecruiterName: string
  backUrl: string
  backLabel: string
  aiInterview: {
    id: string
    status: string
    invitedAt: string
    completedAt: string | null
    expiresAt: string | null
    answers: Array<{
      id: string
      questionIndex: number
      question: string
      answer: string | null
      answeredAt: string | null
    }>
  } | null
}
function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function ApplicantDetailClient({
  detail,
  jobId,
  defaultRecruiterName,
  backUrl,
  backLabel,
  aiInterview,
}: Props) {
  const { application, job, student, timeline } = detail
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      {/* Back */}
      <Link
        href={backUrl}
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar pelamar
      </Link>

      {/* Hero */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="flex items-start gap-4">
          {student.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={student.avatarUrl}
              alt={student.fullName}
              className="w-20 h-20 rounded-2xl object-cover shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-black text-2xl shrink-0">
              {getInitials(student.fullName)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-on-surface tracking-tight">
              {student.fullName}
            </h1>
            {student.headline && (
              <p className="text-sm text-on-surface-variant mt-0.5">
                {student.headline}
              </p>
            )}

            {application.matchScore !== null && (
              <div className="mt-3">
                <MatchScoreBadge
                  score={application.matchScore}
                  size="lg"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-on-surface-variant">
              {student.school && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {student.school.name}
                </span>
              )}
              {student.city && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {student.city}
                  {student.province ? `, ${student.province}` : ''}
                </span>
              )}
              {student.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {student.email}
                </span>
              )}
              {student.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {student.phone}
                </span>
              )}
            </div>

            {/* Job context */}
            <div className="mt-4 pt-4 border-t border-outline-variant/30">
              <div className="text-[11px] text-on-surface-variant">
                Melamar untuk:
              </div>
              <Link
                href={`/company/jobs/${job.id}`}
                className="inline-flex items-center gap-2 mt-1 text-sm font-bold text-primary hover:underline"
              >
                <Briefcase className="w-4 h-4" />
                {job.title}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
              <h2 className="text-sm font-bold text-on-surface mb-3">
                Surat Lamaran
              </h2>
              <p className="text-sm text-on-surface whitespace-pre-line leading-relaxed">
                {application.coverLetter}
              </p>
            </div>
          )}

          {/* CV */}
          {application.resumeUrl && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
              <h2 className="text-sm font-bold text-on-surface mb-3">
                CV yang Dikirim
              </h2>
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
              >
                Buka CV
              </a>
            </div>
          )}
        {/* AI Interview */}
          <AiInterviewResult
            interview={aiInterview}
            onInvite={() => setInviteOpen(true)}
            canInvite={true}
          />

          <InviteAiInterviewModal
            open={inviteOpen}
            onClose={() => setInviteOpen(false)}
            applicationId={application.id}
            candidateName={student.fullName}
          />
          {/* Timeline */}
          <ApplicantTimeline timeline={timeline} />

          {/* Profile Summary */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
            <h2 className="text-sm font-bold text-on-surface mb-3">
              Ringkasan Profil
            </h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-surface-container-low">
                <div className="text-2xl font-black text-primary">
                  {student.skills.length}
                </div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mt-1">
                  Skill
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low">
                <div className="text-2xl font-black text-primary">
                  {student.certificates.length}
                </div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mt-1">
                  Sertifikat
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low">
                <div className="text-2xl font-black text-primary">
                  {student.portfolios.length}
                </div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mt-1">
                  Portfolio
                </div>
              </div>
            </div>

            <Link
              href={`/company/talent/${student.id}`}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors"
            >
              Lihat Profil Lengkap →
            </Link>
          </div>
        </div>

        <SaveTalentButton
            studentId={student.id}
            source="applicant"
            variant="button"
          />

        {/* RIGHT — Actions */}
        <div className="space-y-4 lg:sticky lg:top-24 h-fit">
          <ApplicantStatusPanel
            applicationId={application.id}
            currentStatus={application.status}
          />

          <ApplicantInterviewPanel
            applicationId={application.id}
            initialInterviewDate={application.interviewDate}
            initialNextStep={application.nextStep}
            initialRecruiterName={application.recruiterName}
            defaultRecruiterName={defaultRecruiterName}
          />

          <ApplicantNotesPanel
            applicationId={application.id}
            initialNotes={application.notes}
          />

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
            <h3 className="text-sm font-bold text-on-surface mb-3">Aksi</h3>
            <ApplicantActions
              applicationId={application.id}
              studentUserId={student.userId}
              currentStatus={application.status}
              resumeUrl={application.resumeUrl}
            />
          </div>
        </div>
      </div>
    </div>
  )
}