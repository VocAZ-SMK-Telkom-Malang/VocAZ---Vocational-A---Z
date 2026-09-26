'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth/server'

// ============================================
// VALIDATION SCHEMAS
// ============================================

export const accountSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  fullName: z.string().min(2, 'Nama minimal 2 karakter'),
  position: z.string().min(1, 'Pilih jabatan'),
})

export const companyDataSchema = z.object({
  name: z.string().min(2, 'Nama perusahaan minimal 2 karakter'),
  industry: z.string().min(1, 'Pilih industri'),
  companySize: z.enum(['s1_10', 's11_50', 's51_200', 's201_500', 's500plus']),
  foundedYear: z
    .number()
    .int()
    .min(1900, 'Tahun tidak valid')
    .max(new Date().getFullYear(), 'Tahun tidak boleh di masa depan')
    .optional(),
  website: z.string().url('URL tidak valid').optional().or(z.literal('')),
  phone: z.string().min(8, 'Nomor telepon minimal 8 digit').optional(),
  address: z.string().min(5, 'Alamat minimal 5 karakter').optional(),
  city: z.string().min(2, 'Kota minimal 2 karakter').optional(),
  province: z.string().min(2, 'Provinsi minimal 2 karakter').optional(),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
})

export const verificationSchema = z.object({
  businessRegistrationNumber: z
    .string()
    .min(5, 'Nomor registrasi minimal 5 karakter')
    .optional()
    .or(z.literal('')),
  // Nanti setelah bucket storage siap, tambah:
  // legalDocumentUrl: z.string().url().optional(),
  // businessRegistrationUrl: z.string().url().optional(),
  // supportingDocs: z.array(z.string().url()).optional(),
})

// ============================================
// TYPES
// ============================================

export type ActionState = {
  ok: boolean
  error?: string
  data?: Record<string, any>
}

// ============================================
// HELPER: Get current auth session
// ============================================

async function getAuthUser() {
  const session: any = await auth.getSession()

  if (session instanceof Error || !session?.user) {
    return null
  }

  return session.user
}

// ============================================
// STEP 1: CREATE ACCOUNT
// ============================================

export async function submitCompanyAccount(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
    position: formData.get('position') as string,
  }

  const parsed = accountSchema.safeParse(raw)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  // Simpan ke sessionStorage di client — server actions tidak simpan state antar step
  // Jadi step 1 hanya validasi, bukan buat user di DB
  // User akan dibuat di step terakhir (step 4)
  return {
    ok: true,
    data: parsed.data,
  }
}

// ============================================
// STEP 4: FINALIZE — BUAT SEMUA DATA DI DATABASE
// ============================================

type FinalizeInput = {
  // Step 1
  email: string
  password: string
  fullName: string
  position: string
  // Step 2
  companyName: string
  industry: string
  companySize: string
  foundedYear?: number
  website?: string
  phone?: string
  address?: string
  city?: string
  province?: string
  description?: string
  // Step 3
  businessRegistrationNumber?: string
}

export async function finalizeCompanyRegistration(
  input: FinalizeInput
): Promise<ActionState> {
  try {
    // 1. Cek apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existing) {
      return {
        ok: false,
        error: 'Email sudah terdaftar. Gunakan email lain atau masuk.',
      }
    }

    // 2. Buat user (role = company)
    // Catatan: password & auth user dibuat oleh Neon Auth via sign-up API di client
    // Server action ini hanya menyimpan profile
    // Untuk sekarang, kita simpan placeholder neonAuthUserId — akan diupdate setelah sign-up sukses

    const user = await prisma.user.create({
      data: {
        neonAuthUserId: `pending-${input.email}`, // akan diupdate nanti
        email: input.email,
        fullName: input.fullName,
        role: 'company',
        isActive: true,
      },
    })

    // 3. Buat company profile
    const slug = input.companyName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)

    // Cek slug unik
    const existingSlug = await prisma.company.findUnique({
      where: { slug },
    })
    const finalSlug = existingSlug ? `${slug}-${Date.now().toString(36)}` : slug

    const company = await prisma.company.create({
      data: {
        ownerUserId: user.id,
        name: input.companyName,
        slug: finalSlug,
        industry: input.industry,
        companySize: input.companySize as any,
        foundedYear: input.foundedYear,
        website: input.website || null,
        phone: input.phone || null,
        email: input.email,
        address: input.address || null,
        city: input.city || null,
        province: input.province || null,
        description: input.description || null,
        verificationStatus: 'pending',
      },
    })

    // 4. Buat company verification record
    await prisma.companyVerification.create({
      data: {
        companyId: company.id,
        status: 'pending',
        supportingDocs: input.businessRegistrationNumber
          ? { businessRegistrationNumber: input.businessRegistrationNumber }
          : undefined,
      },
    })

    // 5. Audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'company.register',
        targetType: 'company',
        targetId: company.id,
        metadata: {
          companyName: company.name,
          industry: company.industry,
        },
      },
    })

    return {
      ok: true,
      data: {
        userId: user.id,
        companyId: company.id,
        companySlug: company.slug,
      },
    }
  } catch (err) {
    console.error('Company registration error:', err)
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mendaftar',
    }
  }
}

// ============================================
// UPDATE NEON AUTH ID (dipanggil setelah sign-up sukses)
// ============================================

export async function updateUserNeonAuthId(
  email: string,
  neonAuthUserId: string
): Promise<ActionState> {
  try {
    await prisma.user.update({
      where: { email },
      data: { neonAuthUserId },
    })

    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal update user',
    }
  }
}