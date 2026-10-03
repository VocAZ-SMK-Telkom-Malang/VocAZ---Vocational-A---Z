// app/company/jobs/[id]/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

// ============================================
// HELPER: CHECK OWNERSHIP
// ============================================

async function requireJobOwnership(jobId: string) {
  const session = await getServerSession()
  if (!session?.user?.id) return { error: 'Unauthorized' as const }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      ownedCompany: { select: { id: true, slug: true } },
    },
  })

  if (!user || user.role !== 'company') {
    return { error: 'Hanya recruiter yang bisa mengelola job' as const }
  }

  if (!user.ownedCompany) {
    return { error: 'Company tidak ditemukan' as const }
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, companyId: true, status: true },
  })

  if (!job) return { error: 'Lowongan tidak ditemukan' as const }

  if (job.companyId !== user.ownedCompany.id) {
    return { error: 'Anda tidak berhak mengelola lowongan ini' as const }
  }

  return { job, company: user.ownedCompany, userId: user.id }
}

// ============================================
// PUBLISH (draft → active)
// ============================================

export async function publishJobAction(jobId: string) {
  const ctx = await requireJobOwnership(jobId)
  if ('error' in ctx) return { success: false, error: ctx.error }

  if (ctx.job.status === 'active') {
    return { success: false, error: 'Lowongan sudah aktif' }
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: 'active',
      publishedAt: new Date(),
    },
  })

  revalidatePath(`/company/jobs/${jobId}`)
  revalidatePath('/company/jobs')
  revalidatePath('/lowongan')
  revalidatePath('/student/jobs')

  return { success: true }
}

// ============================================
// CLOSE (active → closed)
// ============================================

export async function closeJobAction(jobId: string) {
  const ctx = await requireJobOwnership(jobId)
  if ('error' in ctx) return { success: false, error: ctx.error }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'closed' },
  })

  revalidatePath(`/company/jobs/${jobId}`)
  revalidatePath('/company/jobs')
  revalidatePath('/lowongan')

  return { success: true }
}

// ============================================
// REOPEN (closed → active)
// ============================================

export async function reopenJobAction(jobId: string) {
  const ctx = await requireJobOwnership(jobId)
  if ('error' in ctx) return { success: false, error: ctx.error }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: 'active',
      publishedAt: new Date(),
    },
  })

  revalidatePath(`/company/jobs/${jobId}`)
  revalidatePath('/company/jobs')

  return { success: true }
}

// ============================================
// ARCHIVE (closed/active → archived)
// ============================================

export async function archiveJobAction(jobId: string) {
  const ctx = await requireJobOwnership(jobId)
  if ('error' in ctx) return { success: false, error: ctx.error }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'archived' },
  })

  revalidatePath(`/company/jobs/${jobId}`)
  revalidatePath('/company/jobs')

  return { success: true }
}

// ============================================
// DUPLICATE
// ============================================

export async function duplicateJobAction(jobId: string) {
  const ctx = await requireJobOwnership(jobId)
  if ('error' in ctx) return { success: false, error: ctx.error }

  const original = await prisma.job.findUnique({
    where: { id: jobId },
    include: { skills: true },
  })

  if (!original) return { success: false, error: 'Job tidak ditemukan' }

  // Generate unique slug
  const baseSlug = `${original.slug}-copy`
  let newSlug = baseSlug
  let counter = 1
  while (await prisma.job.findFirst({ where: { slug: newSlug } })) {
    counter++
    newSlug = `${baseSlug}-${counter}`
    if (counter > 100) {
      return { success: false, error: 'Gagal generate slug unik' }
    }
  }

  const newJob = await prisma.job.create({
    data: {
      companyId: original.companyId,
      createdBy: ctx.userId,
      title: `${original.title} (Copy)`,
      slug: newSlug,
      description: original.description,
      requirements: original.requirements,
      responsibilities: original.responsibilities,
      benefits: original.benefits,
      employmentType: original.employmentType,
      workMode: original.workMode,
      experienceLevel: original.experienceLevel,
      location: original.location,
      city: original.city,
      province: original.province,
      salaryMin: original.salaryMin,
      salaryMax: original.salaryMax,
      salaryCurrency: original.salaryCurrency,
      isSalaryVisible: original.isSalaryVisible,
      quota: original.quota,
      status: 'draft',
      expiredAt: original.expiredAt,
      skills: {
        create: original.skills.map((s) => ({
          skillId: s.skillId,
          isRequired: s.isRequired,
        })),
      },
    },
    select: { id: true },
  })

  revalidatePath('/company/jobs')
  return { success: true, newJobId: newJob.id }
}

// ============================================
// SOFT DELETE
// ============================================

export async function deleteJobAction(jobId: string) {
  const ctx = await requireJobOwnership(jobId)
  if ('error' in ctx) return { success: false, error: ctx.error }

  // Soft delete
  await prisma.job.update({
    where: { id: jobId },
    data: { deletedAt: new Date() },
  })

  revalidatePath('/company/jobs')
  revalidatePath('/lowongan')

  return { success: true }
}

// ============================================
// RESTORE (undo delete)
// ============================================

export async function restoreJobAction(jobId: string) {
  const ctx = await requireJobOwnership(jobId)
  if ('error' in ctx) return { success: false, error: ctx.error }

  await prisma.job.update({
    where: { id: jobId },
    data: { deletedAt: null },
  })

  revalidatePath('/company/jobs')

  return { success: true }
}

// ============================================
// UPDATE APPLICATION STATUS
// ============================================

const ALLOWED_STATUSES = [
  'submitted',
  'reviewed',
  'shortlisted',
  'interview',
  'offered',
  'hired',
  'rejected',
  'withdrawn',
] as const

export async function updateApplicationStatusAction(
  applicationId: string,
  newStatus: string,
  note?: string
) {
  const session = await getServerSession()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  if (!ALLOWED_STATUSES.includes(newStatus as any)) {
    return { success: false, error: 'Status tidak valid' }
  }

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

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: { select: { companyId: true } } },
  })

  if (!app) return { success: false, error: 'Application tidak ditemukan' }

  if (app.job.companyId !== user.ownedCompany.id) {
    return { success: false, error: 'Tidak berhak' }
  }

  await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: {
        status: newStatus as any,
        reviewedAt: new Date(),
      },
    }),
    prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        status: newStatus,
        notes: note ?? null,
        changedBy: user.id,
      },
    }),
  ])

  revalidatePath(`/company/jobs/${app.jobId}`)
  revalidatePath(`/company/pipeline`)

  return { success: true }
}