// lib/queries/cert-records.ts
import { prisma } from '@/lib/prisma'

export type RecordItem = {
  id: string
  status: string
  reviewedAt: string | null
  reviewedAtRelative: string
  notes: string | null

  certificate: {
    id: string
    title: string
    certificateNumber: string | null
    issuedDate: string | null
    badgeType: string
    documentUrl: string | null
  }

  student: {
    profileId: string
    fullName: string
    email: string
    avatarUrl: string | null
  }
}

export type RecordsFilter = {
  status?: 'all' | 'verified' | 'rejected'
  search?: string
  badgeType?: string
  period?: '7d' | '30d' | '90d' | 'all'
  page?: number
  pageSize?: number
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
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} minggu lalu`
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getPeriodStart(period: string): Date | null {
  if (period === 'all') return null
  const d = new Date()
  if (period === '7d') d.setDate(d.getDate() - 7)
  else if (period === '30d') d.setDate(d.getDate() - 30)
  else if (period === '90d') d.setDate(d.getDate() - 90)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function getCertRecords(
  institutionId: string,
  filters: RecordsFilter = {}
) {
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 20
  const skip = (page - 1) * pageSize
  const status = filters.status ?? 'all'
  const period = filters.period ?? 'all'

  const where: any = {
    institutionId,
    status: { in: ['verified', 'rejected'] },
  }

  if (status !== 'all') {
    where.status = status
  }

  const periodStart = getPeriodStart(period)
  if (periodStart) {
    where.reviewedAt = { gte: periodStart }
  }

  if (filters.badgeType && filters.badgeType !== 'all') {
    where.certificate = { badgeType: filters.badgeType }
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim()
    where.OR = [
      { certificate: { title: { contains: q, mode: 'insensitive' } } },
      {
        certificate: {
          certificateNumber: { contains: q, mode: 'insensitive' },
        },
      },
      {
        certificate: {
          student: {
            user: { fullName: { contains: q, mode: 'insensitive' } },
          },
        },
      },
    ]
  }

  const [rows, total, statusCounts] = await Promise.all([
    prisma.verificationRequest.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { reviewedAt: 'desc' },
      include: {
        certificate: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.verificationRequest.count({ where }),
    prisma.verificationRequest.groupBy({
      by: ['status'],
      where: {
        institutionId,
        status: { in: ['verified', 'rejected'] },
      },
      _count: true,
    }),
  ])

  const counts = { all: 0, verified: 0, rejected: 0 }
  statusCounts.forEach((s) => {
    counts[s.status as keyof typeof counts] = s._count
    counts.all += s._count
  })

  return {
    records: rows.map<RecordItem>((r) => ({
      id: r.id,
      status: r.status,
      reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
      reviewedAtRelative: r.reviewedAt
        ? relativeTime(r.reviewedAt)
        : 'Tidak diketahui',
      notes: r.notes ?? null,

      certificate: {
        id: r.certificate.id,
        title: r.certificate.title,
        certificateNumber: r.certificate.certificateNumber ?? null,
        issuedDate: r.certificate.issuedDate
          ? r.certificate.issuedDate.toISOString()
          : null,
        badgeType: r.certificate.badgeType,
        documentUrl: r.certificate.documentUrl ?? null,
      },

      student: {
        profileId: r.certificate.student.id,
        fullName: r.certificate.student.user.fullName ?? 'Siswa',
        email: r.certificate.student.user.email,
        avatarUrl: r.certificate.student.user.avatarUrl ?? null,
      },
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    counts,
  }
}

// ============================================
// Stats untuk header
// ============================================

export async function getCertRecordsStats(institutionId: string) {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [totalVerified, totalRejected, thisMonthVerified, thisMonthRejected] =
    await Promise.all([
      prisma.verificationRequest.count({
        where: { institutionId, status: 'verified' },
      }),
      prisma.verificationRequest.count({
        where: { institutionId, status: 'rejected' },
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
    ])

  return {
    totalVerified,
    totalRejected,
    thisMonthVerified,
    thisMonthRejected,
    approvalRate:
      totalVerified + totalRejected > 0
        ? Math.round((totalVerified / (totalVerified + totalRejected)) * 100)
        : 0,
  }
}