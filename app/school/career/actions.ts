// app/school/career/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import { revalidatePath } from 'next/cache'

async function requireSchoolUser() {
  const ctx = await getSchoolContext()
  if (!ctx) return { error: 'Unauthorized' as const }
  return ctx
}

const STAGE_VALUES = [
  'opportunity',
  'recommended',
  'applied',
  'interview',
  'offered',
  'placed',
  'not_placed',
] as const

// ============================================
// UPSERT MONITORING
// ============================================

const upsertSchema = z.object({
  studentId: z.string().uuid(),
  jobId: z.string().uuid().nullable().optional(),
  companyId: z.string().uuid().nullable().optional(),
  stage: z.enum(STAGE_VALUES),
  notes: z.string().max(500).nullable().optional(),
})

export async function upsertCareerMonitoringAction(input: unknown) {
  const ctx = await requireSchoolUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = upsertSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const { studentId, jobId, companyId, stage, notes } = parsed.data

  const link = await prisma.schoolStudent.findFirst({
    where: { schoolId: ctx.schoolId, studentId },
    select: { id: true },
  })
  if (!link) {
    return { ok: false, error: 'Siswa bukan milik sekolah ini' }
  }

  try {
    const existing = await prisma.careerMonitoring.findFirst({
      where: {
        schoolId: ctx.schoolId,
        studentId,
        jobId: jobId ?? null,
      },
      select: { id: true },
    })

    const baseData = {
      stage,
      notes: notes ?? null,
      monitoredBy: ctx.userId,
    }

    const placementData =
      stage === 'placed' ? { placementDate: new Date() } : {}

    let monitoringId: string

    if (existing) {
      await prisma.careerMonitoring.update({
        where: { id: existing.id },
        data: { ...baseData, ...placementData },
      })
      monitoringId = existing.id
    } else {
      const created = await prisma.careerMonitoring.create({
        data: {
          schoolId: ctx.schoolId,
          studentId,
          jobId: jobId ?? null,
          companyId: companyId ?? null,
          ...baseData,
          ...placementData,
        },
      })
      monitoringId = created.id
    }

    revalidatePath('/school/career')
    revalidatePath(`/school/students/${studentId}`)
    revalidatePath('/school/dashboard')

    return { ok: true, monitoringId }
  } catch (err: any) {
    console.error('[upsertCareerMonitoring]', err?.message)
    return { ok: false, error: 'Gagal menyimpan data monitoring' }
  }
}

// ============================================
// DELETE MONITORING
// ============================================

export async function deleteCareerMonitoringAction(monitoringId: string) {
  const ctx = await requireSchoolUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  try {
    await prisma.careerMonitoring.deleteMany({
      where: { id: monitoringId, schoolId: ctx.schoolId },
    })

    revalidatePath('/school/career')
    return { ok: true }
  } catch (err: any) {
    console.error('[deleteCareerMonitoring]', err?.message)
    return { ok: false, error: 'Gagal hapus' }
  }
}

// ============================================
// GET CANDIDATE STUDENTS FOR JOB
// ============================================

export async function getCandidateStudentsForJob(jobId: string) {
  const ctx = await requireSchoolUser()
  if ('error' in ctx) return { ok: false as const, students: [], error: ctx.error }

  const students = await prisma.schoolStudent.findMany({
    where: { schoolId: ctx.schoolId, status: 'active' },
    include: {
      program: { select: { name: true } },
      student: {
        include: {
          user: { select: { fullName: true, avatarUrl: true } },
        },
      },
    },
    take: 100,
  })

  const monitored = await prisma.careerMonitoring.findMany({
    where: {
      schoolId: ctx.schoolId,
      jobId,
      studentId: { in: students.map((s) => s.student.id) },
    },
    select: { studentId: true, stage: true },
  })

  const monitoredMap = new Map(monitored.map((m) => [m.studentId, m.stage]))

  return {
    ok: true as const,
    students: students.map((s) => ({
      profileId: s.student.id,
      fullName: s.student.user.fullName ?? 'Siswa',
      avatarUrl: s.student.user.avatarUrl ?? null,
      programName: s.program?.name ?? null,
      currentStage: monitoredMap.get(s.student.id) ?? null,
    })),
  }
}