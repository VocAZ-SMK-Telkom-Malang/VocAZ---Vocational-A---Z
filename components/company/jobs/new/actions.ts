// app/company/jobs/new/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
  return `${base}-${companySlug.slice(0, 20)}`
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
    if (counter > 100) throw new Error('Gagal generate slug unik')
  }
}

// ============================================
// VALIDATION SCHEMA
// ============================================

const createJobSchema = z.object({
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
  expiredAt: z.string().min(1),
  publishNow: z.boolean(),
})

// ============================================
// CREATE JOB
// ============================================

export async function createJobAction(input: unknown) {
  // 1. Auth
  const session = await getServerSession()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

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
    return { success: false, error: 'Hanya recruiter yang bisa posting job' }
  }

  if (!user.ownedCompany) {
    return { success: false, error: 'Company tidak ditemukan' }
  }

  // 2. Validate input
  const parsed = createJobSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tidak valid',
      details: parsed.error.flatten(),
    }
  }

  const data = parsed.data

  // 3. Validate deadline
  const expiredDate = new Date(data.expiredAt)
  if (expiredDate.getTime() <= Date.now()) {
    return { success: false, error: 'Batas waktu harus di masa depan' }
  }

  // 4. Generate unique slug
  const baseSlug = generateSlug(data.title, user.ownedCompany.slug)
  const slug = await ensureUniqueSlug(baseSlug)

  // 5. Determine status
  const status = data.publishNow ? 'active' : 'draft'
  const publishedAt = data.publishNow ? new Date() : null

  // 6. Create job + skills
  try {
    const job = await prisma.job.create({
      data: {
        companyId: user.ownedCompany.id,
        createdBy: user.id,
        title: data.title,
        slug,
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
        salaryCurrency: 'IDR',
        isSalaryVisible: data.isSalaryVisible,
        quota: data.quota,
        status,
        publishedAt,
        expiredAt: expiredDate,
        skills: {
          create: data.skillIds.map((skillId) => ({
            skillId,
            isRequired: true,
          })),
        },
      },
      select: { id: true, slug: true },
    })

    // 7. Revalidate
    revalidatePath('/company/jobs')
    revalidatePath('/lowongan')
    revalidatePath('/student/jobs')

    return {
      success: true,
      jobId: job.id,
      slug: job.slug,
    }
  } catch (err) {
    console.error('Create job error:', err)
    return { success: false, error: 'Gagal menyimpan lowongan' }
  }
}

// ============================================
// GET SKILLS (untuk form)
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

  // Group by category
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category ?? 'Lainnya'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return {
    all: skills,
    grouped,
  }
}