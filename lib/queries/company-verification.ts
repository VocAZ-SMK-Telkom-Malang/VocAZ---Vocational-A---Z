// lib/queries/company-verification.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type VerificationDocument = {
  key: string
  label: string
  url: string | null
  uploadedAt?: string
}

export type VerificationSubmission = {
  id: string
  status: string
  submittedAt: string
  submittedAtRelative: string
  reviewedAt: string | null
  reviewNotes: string | null
  documents: VerificationDocument[]
}

export type VerificationState = {
  currentStatus:
    | 'unverified'
    | 'pending'
    | 'in_review'
    | 'verified'
    | 'rejected'
  verifiedAt: string | null
  latestSubmission: VerificationSubmission | null
  history: VerificationSubmission[]
  canSubmit: boolean
  canResubmit: boolean
}

// ============================================
// HELPERS
// ============================================

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} minggu lalu`
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function extractDocuments(sub: any): VerificationDocument[] {
  const docs: VerificationDocument[] = []

  if (sub.legalDocumentUrl) {
    docs.push({
      key: 'legal-document',
      label: 'Dokumen Legal',
      url: sub.legalDocumentUrl,
    })
  }

  if (sub.businessRegistrationUrl) {
    docs.push({
      key: 'business-registration',
      label: 'Akta Pendirian / NIB / SIUP',
      url: sub.businessRegistrationUrl,
    })
  }

  if (sub.supportingDocs && Array.isArray(sub.supportingDocs)) {
    sub.supportingDocs.forEach((d: any, idx: number) => {
      docs.push({
        key: `supporting-${idx}`,
        label: d.label ?? `Dokumen Pendukung ${idx + 1}`,
        url: d.url ?? null,
      })
    })
  }

  return docs
}

// ============================================
// GET VERIFICATION STATE
// ============================================

export async function getVerificationState(
  companyId: string
): Promise<VerificationState> {
  const [company, submissions] = await Promise.all([
    prisma.company.findUnique({
      where: { id: companyId },
      select: {
        verificationStatus: true,
        verifiedAt: true,
      },
    }),
    prisma.companyVerification.findMany({
      where: { companyId },
      orderBy: { submittedAt: 'desc' },
    }),
  ])

  const currentStatus = (company?.verificationStatus ??
    'unverified') as VerificationState['currentStatus']
  const verifiedAt = company?.verifiedAt?.toISOString() ?? null

  const mappedSubmissions: VerificationSubmission[] = submissions.map((s) => ({
    id: s.id,
    status: s.status,
    submittedAt: s.submittedAt.toISOString(),
    submittedAtRelative: relativeTime(s.submittedAt),
    reviewedAt: s.reviewedAt?.toISOString() ?? null,
    reviewNotes: s.reviewNotes,
    documents: extractDocuments(s),
  }))

  const latestSubmission = mappedSubmissions[0] ?? null

  const hasPendingSubmission = mappedSubmissions.some(
    (s) => s.status === 'pending' || s.status === 'in_review'
  )

  return {
    currentStatus,
    verifiedAt,
    latestSubmission,
    history: mappedSubmissions,
    canSubmit: currentStatus === 'unverified' && !hasPendingSubmission,
    canResubmit: currentStatus === 'rejected' && !hasPendingSubmission,
  }
}