// app/company/jobs/new/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

// ============================================
// HELPER: GENERATE SLUG
// ============================================

function generateSlug(title: string, companySlug: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)

  const suffix = companySlug.slice(0, 20)
  return `${base}-${suffix}`
}

async function ensureUniqueSlug(
  baseSlug: string,
  excludeJobId?: string
): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.job.findFirst({
      where: {
        slug,
        ...(excludeJobId ? { NOT: { id: excludeJobId } } : {}),
      },
      select: { id: true },
    })

    if (!existing) return slug

    counter++
    slug = `${baseSlug}-${counter}`
    if (counter > 100) {
      throw new Error('Gagal generate slug unik')
    }
  }
}

// ============================================
// VALIDATION SCHEMA
// ============================================

const screeningQuestionSchema = z.object({
  question: z.string().min(5).max(500),
  description: z.string().max(300).optional().nullable(),
  type: z.enum(['yes_no', 'text', 'number', 'multiple_choice']),
  options: z.array(z.string()).optional().default([]),
  isRequired: z.boolean(),
  sortOrder: z.number().int().min(0),
})

const createJobSchema = z.object({
  // Step 1
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
  experienceLevel: z
    .enum(['entry', 'junior', 'mid', 'senior'])
    .nullable()
    .optional(),
  quota: z.number().int().min(1).max(1000),

  // Step 2
  location: z.string().max(150).nullable().optional(),
  city: z.string().min(1).max(100),
  province: z.string().min(1).max(100),
  isSalaryVisible: z.boolean(),
  salaryMin: z.number().int().min(0).nullable().optional(),
  salaryMax: z.number().int().min(0).nullable().optional(),

  // Step 3
  description: z.string().min(50).max(5000),
  requirements: z.string().min(20).max(3000),
  responsibilities: z.string().max(3000).nullable().optional(),
  benefits: z.string().max(3000).nullable().optional(),
  skillIds: z.array(z.string().uuid()).min(1).max(20),

  // Step 4 — Screening Questions
  questions: z.array(screeningQuestionSchema).max(10).default([]),

  // Step 5
  expiredAt: z.string().min(1),
  publishNow: z.boolean(),
})

type CreateJobInput = z.infer<typeof createJobSchema>

// ============================================
// CREATE JOB ACTION
// ============================================

export async function createJobAction(input: unknown) {
  // 1. Auth
  const session = await getServerSession()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  // 2. Check user & company
  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      ownedCompany: {
        select: {
          id: true,
          slug: true,
          verificationStatus: true,
        },
      },
    },
  })

  if (!user || user.role !== 'company') {
    return {
      success: false,
      error: 'Hanya recruiter yang bisa posting job',
    }
  }

  if (!user.ownedCompany) {
    return { success: false, error: 'Company tidak ditemukan' }
  }

  // 3. Validate input
  const parsed = createJobSchema.safeParse(input)
  if (!parsed.success) {
    console.error('[createJob] Validation error:', parsed.error.issues)
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
      details: parsed.error.flatten(),
    }
  }

  const data: CreateJobInput = parsed.data

  // 4. Validate salary range
  if (
    data.isSalaryVisible &&
    data.salaryMin &&
    data.salaryMax &&
    data.salaryMax < data.salaryMin
  ) {
    return {
      success: false,
      error: 'Gaji maksimum harus lebih besar dari minimum',
    }
  }

  // 5. Validate deadline
  const expiredDate = new Date(data.expiredAt)
  if (isNaN(expiredDate.getTime())) {
    return { success: false, error: 'Format tanggal tidak valid' }
  }
  if (expiredDate.getTime() <= Date.now()) {
    return { success: false, error: 'Batas waktu harus di masa depan' }
  }

  // 6. Verify skillIds exist
  const validSkills = await prisma.skill.findMany({
    where: { id: { in: data.skillIds } },
    select: { id: true },
  })

  if (validSkills.length !== data.skillIds.length) {
    return {
      success: false,
      error: 'Beberapa skill tidak valid atau sudah dihapus',
    }
  }

  // 7. Validate screening questions
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i]
    if (q.type === 'multiple_choice' && (!q.options || q.options.length < 2)) {
      return {
        success: false,
        error: `Pertanyaan #${i + 1} (pilihan ganda) butuh minimal 2 pilihan`,
      }
    }
  }

  // 8. Generate unique slug
  const baseSlug = generateSlug(data.title, user.ownedCompany.slug)
  const slug = await ensureUniqueSlug(baseSlug)

  // 9. Determine status & publishedAt
  const status = data.publishNow ? 'active' : 'draft'
  const publishedAt = data.publishNow ? new Date() : null

  // 10. Create job with skills + screening questions
  try {
    const job = await prisma.job.create({
      data: {
        companyId: user.ownedCompany.id,
        createdBy: user.id,

        // Basic info
        title: data.title,
        slug,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities ?? null,
        benefits: data.benefits ?? null,

        // Type & mode
        employmentType: data.employmentType,
        workMode: data.workMode,
        experienceLevel: data.experienceLevel ?? null,

        // Location
        location: data.location ?? null,
        city: data.city,
        province: data.province,

        // Salary
        salaryMin: data.salaryMin ? BigInt(data.salaryMin) : null,
        salaryMax: data.salaryMax ? BigInt(data.salaryMax) : null,
        salaryCurrency: 'IDR',
        isSalaryVisible: data.isSalaryVisible,

        // Meta
        quota: data.quota,
        status,
        publishedAt,
        expiredAt: expiredDate,

        // ✅ Skills relation
        skills: {
          create: data.skillIds.map((skillId) => ({
            skillId,
            isRequired: true,
          })),
        },

        // ✅ Screening Questions
        screeningQuestions:
          data.questions.length > 0
            ? {
                create: data.questions.map((q) => ({
                  question: q.question,
                  description: q.description ?? null,
                  type: q.type,
                  options: q.options ?? [],
                  isRequired: q.isRequired,
                  sortOrder: q.sortOrder,
                })),
              }
            : undefined,
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    })

    // 11. Revalidate relevant paths
    revalidatePath('/company/jobs')
    revalidatePath('/company/dashboard')
    revalidatePath('/lowongan')
    revalidatePath('/student/jobs')
    revalidatePath('/student/dashboard')

    console.log(
      `[createJob] Success: ${job.id}, ${data.questions.length} screening questions`
    )

    return {
      success: true,
      jobId: job.id,
      slug: job.slug,
      title: job.title,
    }
  } catch (err: any) {
    console.error('Create job error:', err?.message, err?.code)
    return {
      success: false,
      error: `Gagal menyimpan lowongan: ${err?.message ?? 'Unknown error'}`,
    }
  }
}

// ============================================
// GET SKILLS FOR FORM
// ============================================

export async function getSkillsForFormAction() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      category: true,
    },
  })

  return { all: skills }
}