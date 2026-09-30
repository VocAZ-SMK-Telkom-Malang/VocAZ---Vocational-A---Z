// lib/register/school-plans.ts
import { Zap, Award, Crown, type LucideIcon } from 'lucide-react'

// ============================================
// TYPES
// ============================================

export type SchoolPlanId = 'basic' | 'pro' | 'plus'

export type SchoolPlan = {
  id: SchoolPlanId
  name: string
  tagline: string
  price: number
  priceDisplay: string
  pricePerStudent: string
  studentQuota: number
  adminQuota: number
  popular: boolean
  icon: LucideIcon
  features: {
    label: string
    included: boolean
  }[]
  highlights: string[]
}

// ============================================
// PLANS
// ============================================

export const SCHOOL_PLANS: SchoolPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Untuk BKK sekolah kecil',
    price: 1_500_000,
    priceDisplay: 'Rp 1,5jt',
    pricePerStudent: 'Rp 7.500/siswa',
    studentQuota: 200,
    adminQuota: 1,
    popular: false,
    icon: Zap,
    highlights: ['200 siswa aktif', '1 admin BKK', 'Dashboard dasar'],
    features: [
      { label: '200 siswa aktif', included: true },
      { label: 'Alumni tidak dihitung kuota', included: true },
      { label: '1 admin BKK', included: true },
      { label: 'Dashboard BKK dasar', included: true },
      { label: 'Tracer study dasar', included: true },
      { label: 'Analytics dasar', included: true },
      { label: 'Integrasi BNSP', included: true },
      { label: 'Halaman sekolah + badge', included: true },
      { label: 'Support via email', included: true },
      { label: 'Laporan kustom', included: false },
      { label: 'Export data', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Paling populer untuk SMK',
    price: 3_000_000,
    priceDisplay: 'Rp 3jt',
    pricePerStudent: 'Rp 6.000/siswa',
    studentQuota: 500,
    adminQuota: 2,
    popular: true,
    icon: Award,
    highlights: [
      '500 siswa aktif',
      '2 admin BKK',
      'Dashboard lengkap + tracer',
    ],
    features: [
      { label: '500 siswa aktif', included: true },
      { label: 'Alumni tidak dihitung kuota', included: true },
      { label: '2 admin BKK', included: true },
      { label: 'Dashboard BKK lengkap', included: true },
      { label: 'Tracer study lengkap', included: true },
      { label: 'Analytics lanjutan', included: true },
      { label: 'Integrasi BNSP', included: true },
      { label: 'Halaman sekolah + badge', included: true },
      { label: 'Support prioritas', included: true },
      { label: 'Laporan kustom', included: false },
      { label: 'Export data', included: false },
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    tagline: 'Untuk SMK besar & multi-lokasi',
    price: 5_000_000,
    priceDisplay: 'Rp 5jt',
    pricePerStudent: 'Rp 5.000/siswa',
    studentQuota: 1000,
    adminQuota: 3,
    popular: false,
    icon: Crown,
    highlights: [
      '1.000 siswa aktif',
      '3 admin BKK',
      'Laporan kustom + export',
    ],
    features: [
      { label: '1.000 siswa aktif', included: true },
      { label: 'Alumni tidak dihitung kuota', included: true },
      { label: '3 admin BKK', included: true },
      { label: 'Dashboard BKK lengkap', included: true },
      { label: 'Tracer study lengkap', included: true },
      { label: 'Analytics lanjutan', included: true },
      { label: 'Integrasi BNSP', included: true },
      { label: 'Halaman sekolah + badge', included: true },
      { label: 'Support prioritas', included: true },
      { label: 'Laporan kustom', included: true },
      { label: 'Export data', included: true },
    ],
  },
]

// ============================================
// COMPARISON
// ============================================

export const COMPARISON_ROWS = [
  { label: 'Siswa aktif', key: 'studentQuota', format: 'number' },
  { label: 'Alumni', key: 'alumniInfo', format: 'text' },
  { label: 'Admin BKK', key: 'adminQuota', format: 'number' },
  { label: 'Dashboard BKK', key: 'dashboard', format: 'text' },
  { label: 'Tracer study', key: 'tracer', format: 'text' },
  { label: 'Analytics & laporan', key: 'analytics', format: 'text' },
  { label: 'Integrasi BNSP', key: 'bnsp', format: 'boolean' },
  { label: 'Halaman sekolah & badge', key: 'page', format: 'boolean' },
  { label: 'Dukungan', key: 'support', format: 'text' },
] as const

export const COMPARISON_DATA: Record<
  SchoolPlanId,
  Record<string, string | number | boolean>
> = {
  basic: {
    studentQuota: 200,
    alumniInfo: 'Tidak dihitung kuota',
    adminQuota: 1,
    dashboard: 'Dasar',
    tracer: 'Dasar',
    analytics: 'Dasar',
    bnsp: true,
    page: true,
    support: 'Email',
  },
  pro: {
    studentQuota: 500,
    alumniInfo: 'Tidak dihitung kuota',
    adminQuota: 2,
    dashboard: 'Lengkap',
    tracer: 'Lengkap',
    analytics: 'Lanjutan',
    bnsp: true,
    page: true,
    support: 'Prioritas',
  },
  plus: {
    studentQuota: 1000,
    alumniInfo: 'Tidak dihitung kuota',
    adminQuota: 3,
    dashboard: 'Lengkap',
    tracer: 'Lengkap',
    analytics: 'Lanjutan + Ekspor',
    bnsp: true,
    page: true,
    support: 'Prioritas',
  },
}

// ============================================
// PAYMENT METHODS
// ============================================

export const PAYMENT_METHODS = [
  {
    id: 'qris',
    name: 'QRIS',
    description: 'Scan QR dari semua e-wallet & mobile banking',
    icon: '📱',
  },
  {
    id: 'gopay',
    name: 'GoPay',
    description: 'Bayar pakai saldo GoPay',
    icon: '💚',
  },
  {
    id: 'gojek',
    name: 'Gojek',
    description: 'Bayar pakai GoPay di aplikasi Gojek',
    icon: '🟢',
  },
  {
    id: 'bca',
    name: 'BCA Virtual Account',
    description: 'Transfer via BCA Mobile / ATM / Internet Banking',
    icon: '🏦',
  },
  {
    id: 'mandiri',
    name: 'Mandiri Virtual Account',
    description: 'Transfer via Livin / ATM / Internet Banking',
    icon: '🏛️',
  },
  {
    id: 'bri',
    name: 'BRI Virtual Account',
    description: 'Transfer via BRImo / ATM',
    icon: '🔵',
  },
] as const

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id']