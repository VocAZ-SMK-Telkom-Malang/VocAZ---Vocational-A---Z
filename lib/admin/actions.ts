'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { z } from 'zod'

// ============================================
// HELPER: Cek admin
// ============================================

async function requireAdmin() {
  const session = await getServerSession()
  if (!session?.user) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: { id: true, role: true },
  })

  if (!user || user.role !== 'admin') {
    throw new Error('Forbidden')
  }

  return user
}

// ============================================
// SUSPEND / ACTIVATE USER
// ============================================

export async function toggleUserActive(userId: string) {
  const admin = await requireAdmin()

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, isActive: true, role: true },
  })

  if (!target) return { ok: false, error: 'User tidak ditemukan' }

  // Tidak boleh suspend diri sendiri
  if (target.id === admin.id) {
    return { ok: false, error: 'Tidak bisa suspend akun sendiri' }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !target.isActive },
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: updated.isActive ? 'user.activate' : 'user.suspend',
      targetType: 'user',
      targetId: userId,
      metadata: { role: target.role },
    },
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${userId}`)

  return {
    ok: true,
    isActive: updated.isActive,
    message: updated.isActive ? 'User diaktifkan' : 'User disuspend',
  }
}

// ============================================
// DELETE USER (soft delete)
// ============================================

const deleteSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(3),
})

export async function softDeleteUser(input: unknown) {
  const admin = await requireAdmin()
  const parsed = deleteSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  const { userId, reason } = parsed.data

  if (userId === admin.id) {
    return { ok: false, error: 'Tidak bisa hapus akun sendiri' }
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, email: true },
  })

  if (!target) return { ok: false, error: 'User tidak ditemukan' }

  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  })

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'user.delete',
      targetType: 'user',
      targetId: userId,
      metadata: { reason, email: target.email, role: target.role },
    },
  })

  revalidatePath('/admin/users')
  return { ok: true, message: 'User dihapus' }
}

// ============================================
// UPDATE USER ROLE (opsional)
// ============================================

const roleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['student', 'company', 'school', 'certification', 'admin']),
})

export async function updateUserRole(input: unknown) {
  const admin = await requireAdmin()
  const parsed = roleSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  const { userId, role } = parsed.data

  if (userId === admin.id && role !== 'admin') {
    return { ok: false, error: 'Tidak bisa ubah role sendiri' }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
  })

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'user.role_change',
      targetType: 'user',
      targetId: userId,
      metadata: { newRole: role },
    },
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${userId}`)

  return { ok: true, role: updated.role }
}

// ============================================
// COMPANY VERIFICATION ACTIONS
// ============================================

const approveSchema = z.object({
  verificationId: z.string().uuid(),
  notes: z.string().optional(),
})

export async function approveCompanyVerification(input: unknown) {
  const admin = await requireAdmin()
  const parsed = approveSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  const { verificationId, notes } = parsed.data

  const verification = await prisma.companyVerification.findUnique({
    where: { id: verificationId },
    include: { company: true },
  })

  if (!verification) {
    return { ok: false, error: 'Verifikasi tidak ditemukan' }
  }

  if (verification.status === 'approved') {
    return { ok: false, error: 'Verifikasi sudah disetujui' }
  }

  // Update verification
  await prisma.companyVerification.update({
    where: { id: verificationId },
    data: {
      status: 'approved',
      reviewedBy: admin.id,
      reviewedAt: new Date(),
      reviewNotes: notes || null,
    },
  })

  // Update company → verified
  await prisma.company.update({
    where: { id: verification.companyId },
    data: {
      verificationStatus: 'verified',
      verifiedAt: new Date(),
    },
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'company.approve',
      targetType: 'company',
      targetId: verification.companyId,
      metadata: {
        companyName: verification.company.name,
        notes,
      },
    },
  })

  revalidatePath('/admin/verifications')
  revalidatePath(`/admin/verifications/${verificationId}`)

  return {
    ok: true,
    message: 'Perusahaan berhasil diverifikasi',
  }
}

const rejectSchema = z.object({
  verificationId: z.string().uuid(),
  reason: z.string().min(5, 'Alasan minimal 5 karakter'),
})

export async function rejectCompanyVerification(input: unknown) {
  const admin = await requireAdmin()
  const parsed = rejectSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  const { verificationId, reason } = parsed.data

  const verification = await prisma.companyVerification.findUnique({
    where: { id: verificationId },
    include: { company: true },
  })

  if (!verification) {
    return { ok: false, error: 'Verifikasi tidak ditemukan' }
  }

  // Update verification
  await prisma.companyVerification.update({
    where: { id: verificationId },
    data: {
      status: 'rejected',
      reviewedBy: admin.id,
      reviewedAt: new Date(),
      reviewNotes: reason,
    },
  })

  // Update company → rejected
  await prisma.company.update({
    where: { id: verification.companyId },
    data: {
      verificationStatus: 'rejected',
    },
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'company.reject',
      targetType: 'company',
      targetId: verification.companyId,
      metadata: {
        companyName: verification.company.name,
        reason,
      },
    },
  })

  revalidatePath('/admin/verifications')
  revalidatePath(`/admin/verifications/${verificationId}`)

  return {
    ok: true,
    message: 'Verifikasi ditolak',
  }
}

// ============================================
// CONTENT MODERATION ACTIONS
// ============================================

const resolveReportSchema = z.object({
  reportId: z.string().uuid(),
  action: z.enum(['resolved', 'dismissed']),
  resolutionNote: z.string().min(3, 'Catatan minimal 3 karakter'),
  deleteContent: z.boolean().optional(),
})

export async function resolveContentReport(input: unknown) {
  const admin = await requireAdmin()
  const parsed = resolveReportSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  const { reportId, action, resolutionNote, deleteContent } = parsed.data

  const report = await prisma.contentReport.findUnique({
    where: { id: reportId },
  })

  if (!report) {
    return { ok: false, error: 'Laporan tidak ditemukan' }
  }

  try {
    // 1. Update report status
    await prisma.contentReport.update({
      where: { id: reportId },
      data: {
        status: action,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        resolutionNote,
      },
    })

    // 2. Kalau action = resolved & deleteContent = true → hapus konten
    if (action === 'resolved' && deleteContent) {
      await deleteReportedContent(report.contentType, report.contentId)
    }

    // 3. Kalau action = resolved & konten showcase video → ubah status jadi flagged
    if (action === 'resolved' && report.contentType === 'showcase_video' && !deleteContent) {
      try {
        await prisma.showcaseVideo.update({
          where: { id: report.contentId },
          data: { status: 'flagged' },
        })
      } catch {
        // ignore if not found
      }
    }

    // 4. Audit log
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: `moderation.${action}`,
        targetType: report.contentType,
        targetId: report.contentId,
        metadata: {
          reportId,
          resolutionNote,
          deleteContent: !!deleteContent,
        },
      },
    })

    revalidatePath('/admin/moderation')
    revalidatePath(`/admin/moderation/${reportId}`)

    return {
      ok: true,
      message:
        action === 'resolved'
          ? 'Laporan diselesaikan'
          : 'Laporan diabaikan',
    }
  } catch (err) {
    console.error('Moderation error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan',
    }
  }
}

// ============================================
// HELPER: Delete reported content
// ============================================

async function deleteReportedContent(contentType: string, contentId: string) {
  switch (contentType) {
    case 'showcase_video':
      await prisma.showcaseVideo.delete({ where: { id: contentId } })
      break

    case 'portfolio':
      await prisma.studentPortfolio.delete({ where: { id: contentId } })
      break

    case 'job':
      // Soft delete job
      await prisma.job.update({
        where: { id: contentId },
        data: { deletedAt: new Date() },
      })
      break

    // Profile & company — soft delete user/company
    case 'profile':
      const profile = await prisma.studentProfile.findUnique({
        where: { id: contentId },
      })
      if (profile) {
        await prisma.user.update({
          where: { id: profile.userId },
          data: { deletedAt: new Date() },
        })
      }
      break

    case 'company':
      await prisma.company.update({
        where: { id: contentId },
        data: { deletedAt: new Date() },
      })
      break

    default:
      // Kalau tidak dikenali, skip
      break
  }
}

// ============================================
// SYSTEM SETTINGS ACTIONS
// ============================================

const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
  description: z.string().optional(),
})

export async function updateSystemSetting(input: unknown) {
  const admin = await requireAdmin()
  const parsed = updateSettingSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  const { key, value, description } = parsed.data

  try {
    const existing = await prisma.systemSetting.findUnique({
      where: { key },
    })

    if (!existing) {
      return { ok: false, error: 'Setting tidak ditemukan' }
    }

    const oldValue = existing.value

    await prisma.systemSetting.update({
      where: { key },
      data: {
        value,
        description: description ?? existing.description,
        updatedBy: admin.id,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'setting.update',
        targetType: 'system_setting',
        metadata: {
          key,
          oldValue,
          newValue: value,
        },
      },
    })

    revalidatePath('/admin/settings')
    return { ok: true, message: 'Setting berhasil diupdate' }
  } catch (err) {
    console.error('Update setting error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan',
    }
  }
}

// ============================================
// CREATE SETTING
// ============================================

const createSettingSchema = z.object({
  key: z
    .string()
    .min(3, 'Key minimal 3 karakter')
    .regex(
      /^[a-z0-9._-]+$/,
      'Key hanya boleh huruf kecil, angka, titik, underscore, dash'
    ),
  value: z.any(),
  description: z.string().optional(),
})

export async function createSystemSetting(input: unknown) {
  const admin = await requireAdmin()
  const parsed = createSettingSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  const { key, value, description } = parsed.data

  try {
    const existing = await prisma.systemSetting.findUnique({
      where: { key },
    })

    if (existing) {
      return { ok: false, error: 'Setting dengan key ini sudah ada' }
    }

    await prisma.systemSetting.create({
      data: {
        key,
        value,
        description: description || null,
        updatedBy: admin.id,
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'setting.create',
        targetType: 'system_setting',
        metadata: { key, value },
      },
    })

    revalidatePath('/admin/settings')
    return { ok: true, message: 'Setting baru dibuat' }
  } catch (err) {
    console.error('Create setting error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan',
    }
  }
}

// ============================================
// DELETE SETTING
// ============================================

export async function deleteSystemSetting(key: string) {
  const admin = await requireAdmin()

  try {
    const existing = await prisma.systemSetting.findUnique({
      where: { key },
    })

    if (!existing) {
      return { ok: false, error: 'Setting tidak ditemukan' }
    }

    await prisma.systemSetting.delete({
      where: { key },
    })

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'setting.delete',
        targetType: 'system_setting',
        metadata: { key },
      },
    })

    revalidatePath('/admin/settings')
    return { ok: true, message: 'Setting dihapus' }
  } catch (err) {
    console.error('Delete setting error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan',
    }
  }
}

// ============================================
// MASTER DATA: SKILLS
// ============================================

const skillSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  category: z.string().optional(),
})

export async function createSkill(input: unknown) {
  const admin = await requireAdmin()
  const parsed = skillSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  try {
    const existing = await prisma.skill.findUnique({
      where: { name: parsed.data.name },
    })
    if (existing) return { ok: false, error: 'Skill sudah ada' }

    await prisma.skill.create({
      data: {
        name: parsed.data.name,
        category: parsed.data.category || null,
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'skill.create',
        targetType: 'skill',
        metadata: { name: parsed.data.name },
      },
    })

    revalidatePath('/admin/master-data/skills')
    return { ok: true, message: 'Skill dibuat' }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan',
    }
  }
}

export async function deleteSkill(id: string) {
  const admin = await requireAdmin()
  try {
    await prisma.skill.delete({ where: { id } })
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'skill.delete',
        targetType: 'skill',
        targetId: id,
      },
    })
    revalidatePath('/admin/master-data/skills')
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: 'Gagal hapus. Skill mungkin sedang dipakai user/lowongan.',
    }
  }
}

// ============================================
// MASTER DATA: INDUSTRIES
// ============================================

const industrySchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug hanya huruf kecil, angka, dash'),
  icon: z.string().optional(),
})

export async function createIndustry(input: unknown) {
  const admin = await requireAdmin()
  const parsed = industrySchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  try {
    const existing = await prisma.industry.findFirst({
      where: {
        OR: [{ name: parsed.data.name }, { slug: parsed.data.slug }],
      },
    })
    if (existing) return { ok: false, error: 'Industri sudah ada' }

    await prisma.industry.create({ data: parsed.data })

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'industry.create',
        targetType: 'industry',
        metadata: parsed.data,
      },
    })

    revalidatePath('/admin/master-data/industries')
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan',
    }
  }
}

export async function toggleIndustryActive(id: string) {
  await requireAdmin()
  const industry = await prisma.industry.findUnique({ where: { id } })
  if (!industry) return { ok: false, error: 'Tidak ditemukan' }

  await prisma.industry.update({
    where: { id },
    data: { isActive: !industry.isActive },
  })

  revalidatePath('/admin/master-data/industries')
  return { ok: true }
}

export async function deleteIndustry(id: string) {
  const admin = await requireAdmin()
  try {
    await prisma.industry.delete({ where: { id } })
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'industry.delete',
        targetType: 'industry',
        targetId: id,
      },
    })
    revalidatePath('/admin/master-data/industries')
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: 'Gagal hapus. Industri mungkin sedang dipakai.',
    }
  }
}

// ============================================
// MASTER DATA: PROVINCES
// ============================================

const provinceSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  code: z.string().optional(),
})

export async function createProvince(input: unknown) {
  const admin = await requireAdmin()
  const parsed = provinceSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  try {
    const existing = await prisma.province.findUnique({
      where: { name: parsed.data.name },
    })
    if (existing) return { ok: false, error: 'Provinsi sudah ada' }

    await prisma.province.create({
      data: {
        name: parsed.data.name,
        code: parsed.data.code || null,
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'province.create',
        targetType: 'province',
        metadata: parsed.data,
      },
    })

    revalidatePath('/admin/master-data/provinces')
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan',
    }
  }
}

export async function deleteProvince(id: string) {
  const admin = await requireAdmin()
  try {
    await prisma.province.delete({ where: { id } })
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'province.delete',
        targetType: 'province',
        targetId: id,
      },
    })
    revalidatePath('/admin/master-data/provinces')
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: 'Gagal hapus. Provinsi mungkin sedang dipakai.',
    }
  }
}

// ============================================
// MASTER DATA: SCHOOL PROGRAMS
// ============================================

const schoolProgramSchema = z.object({
  programs: z.array(
    z.object({
      name: z.string().min(2),
      code: z.string().min(1),
    })
  ),
})

export async function updateSchoolPrograms(input: unknown) {
  const admin = await requireAdmin()
  const parsed = schoolProgramSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  try {
    await prisma.systemSetting.upsert({
      where: { key: 'master.school_programs' },
      update: {
        value: { programs: parsed.data.programs },
        updatedBy: admin.id,
      },
      create: {
        key: 'master.school_programs',
        value: { programs: parsed.data.programs },
        description: 'Master program keahlian SMK',
        updatedBy: admin.id,
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'school_programs.update',
        targetType: 'system_setting',
        metadata: { count: parsed.data.programs.length },
      },
    })

    revalidatePath('/admin/master-data/school-programs')
    return { ok: true, message: 'Program keahlian disimpan' }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan',
    }
  }
}