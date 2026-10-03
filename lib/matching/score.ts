// lib/matching/score.ts
import {
  MatchWeights,
  DEFAULT_WEIGHTS,
  MatchBreakdown,
  SkillMatchDetail,
} from './types'

// ============================================
// SKILL CATEGORIES — untuk fuzzy match
// ============================================

const SKILL_ALIASES: Record<string, string[]> = {
  react: ['reactjs', 'react.js', 'react native'],
  'node.js': ['nodejs', 'node'],
  typescript: ['ts'],
  javascript: ['js', 'es6'],
  postgresql: ['postgres', 'psql'],
  mongodb: ['mongo'],
  mysql: ['mariadb'],
  html: ['html5'],
  css: ['css3'],
  tailwind: ['tailwindcss'],
  'next.js': ['nextjs', 'next'],
  vue: ['vuejs', 'vue.js'],
  angular: ['angularjs'],
  python: ['py'],
  golang: ['go'],
  docker: ['container'],
  kubernetes: ['k8s'],
  figma: ['figma design'],
  excel: ['microsoft excel', 'ms excel'],
  word: ['microsoft word', 'ms word'],
  linux: ['ubuntu', 'debian'],
}

const PROFICIENCY_MULTIPLIER: Record<string, number> = {
  expert: 1.0,
  advanced: 0.85,
  intermediate: 0.7,
  beginner: 0.5,
}

// ============================================
// NORMALIZE STRING
// ============================================

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

function isSkillMatch(
  jobSkill: string,
  candidateSkill: string
): boolean {
  const j = normalize(jobSkill)
  const c = normalize(candidateSkill)

  if (j === c) return true

  // Check aliases
  const aliases = SKILL_ALIASES[normalize(jobSkill)] ?? []
  if (aliases.some((a) => normalize(a) === c)) return true

  // Partial: "React" matches "React Native"
  if (j.length >= 4 && c.includes(j)) return true
  if (c.length >= 4 && j.includes(c)) return true

  return false
}

// ============================================
// CALCULATE SKILLS SCORE
// ============================================

type CandidateSkill = {
  id: string
  name: string
  category: string | null
  proficiency: string
}

type JobSkill = {
  id: string
  name: string
  category: string | null
  isRequired: boolean
}

function calculateSkillsScore(
  candidateSkills: CandidateSkill[],
  jobSkills: JobSkill[]
): { score: number; details: SkillMatchDetail[] } {
  if (jobSkills.length === 0) {
    return { score: 0.5, details: [] }  // netral kalau job tidak specify skill
  }

  const requiredSkills = jobSkills.filter((s) => s.isRequired)
  const niceSkills = jobSkills.filter((s) => !s.isRequired)

  const details: SkillMatchDetail[] = []
  let requiredMatched = 0
  let niceMatched = 0

  // Match required
  for (const jobSkill of requiredSkills) {
    let matched = false
    let matchedByName: string | undefined
    let matchedProficiency: string | undefined
    let matchScore = 0

    for (const candSkill of candidateSkills) {
      if (isSkillMatch(jobSkill.name, candSkill.name)) {
        matched = true
        matchedByName = candSkill.name
        matchedProficiency = candSkill.proficiency
        matchScore =
          PROFICIENCY_MULTIPLIER[candSkill.proficiency] ?? 0.7
        break
      }
    }

    if (matched) requiredMatched++
    details.push({
      skillId: jobSkill.id,
      skillName: jobSkill.name,
      required: true,
      matched,
      matchedByName,
      proficiency: matchedProficiency,
      score: matchScore,
    })
  }

  // Match nice
  for (const jobSkill of niceSkills) {
    let matched = false
    let matchedByName: string | undefined
    let matchedProficiency: string | undefined
    let matchScore = 0

    for (const candSkill of candidateSkills) {
      if (isSkillMatch(jobSkill.name, candSkill.name)) {
        matched = true
        matchedByName = candSkill.name
        matchedProficiency = candSkill.proficiency
        matchScore =
          PROFICIENCY_MULTIPLIER[candSkill.proficiency] ?? 0.7
        break
      }
    }

    if (matched) niceMatched++
    details.push({
      skillId: jobSkill.id,
      skillName: jobSkill.name,
      required: false,
      matched,
      matchedByName,
      proficiency: matchedProficiency,
      score: matchScore,
    })
  }

  // Score = 70% dari wajib + 30% dari nice
  const requiredScore =
    requiredSkills.length > 0 ? requiredMatched / requiredSkills.length : 1
  const niceScore =
    niceSkills.length > 0 ? niceMatched / niceSkills.length : 1

  let score: number
  if (requiredSkills.length > 0 && niceSkills.length > 0) {
    score = requiredScore * 0.7 + niceScore * 0.3
  } else if (requiredSkills.length > 0) {
    score = requiredScore
  } else if (niceSkills.length > 0) {
    score = niceScore
  } else {
    score = 0.5
  }

  return { score: Math.min(1, score), details }
}

// ============================================
// CALCULATE EXPERIENCE SCORE
// ============================================

type Experience = {
  startDate: string | null
  endDate: string | null
  isCurrent: boolean
}

function calculateExperienceScore(experiences: Experience[]): {
  score: number
  months: number
} {
  let totalMonths = 0
  const now = Date.now()

  for (const exp of experiences) {
    if (!exp.startDate) continue
    const start = new Date(exp.startDate).getTime()
    const end = exp.isCurrent
      ? now
      : exp.endDate
      ? new Date(exp.endDate).getTime()
      : now

    const months = Math.max(0, (end - start) / (30 * 24 * 60 * 60 * 1000))
    totalMonths += months
  }

  // 24 bulan = skor max
  const score = Math.min(1, totalMonths / 24)

  return { score, months: Math.round(totalMonths) }
}

// ============================================
// CALCULATE EDUCATION SCORE
// ============================================

type Education = {
  schoolName: string
  major: string | null
  degree: string | null
}

function calculateEducationScore(
  educations: Education[],
  jobProgram?: string | null
): { score: number; description: string } {
  if (educations.length === 0) {
    return { score: 0.3, description: 'Belum ada data pendidikan' }
  }

  // Kalau job punya jurusan spesifik
  if (jobProgram) {
    const normalized = normalize(jobProgram)
    for (const edu of educations) {
      if (edu.major && normalize(edu.major).includes(normalized)) {
        return {
          score: 1.0,
          description: `Jurusan sesuai: ${edu.major}`,
        }
      }
      if (
        normalize(edu.schoolName).includes(normalized) ||
        normalized.includes(normalize(edu.schoolName))
      ) {
        return {
          score: 0.9,
          description: `Sekolah sesuai: ${edu.schoolName}`,
        }
      }
    }
    return {
      score: 0.5,
      description: 'Jurusan tidak spesifik cocok',
    }
  }

  // Default: punya pendidikan
  const highest = educations[0]
  return {
    score: 0.8,
    description: `${highest.schoolName}${highest.major ? ` — ${highest.major}` : ''}`,
  }
}

// ============================================
// CALCULATE CERTIFICATIONS SCORE
// ============================================

type Certificate = {
  badgeType: string
  verificationStatus: string
}

function calculateCertificationsScore(certificates: Certificate[]): {
  score: number
  count: number
} {
  const verified = certificates.filter(
    (c) => c.verificationStatus === 'verified'
  )

  // 3 cert verified = max
  const score = Math.min(1, verified.length / 3)

  return { score, count: verified.length }
}

// ============================================
// CALCULATE LOCATION SCORE
// ============================================

function calculateLocationScore(
  candidateCity: string | null,
  candidateProvince: string | null,
  jobCity: string | null,
  jobProvince: string | null
): { score: number; description: string } {
  if (!jobCity && !jobProvince) {
    return { score: 1.0, description: 'Job tidak specify lokasi' }
  }

  if (
    candidateCity &&
    jobCity &&
    normalize(candidateCity) === normalize(jobCity)
  ) {
    return { score: 1.0, description: `Kota sama: ${candidateCity}` }
  }

  if (
    candidateProvince &&
    jobProvince &&
    normalize(candidateProvince) === normalize(jobProvince)
  ) {
    return {
      score: 0.7,
      description: `Provinsi sama: ${candidateProvince}`,
    }
  }

  return {
    score: 0.3,
    description: 'Lokasi berbeda',
  }
}

// ============================================
// MAIN — CALCULATE MATCH
// ============================================

export type MatchInput = {
  candidateSkills: CandidateSkill[]
  candidateExperiences: Experience[]
  candidateEducations: Education[]
  candidateCertificates: Certificate[]
  candidateCity: string | null
  candidateProvince: string | null

  jobSkills: JobSkill[]
  jobProgram: string | null
  jobCity: string | null
  jobProvince: string | null
}

export function calculateMatchScore(
  input: MatchInput,
  weights: MatchWeights = DEFAULT_WEIGHTS
): MatchBreakdown {
  // 1. Skills
  const skillsResult = calculateSkillsScore(
    input.candidateSkills,
    input.jobSkills
  )

  // 2. Experience
  const expResult = calculateExperienceScore(input.candidateExperiences)

  // 3. Education
  const eduResult = calculateEducationScore(
    input.candidateEducations,
    input.jobProgram
  )

  // 4. Certifications
  const certResult = calculateCertificationsScore(
    input.candidateCertificates
  )

  // 5. Location
  const locResult = calculateLocationScore(
    input.candidateCity,
    input.candidateProvince,
    input.jobCity,
    input.jobProvince
  )

  // Total score (weighted)
  const totalWeight =
    weights.skills +
    weights.experience +
    weights.education +
    weights.certifications +
    weights.location

  const totalScore =
    (skillsResult.score * weights.skills +
      expResult.score * weights.experience +
      eduResult.score * weights.education +
      certResult.score * weights.certifications +
      locResult.score * weights.location) /
    totalWeight

  return {
    totalScore: Math.round(totalScore * 100),
    skills: {
      score: Math.round(skillsResult.score * 100),
      weight: weights.skills,
      matched: skillsResult.details.filter((d) => d.matched).length,
      total: input.jobSkills.length,
      details: skillsResult.details,
    },
    experience: {
      score: Math.round(expResult.score * 100),
      weight: weights.experience,
      months: expResult.months,
      description:
        expResult.months > 0
          ? `${expResult.months} bulan pengalaman`
          : 'Belum ada pengalaman',
    },
    education: {
      score: Math.round(eduResult.score * 100),
      weight: weights.education,
      description: eduResult.description,
    },
    certifications: {
      score: Math.round(certResult.score * 100),
      weight: weights.certifications,
      count: certResult.count,
      description:
        certResult.count > 0
          ? `${certResult.count} sertifikat verified`
          : 'Belum ada sertifikat verified',
    },
    location: {
      score: Math.round(locResult.score * 100),
      weight: weights.location,
      description: locResult.description,
    },
  }
}