// lib/queries/cert-verifications.ts
import { prisma } from '@/lib/prisma'

export type VerificationListItem = {
  id: string
  status: string
  submittedAt: string
  submittedAtRelative: string
  reviewedAt: string | null
  notes: string | null

  certificate: {
    id: string
    title: string
    certificateNumber: string | null
    issuedDate: string | null
    expiredDate: string | null
    documentUrl: string | null
    badgeType: string
    verificationStatus: string
  }

  student: {
    profileId: string
    fullName: string
    email: string
    avatarUrl: string | null
    headline: string | null
    city: string | null
  }
}

export type VerificationsFilter = {
  status?: 'all' | 'pending' | 'in_review' | 'verified' | 'rejected'
  search?: string
  badgeType?: string
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

export async function getVerifications(
  institutionId: string,
  filters: VerificationsFilter = {}
) {
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 20
  const skip = (page - 1) * pageSize
  const status = filters.status ?? 'all'

  const where: any = { institutionId }

  if (status !== 'all') {
    where.status = status
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
      orderBy: [
        // Pending & in_review di atas
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
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
      where: { institutionId },
      _count: true,
    }),
  ])

  const counts = {
    all: 0,
    pending: 0,
    in_review: 0,
    verified: 0,
    rejected: 0,
  }
  statusCounts.forEach((s) => {
    counts[s.status as keyof typeof counts] = s._count
    counts.all += s._count
  })

  return {
    verifications: rows.map<VerificationListItem>((r) => ({
      id: r.id,
      status: r.status,
      submittedAt: r.createdAt.toISOString(),
      submittedAtRelative: relativeTime(r.createdAt),
      reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
      notes: r.notes ?? null,

      certificate: {
        id: r.certificate.id,
        title: r.certificate.title,
        certificateNumber: r.certificate.certificateNumber ?? null,
        issuedDate: r.certificate.issuedDate
          ? r.certificate.issuedDate.toISOString()
          : null,
        expiredDate: r.certificate.expiredDate
          ? r.certificate.expiredDate.toISOString()
          : null,
        documentUrl: r.certificate.documentUrl ?? null,
        badgeType: r.certificate.badgeType,
        verificationStatus: r.certificate.verificationStatus,
      },

      student: {
        profileId: r.certificate.student.id,
        fullName: r.certificate.student.user.fullName ?? 'Siswa',
        email: r.certificate.student.user.email,
        avatarUrl: r.certificate.student.user.avatarUrl ?? null,
        headline: r.certificate.student.headline ?? null,
        city: r.certificate.student.city ?? null,
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
// DETAIL
// ============================================

export type VerificationDetail = {
  id: string
  status: string
  submittedAt: string
  reviewedAt: string | null
  notes: string | null

  certificate: {
    id: string
    title: string
    certificateNumber: string | null
    issuedDate: string | null
    expiredDate: string | null
    documentUrl: string | null
    badgeType: string
    verificationStatus: string
  }

  student: {
    profileId: string
    fullName: string
    email: string
    avatarUrl: string | null
    headline: string | null
    bio: string | null
    nisn: string | null
    city: string | null
    province: string | null
    profileCompletion: number
    careerReadiness: number
    isOpenToWork: boolean
  }

  history: Array<{
    id: string
    status: string
    submittedAt: string
    reviewedAt: string | null
    notes: string | null
  }>
}

export async function getVerificationDetail(
  institutionId: string,
  requestId: string
): Promise<VerificationDetail | null> {
  const r = await prisma.verificationRequest.findFirst({
    where: { id: requestId, institutionId },
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
  })

  if (!r) return null

  // History: semua request untuk certificate ini (kalau pernah re-submit)
  const history = await prisma.verificationRequest.findMany({
    where: { certificateId: r.certificateId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      createdAt: true,
      reviewedAt: true,
      notes: true,
    },
  })

  return {
    id: r.id,
    status: r.status,
    submittedAt: r.createdAt.toISOString(),
    reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
    notes: r.notes ?? null,

    certificate: {
      id: r.certificate.id,
      title: r.certificate.title,
      certificateNumber: r.certificate.certificateNumber ?? null,
      issuedDate: r.certificate.issuedDate
        ? r.certificate.issuedDate.toISOString()
        : null,
      expiredDate: r.certificate.expiredDate
        ? r.certificate.expiredDate.toISOString()
        : null,
      documentUrl: r.certificate.documentUrl ?? null,
      badgeType: r.certificate.badgeType,
      verificationStatus: r.certificate.verificationStatus,
    },

    student: {
      profileId: r.certificate.student.id,
      fullName: r.certificate.student.user.fullName ?? 'Siswa',
      email: r.certificate.student.user.email,
      avatarUrl: r.certificate.student.user.avatarUrl ?? null,
      headline: r.certificate.student.headline ?? null,
      bio: r.certificate.student.bio ?? null,
      nisn: r.certificate.student.nisn ?? null,
      city: r.certificate.student.city ?? null,
      province: r.certificate.student.province ?? null,
      profileCompletion: r.certificate.student.profileCompletion,
      careerReadiness: r.certificate.student.careerReadiness,
      isOpenToWork: r.certificate.student.isOpenToWork,
    },

    history: history.map((h) => ({
      id: h.id,
      status: h.status,
      submittedAt: h.createdAt.toISOString(),
      reviewedAt: h.reviewedAt ? h.reviewedAt.toISOString() : null,
      notes: h.notes ?? null,
    })),
  }
}