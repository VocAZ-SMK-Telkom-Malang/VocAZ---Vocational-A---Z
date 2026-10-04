// lib/register/types.ts
// File biasa (BUKAN 'use server') — boleh export type & schema

import { z } from 'zod'

// ============================================
// TYPES
// ============================================

export type ActionState = {
  ok: boolean
  error?: string
  data?: Record<string, any>
}

export type UploadedDoc = {
  name: string
  url: string
  key: string
  size: number
}

// ============================================
// COMPANY
// ============================================

export type FinalizeCompanyInput = {
  // Neon Auth
  neonAuthUserId: string
  // Step 1
  email: string
  password?: string
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
  logoUrl?: string
  logoKey?: string
  // Step 3
  businessRegistrationNumber?: string
  documents?: Record<string, UploadedDoc>
  skippedDocs?: boolean
  responsibleName?: string
  responsiblePosition?: string
  responsibleEmail?: string
}

// ============================================
// STUDENT
// ============================================

export type FinalizeStudentInput = {
  // Neon Auth
  neonAuthUserId: string
  // Step 1
  email: string
  password?: string
  fullName: string
  // Step 2 — Data Diri
  nisn?: string
  schoolId?: string
  programId?: string
  enrollmentYear?: number
  graduationYear?: number
  gender?: 'male' | 'female' | 'other'
  dateOfBirth?: string // ISO string
  city?: string
  province?: string
  // Step 3 — Profil
  headline?: string
  bio?: string
  skillIds?: string[]
  isOpenToWork?: boolean
  isPublic?: boolean
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

// ---------- Account (company) ----------
export const accountSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  fullName: z.string().min(2, 'Nama minimal 2 karakter'),
  position: z.string().min(1, 'Pilih jabatan'),
})

// ---------- Account (student) ----------
export const studentAccountSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  fullName: z.string().min(2, 'Nama minimal 2 karakter'),
})

// ---------- Data Diri Student ----------
export const studentDataSchema = z.object({
  nisn: z
    .string()
    .regex(/^\d{10}$/, 'NISN harus 10 digit angka')
    .optional()
    .or(z.literal('')),
  schoolId: z.string().uuid('Sekolah tidak valid').optional().or(z.literal('')),
  programId: z.string().uuid('Program tidak valid').optional().or(z.literal('')),
  enrollmentYear: z
    .number()
    .int()
    .min(2000, 'Tahun tidak valid')
    .max(new Date().getFullYear(), 'Tahun tidak boleh di masa depan')
    .optional(),
  graduationYear: z
    .number()
    .int()
    .min(2000, 'Tahun tidak valid')
    .max(new Date().getFullYear() + 5, 'Tahun terlalu jauh')
    .optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z.string().optional().or(z.literal('')),
  city: z
    .string()
    .min(2, 'Kota minimal 2 karakter')
    .optional()
    .or(z.literal('')),
  province: z
    .string()
    .min(2, 'Provinsi minimal 2 karakter')
    .optional()
    .or(z.literal('')),
})

// ---------- Profil Student ----------
export const studentProfileSchema = z.object({
  headline: z
    .string()
    .max(120, 'Headline maksimal 120 karakter')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(300, 'Bio maksimal 300 karakter')
    .optional()
    .or(z.literal('')),
  skillIds: z
    .array(z.string().uuid())
    .min(3, 'Pilih minimal 3 skill')
    .max(15, 'Maksimal 15 skill'),
  isOpenToWork: z.boolean().default(true),
  isPublic: z.boolean().default(true),
})

// ---------- Data Perusahaan ----------
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

// ---------- Verifikasi Perusahaan ----------
export const verificationSchema = z.object({
  businessRegistrationNumber: z
    .string()
    .min(5, 'Nomor registrasi minimal 5 karakter')
    .optional()
    .or(z.literal('')),
})

// Tambahkan di lib/register/types.ts

export type FinalizeSchoolInput = {
  neonAuthUserId: string
  // Step 1
  plan: 'basic' | 'pro' | 'plus'
  planPrice: number
  // Step 2
  paymentMethod: string
  paymentReference: string
  // Step 3
  email: string
  password?: string
  fullName: string
  position?: string
  // Step 4
  schoolName: string
  npsn?: string
  level: 'smk'
  accreditation?: string
  address?: string
  city?: string
  province?: string
  bkkName?: string
  bkkContact?: string
  bkkEmail?: string
  bkkPhone?: string
}

// lib/register/types.ts
// (ganti yang lama)

export type CertInstitutionTypeId = 'lsp_bnsp' | 'industry'

export type FinalizeCertificationInput = {
  neonAuthUserId: string
  type: CertInstitutionTypeId
  email: string
  password?: string
  fullName: string
  position?: string
  institutionName: string
  licenseNumber?: string
  emailInstitution?: string
  phone?: string
  website?: string
  address?: string
  description?: string
}