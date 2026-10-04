// lib/queries/cert-dashboard.ts
import { prisma } from '@/lib/prisma'

export type CertDashboardStats = {
  pending: number
  inReview: number
  verifiedThisMonth: number
  rejectedThisMonth: number
  totalVerified: number
  totalRejected: number
  avgResponseHours: number
}

export type RecentRequest = {
  id: string
  certificateId: string
  studentName: string
  studentAvatarUrl: string | null
  certificateTitle: string
  certificateNumber: string | null
  badgeType: string
  status: string
  submittedAt: string
  submittedAtRelative: string
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export async function getCertDashboardStats(
  institutionId: string
): Promise<CertDashboardStats> {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    pending,
    inReview,
    verifiedThisMonth,
    rejectedThisMonth,
    totalVerified,
    totalRejected,
    allReviewed,
  ] = await Promise.all([
    prisma.verificationRequest.count({
      where: { institutionId, status: 'pending' },
    }),
    prisma.verificationRequest.count({
      where: { institutionId, status: 'in_review' },
    }),
    prisma.verificationRequest.count({
      where: {
        institutionId,
        status: 'verified',
        reviewedAt: { gte: startOfMonth },
      },
    }),
    prisma.verificationRequest.count({
      where: {
        institutionId,
        status: 'rejected',
        reviewedAt: { gte: startOfMonth },
      },
    }),
    prisma.verificationRequest.count({
      where: { institutionId, status: 'verified' },
    }),
    prisma.verificationRequest.count({
      where: { institutionId, status: 'rejected' },
    }),
    prisma.verificationRequest.findMany({
      where: {
        institutionId,
        reviewedAt: { not: null },
      },
      select: { createdAt: true, reviewedAt: true },
      take: 100,
      orderBy: { reviewedAt: 'desc' },
    }),
  ])

  // Hitung avg response
  let avgResponseHours = 0
  if (allReviewed.length > 0) {
    const totalMs = allReviewed.reduce((sum, r) => {
      if (!r.reviewedAt) return sum
      return sum + (r.reviewedAt.getTime() - r.createdAt.getTime())
    }, 0)
    avgResponseHours = Math.round(
      totalMs / allReviewed.length / (1000 * 60 * 60)
    )
  }

  return {
    pending,
    inReview,
    verifiedThisMonth,
    rejectedThisMonth,
    totalVerified,
    totalRejected,
    avgResponseHours,
  }
}

export async function getRecentRequests(
  institutionId: string,
  limit = 5
): Promise<RecentRequest[]> {
  const rows = await prisma.verificationRequest.findMany({
    where: { institutionId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      certificate: {
        include: {
          student: {
            include: {
              user: { select: { fullName: true, avatarUrl: true } },
            },
          },
        },
      },
    },
  })

  return rows.map((r) => ({
    id: r.id,
    certificateId: r.certificate.id,
    studentName: r.certificate.student.user.fullName ?? 'Siswa',
    studentAvatarUrl: r.certificate.student.user.avatarUrl ?? null,
    certificateTitle: r.certificate.title,
    certificateNumber: r.certificate.certificateNumber ?? null,
    badgeType: r.certificate.badgeType,
    status: r.status,
    submittedAt: r.createdAt.toISOString(),
    submittedAtRelative: relativeTime(r.createdAt),
  }))
}

// ============================================
// Verification trend (7 hari terakhir)
// ============================================

export type TrendPoint = {
  date: string
  label: string
  submitted: number
  verified: number
  rejected: number
}

export async function getVerificationTrend(
  institutionId: string,
  days = 7
): Promise<TrendPoint[]> {
  const start = new Date()
  start.setDate(start.getDate() - days + 1)
  start.setHours(0, 0, 0, 0)

  const [submitted, reviewed] = await Promise.all([
    prisma.verificationRequest.findMany({
      where: { institutionId, createdAt: { gte: start } },
      select: { createdAt: true },
    }),
    prisma.verificationRequest.findMany({
      where: {
        institutionId,
        reviewedAt: { gte: start },
        status: { in: ['verified', 'rejected'] },
      },
      select: { reviewedAt: true, status: true },
    }),
  ])

  const points: TrendPoint[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const dateKey = d.toISOString().slice(0, 10)
    const nextDay = new Date(d)
    nextDay.setDate(nextDay.getDate() + 1)

    const submittedCount = submitted.filter(
      (s) => s.createdAt >= d && s.createdAt < nextDay
    ).length

    const verifiedCount = reviewed.filter(
      (r) =>
        r.reviewedAt &&
        r.reviewedAt >= d &&
        r.reviewedAt < nextDay &&
        r.status === 'verified'
    ).length

    const rejectedCount = reviewed.filter(
      (r) =>
        r.reviewedAt &&
        r.reviewedAt >= d &&
        r.reviewedAt < nextDay &&
        r.status === 'rejected'
    ).length

    points.push({
      date: dateKey,
      label: d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      }),
      submitted: submittedCount,
      verified: verifiedCount,
      rejected: rejectedCount,
    })
  }

  return points
}