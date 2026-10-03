// app/company/jobs/[id]/edit/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

const updateJobSchema = z.object({
  title: z.string().min(5).max(120),
  employmentType: z.enum([
    'internship',
    'part_time',
    'full_time',
    'freelance',
    'volunteer',
    'contract',
  ]),
  workMode: z.enum(['onsite', 'remote', 'hybrid']),
  experienceLevel: z.enum(['entry', 'junior', 'mid', 'senior']).nullable().optional(),
  quota: z.number().int().min(1).max(1000),
  location: z.string().max(150).nullable().optional(),
  city: z.string().min(1).max(100),
  province: z.string().min(1).max(100),
  isSalaryVisible: z.boolean(),
  salaryMin: z.number().int().min(0).nullable().optional(),
  salaryMax: z.number().int().min(0).nullable().optional(),
  description: z.string().min(50).max(5000),
  requirements: z.string().min(20).max(3000),
  responsibilities: z.string().max(3000).nullable().optional(),
  benefits: z.string().max(3000).nullable().optional(),
  skillIds: z.array(z.string().uuid()).min(1).max(20),
})

export async function updateJobAction(jobId: string, input: unknown) {
  const session = await getServerSession()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      ownedCompany: { select: { id: true } },
    },
  })

  if (!user || user.role !== 'company' || !user.ownedCompany) {
    return { success: false, error: 'Hanya recruiter yang bisa update' }
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, companyId: true },
  })

  if (!job || job.companyId !== user.ownedCompany.id) {
    return { success: false, error: 'Tidak berhak' }
  }

  const parsed = updateJobSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid' }
  }

  const data = parsed.data

  try {
    // Update job + replace skills
    await prisma.$transaction([
      prisma.job.update({
        where: { id: jobId },
        data: {
          title: data.title,
          description: data.description,
          requirements: data.requirements,
          responsibilities: data.responsibilities ?? null,
          benefits: data.benefits ?? null,
          employmentType: data.employmentType,
          workMode: data.workMode,
          experienceLevel: data.experienceLevel ?? null,
          location: data.location ?? null,
          city: data.city,
          province: data.province,
          salaryMin: data.salaryMin ? BigInt(data.salaryMin) : null,
          salaryMax: data.salaryMax ? BigInt(data.salaryMax) : null,
          isSalaryVisible: data.isSalaryVisible,
          quota: data.quota,
        },
      }),
      prisma.jobSkill.deleteMany({ where: { jobId } }),
      prisma.jobSkill.createMany({
        data: data.skillIds.map((skillId) => ({
          jobId,
          skillId,
          isRequired: true,
        })),
      }),
    ])

    revalidatePath(`/company/jobs/${jobId}`)
    revalidatePath('/company/jobs')
    revalidatePath('/lowongan')
    revalidatePath('/student/jobs')

    return { success: true }
  } catch (err) {
    console.error('Update job error:', err)
    return { success: false, error: 'Gagal update lowongan' }
  }
}