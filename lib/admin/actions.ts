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