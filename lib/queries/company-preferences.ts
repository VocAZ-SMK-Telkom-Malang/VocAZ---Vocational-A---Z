// lib/queries/company-preferences.ts
import { prisma } from '@/lib/prisma'

export type TalentPreferenceData = {
  id: string | null
  skills: string[]
  programs: string[]
  locations: string[]
  certifications: string[]
  minExperience: number | null
  maxExperience: number | null
  workMode: string | null
  preferVerified: boolean
  preferBnsp: boolean
  minMatchScore: number
  updatedAt: string | null
}

export type PreferencesOptions = {
  skills: { id: string; name: string; category: string | null }[]
  programs: string[]
  cities: string[]
  certifications: string[]
}

const DEFAULT_PREFS: TalentPreferenceData = {
  id: null,
  skills: [],
  programs: [],
  locations: [],
  certifications: [],
  minExperience: null,
  maxExperience: null,
  workMode: null,
  preferVerified: true,
  preferBnsp: true,
  minMatchScore: 60,
  updatedAt: null,
}

// ============================================
// GET COMPANY PREFERENCES
// ============================================

export async function getCompanyPreferences(
  companyId: string
): Promise<TalentPreferenceData> {
  const prefs = await prisma.talentPreference.findUnique({
    where: { companyId },
  })

  if (!prefs) return DEFAULT_PREFS

  return {
    id: prefs.id,
    skills: prefs.skills,
    programs: prefs.programs,
    locations: prefs.locations,
    certifications: prefs.certifications,
    minExperience: prefs.minExperience,
    maxExperience: prefs.maxExperience,
    workMode: prefs.workMode,
    preferVerified: prefs.preferVerified,
    preferBnsp: prefs.preferBnsp,
    minMatchScore: prefs.minMatchScore,
    updatedAt: prefs.updatedAt.toISOString(),
  }
}

// ============================================
// GET FILTER OPTIONS
// ============================================

export async function getPreferencesOptions(): Promise<PreferencesOptions> {
  const [skills, programs, cities, certTitles] = await Promise.all([
    // Skills
    prisma.skill.findMany({
      select: { id: true, name: true, category: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      take: 200,
    }),

    // Programs (jurusan unik dari student profile)
    prisma.studentEducation
      .findMany({
        where: { major: { not: null } },
        select: { major: true },
        distinct: ['major'],
        orderBy: { major: 'asc' },
      })
      .then((r) => r.map((e) => e.major!).filter(Boolean)),

    // Cities unik
    prisma.studentProfile
      .findMany({
        where: { city: { not: null } },
        select: { city: true },
        distinct: ['city'],
        orderBy: { city: 'asc' },
      })
      .then((r) => r.map((s) => s.city!).filter(Boolean)),

    // Certificate titles unik
    prisma.certificate
      .findMany({
        where: { verificationStatus: 'verified' },
        select: { title: true },
        distinct: ['title'],
        orderBy: { title: 'asc' },
      })
      .then((r) => r.map((c) => c.title).filter(Boolean)),
  ])

  return {
    skills,
    programs,
    cities,
    certifications: certTitles,
  }
}

// ============================================
// GET PREFERENCE STATS
// ============================================

export async function getPreferenceStats(companyId: string) {
  const [totalCandidates, matchedCandidates, topSkillCount] =
    await Promise.all([
      prisma.studentProfile.count({
        where: { isPublic: true, user: { isActive: true } },
      }),
      // Placeholder — matched candidates akan dihitung berdasarkan preferences
      // Kalau ada query "match score > minMatchScore" untuk talent pool
      Promise.resolve(0),
      prisma.skill.count(),
    ])

  return {
    totalCandidates,
    matchedCandidates,
    topSkillCount,
  }
}