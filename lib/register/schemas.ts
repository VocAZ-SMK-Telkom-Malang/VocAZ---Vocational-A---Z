import { z } from 'zod'

// ============================================
// SCHEMAS
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
  description: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional(),
})

export const verificationSchema = z.object({
  businessRegistrationNumber: z
    .string()
    .min(5, 'Nomor registrasi minimal 5 karakter')
    .optional()
    .or(z.literal('')),
})

// ============================================
// TYPES
// ============================================

export type ActionState = {
  ok: boolean
  error?: string
  data?: Record<string, any>
}

export type FinalizeInput = {
  email: string
  password: string
  fullName: string
  position: string
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
  businessRegistrationNumber?: string
}