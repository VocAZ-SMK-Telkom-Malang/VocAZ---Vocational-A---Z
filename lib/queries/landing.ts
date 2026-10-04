import { prisma } from '@/lib/prisma'

// ============================================
// HERO STATS
// ============================================

export async function getPlatformStats() {
  const [students, companies, schools] = await Promise.all([
    prisma.user.count({ where: { role: 'student', deletedAt: null } }),
    prisma.user.count({ where: { role: 'company', deletedAt: null } }),
    prisma.user.count({ where: { role: 'school', deletedAt: null } }),
  ])

  return [
    {
      value: `${students.toLocaleString('id-ID')}+`,
      label: 'Siswa BNSP Certified',
      color: 'text-primary',
    },
    {
      value: `${companies.toLocaleString('id-ID')}+`,
      label: 'Mitra Industri Aktif',
      color: 'text-tertiary',
    },
    {
      value: `${schools.toLocaleString('id-ID')}+`,
      label: 'Jejaring SMK & BKK',
      color: 'text-on-surface',
    },
  ]
}

// ============================================
// FEATURED TALENTS
// ============================================

export async function getFeaturedTalents(limit = 6) {
  const students = await prisma.studentProfile.findMany({
    where: {
      isPublic: true,
      isOpenToWork: true,
    },
    take: limit,
    orderBy: { careerReadiness: 'desc' },
    include: {
      user: { select: { fullName: true } },
      skills: {
        take: 3,
        include: { skill: { select: { name: true } } },
      },
      achievements: {
        take: 1,
        orderBy: { dateAchieved: 'desc' },
      },
      educations: {
        take: 1,
        orderBy: { startYear: 'desc' },
      },
      certificates: {
        where: { verificationStatus: 'verified' },
        take: 1,
      },
    },
  })

  return students.map((s) => {
    const fullName = s.user.fullName || 'Anonim'
    const initials = fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    const hasCert = s.certificates.length > 0

    return {
      name: fullName,
      school: s.educations[0]?.schoolName || 'SMK',
      badge: hasCert ? 'LSP-BNSP Verified' : 'BKK Rekomendasi',
      badgeType: hasCert ? ('bnsp' as const) : ('bkk' as const),
      skills: s.skills.map((sk) => sk.skill.name),
      footer:
        s.achievements[0]?.title ||
        `${s.skills.length} Skill Terverifikasi`,
      initials,
    }
  })
}

// ============================================
// FEATURED VIDEOS
// ============================================

export async function getFeaturedVideos(limit = 3) {
  const videos = await prisma.showcaseVideo.findMany({
    where: { status: 'published' },
    take: limit,
    orderBy: { viewCount: 'desc' },
    include: {
      student: {
        include: { user: { select: { fullName: true } } },
      },
    },
  })

  const gradients = [
    'from-[#B45309] via-[#92400E] to-[#451A03]',
    'from-[#B91C1C] via-[#991B1B] to-[#450A0A]',
    'from-[#9D174D] via-[#831843] to-[#500724]',
  ]

  return videos.map((v, i) => ({
    category: v.category || 'Showcase',
    title: v.title,
    desc: v.description || '',
    author: v.student.user.fullName || 'Anonim',
    duration: v.durationSec
      ? `${String(Math.floor(v.durationSec / 60)).padStart(2, '0')}:${String(v.durationSec % 60).padStart(2, '0')} MIN`
      : '00:00 MIN',
    score: 'BNSP 95/100',
    gradient: gradients[i % gradients.length],
  }))
}

// ============================================
// FEATURED JOBS
// ============================================

export async function getFeaturedJobs(limit = 3) {
  const jobs = await prisma.job.findMany({
    where: {
      status: 'active',
      deletedAt: null,
    },
    take: limit,
    orderBy: { publishedAt: 'desc' },
    include: {
      company: {
        select: {
          name: true,
          verificationStatus: true,
        },
      },
      _count: {
        select: { applications: true },
      },
    },
  })

  return jobs.map((j) => {
    const daysLeft = j.expiredAt
      ? Math.ceil(
          (j.expiredAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      : null

    return {
      title: j.title,
      company: j.company.name,
      deadline:
        daysLeft !== null && daysLeft > 0
          ? `Deadline: ${daysLeft} hari lagi`
          : 'Deadline: -',
      location: j.location || j.city || '-',
      salary:
        j.salaryMin && j.salaryMax
          ? `Rp ${j.salaryMin.toLocaleString('id-ID')} - Rp ${j.salaryMax.toLocaleString('id-ID')} / bln`
          : 'Gaji Kompetitif',
      requirement: j.requirements
        ? `Syarat: ${j.requirements.slice(0, 40)}`
        : 'Lihat detail',
      applicants: `${j._count.applications} Pelamar`,
    }
  })
}

// Tambahkan di lib/queries/landing.ts

export type FeaturedTalentCard = {
  profileId: string
  initials: string
  name: string
  headline: string
  school: string
  avatarUrl: string | null
  certTitle: string | null
  certBadgeType: string | null
  skills: string[]
  // Metrics
  profileCompletion: number      // 0-100
  isVerified: boolean
  isOpenToWork: boolean
}

export async function getFeaturedTalentCards(
  limit = 6
): Promise<FeaturedTalentCard[]> {
  const students = await prisma.studentProfile.findMany({
    where: {
      isPublic: true,
      isOpenToWork: true,
      profileCompletion: { gte: 60 },
      user: { isActive: true },
    },
    orderBy: [
      { profileCompletion: 'desc' },
      { careerReadiness: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit,
    include: {
      user: {
        select: {
          fullName: true,
          avatarUrl: true,
        },
      },
      school: {
        select: { name: true },
      },
      skills: {
        include: { skill: { select: { name: true } } },
        take: 3,
      },
      certificates: {
        where: { verificationStatus: 'verified' },
        orderBy: { verifiedAt: 'desc' },
        take: 1,
        select: {
          title: true,
          badgeType: true,
        },
      },
    },
  })

  return students.map((s) => {
    const name = s.user.fullName ?? 'Talent'
    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    return {
      profileId: s.id,
      initials,
      name,
      headline: s.headline ?? 'Talent SMK',
      school: s.school?.name ?? 'SMK',
      avatarUrl: s.user.avatarUrl,
      certTitle: s.certificates[0]?.title ?? null,
      certBadgeType: s.certificates[0]?.badgeType ?? null,
      skills: s.skills.map((sk) => sk.skill.name),
      profileCompletion: s.profileCompletion,
      isVerified: s.certificates.length > 0,
      isOpenToWork: s.isOpenToWork,
    }
  })
}