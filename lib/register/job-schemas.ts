// lib/register/job-schemas.ts
import { z } from 'zod'

// ============================================
// STEP 1 — BASIC INFO
// ============================================

export const step1Schema = z.object({
  title: z
    .string()
    .min(5, 'Judul minimal 5 karakter')
    .max(120, 'Judul maksimal 120 karakter'),
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
    .optional()
    .nullable(),
  quota: z.number().int().min(1).max(1000).default(1),
})

// ============================================
// STEP 2 — LOCATION & SALARY
// ============================================

export const step2Schema = z
  .object({
    location: z.string().max(150).optional().nullable(),
    city: z.string().min(1, 'Kota wajib diisi').max(100),
    province: z.string().min(1, 'Provinsi wajib diisi').max(100),
    isSalaryVisible: z.boolean().default(false),
    salaryMin: z.number().int().min(0).optional().nullable(),
    salaryMax: z.number().int().min(0).optional().nullable(),
  })
  .refine(
    (data) => {
      if (!data.salaryMin || !data.salaryMax) return true
      return data.salaryMax >= data.salaryMin
    },
    {
      message: 'Gaji maksimum harus lebih besar dari minimum',
      path: ['salaryMax'],
    }
  )

// ============================================
// STEP 3 — DETAILS & SKILLS
// ============================================

export const step3Schema = z.object({
  description: z
    .string()
    .min(50, 'Deskripsi minimal 50 karakter')
    .max(5000),
  requirements: z
    .string()
    .min(20, 'Persyaratan minimal 20 karakter')
    .max(3000),
  responsibilities: z.string().max(3000).optional().nullable(),
  benefits: z.string().max(3000).optional().nullable(),
  skillIds: z
    .array(z.string().uuid())
    .min(1, 'Pilih minimal 1 skill')
    .max(20, 'Maksimal 20 skill'),
})

// ============================================
// STEP 4 — FINAL (deadline + publish)
// ============================================

export const step4Schema = z.object({
  expiredAt: z
    .string()
    .min(1, 'Batas waktu wajib diisi')
    .refine(
      (val) => new Date(val).getTime() > Date.now(),
      'Batas waktu harus di masa depan'
    ),
  publishNow: z.boolean().default(true),
})

// ============================================
// STEP 4 — SCREENING QUESTIONS
// ============================================

export const step5Schema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(5, 'Pertanyaan minimal 5 karakter').max(500),
        description: z.string().max(300).optional(),
        type: z.enum(['yes_no', 'text', 'number', 'multiple_choice']),
        options: z.array(z.string()).optional(),
        isRequired: z.boolean(),
        sortOrder: z.number().int().min(0),
      })
    )
    .max(10, 'Maksimal 10 pertanyaan')
    .default([]),
})

// ============================================
// COMBINED (untuk validasi server-side)
// ============================================

export const fullJobSchema = z.object({
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

  // Step 4
  questions: z.array(
    z.object({
      question: z.string().min(5).max(500),
      description: z.string().max(300).optional(),
      type: z.enum(['yes_no', 'text', 'number', 'multiple_choice']),
      options: z.array(z.string()).optional(),
      isRequired: z.boolean(),
      sortOrder: z.number().int().min(0),
    })
  ).max(10).default([]),

   // Step 5 — Final
  expiredAt: z.string().min(1),
  publishNow: z.boolean(),
})

// ============================================
// TYPES
// ============================================

export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>
export type Step4Data = z.infer<typeof step4Schema>
export type FullJobData = z.infer<typeof fullJobSchema>

// ============================================
// CONSTANTS
// ============================================

export const EMPLOYMENT_OPTIONS = [
  { value: 'full_time', label: 'Full Time', desc: 'Kerja penuh waktu' },
  { value: 'part_time', label: 'Part Time', desc: 'Paruh waktu' },
  { value: 'internship', label: 'Internship', desc: 'Magang / PKL' },
  { value: 'contract', label: 'Contract', desc: 'Kontrak' },
  { value: 'freelance', label: 'Freelance', desc: 'Lepas' },
  { value: 'volunteer', label: 'Volunteer', desc: 'Relawan' },
] as const

export const WORK_MODE_OPTIONS = [
  { value: 'onsite', label: 'On-site', desc: 'Kerja di kantor' },
  { value: 'remote', label: 'Remote', desc: 'Kerja dari mana saja' },
  { value: 'hybrid', label: 'Hybrid', desc: 'Kombinasi' },
] as const

export const EXPERIENCE_OPTIONS = [
  { value: 'entry', label: 'Entry Level', desc: 'Fresh graduate / SMK' },
  { value: 'junior', label: 'Junior', desc: '< 2 tahun' },
  { value: 'mid', label: 'Mid Level', desc: '2-5 tahun' },
  { value: 'senior', label: 'Senior', desc: '> 5 tahun' },
] as const

