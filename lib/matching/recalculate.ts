// ini error semua // lib/matching/recalculate.ts
import { prisma } from '@/lib/prisma'
import { calculateMatchScore } from './score'
import { MatchWeights, DEFAULT_WEIGHTS } from './types'

// ============================================
// HITUNG & SIMPAN MATCH SCORE UNTUK 1 APPLICATION
// ============================================

export async function recalculateApplicationMatch(
  applicationId: string
): Promise<number | null> {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: { 
          skills: { include: { skill: true } },
          company: {
            select: { matchingWeights: true },
          },
        },
      },
      student: {
        include: {
          skills: { include: { skill: true } },
          experiences: true,
          educations: true,
          certificates: { select: { badgeType: true, verificationStatus: true } },
        },
      },
    },
  })

  if (!app) return null

  // Get weights
  const weights: MatchWeights = app.job.company.matchingWeights
    ? (app.job.company.matchingWeights as any)
    : DEFAULT_WEIGHTS

  // Calculate
  const breakdown = calculateMatchScore(
    {
      candidateSkills: app.student.skills.map((s) => ({
        id: s.id,
        name: s.skill.name,
        category: s.skill.category,
        proficiency: s.proficiency,
      })),
      candidateExperiences: app.student.experiences.map((e) => ({
        startDate: e.startDate?.toISOString() ?? null,
        endDate: e.endDate?.toISOString() ?? null,
        isCurrent: e.isCurrent,
      })),
      candidateEducations: app.student.educations.map((e) => ({
        schoolName: e.schoolName,
        major: e.major,
        degree: e.degree,
      })),
      candidateCertificates: app.student.certificates.map((c) => ({
        badgeType: c.badgeType,
        verificationStatus: c.verificationStatus,
      })),
      candidateCity: app.student.city,
      candidateProvince: app.student.province,

      jobSkills: app.job.skills.map((js) => ({
        id: js.skill.id,
        name: js.skill.name,
        category: js.skill.category,
        isRequired: js.isRequired,
      })),
      jobProgram: app.job.program,
      jobCity: app.job.city,
      jobProvince: app.job.province,
    },
    weights
  )

  // Save
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      matchScore: breakdown.totalScore,
      matchScoreBreakdown: breakdown as any,
      matchScoreUpdatedAt: new Date(),
    },
  })

  return breakdown.totalScore
}

// ============================================
// RECALCULATE SEMUA PELAMAR DI 1 JOB
// ============================================

export async function recalculateJobMatches(jobId: string) {
  const applications = await prisma.application.findMany({
    where: {
      jobId,
      status: { notIn: ['withdrawn', 'rejected'] },
    },
    select: { id: true },
  })

  await Promise.all(
    applications.map((a) => recalculateApplicationMatch(a.id))
  )
}