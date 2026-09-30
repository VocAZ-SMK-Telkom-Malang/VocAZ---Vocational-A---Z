// lib/register/certification-data.ts
import { ShieldCheck, Building2, type LucideIcon } from 'lucide-react'

// ============================================
// TYPES
// ============================================

export type CertInstitutionTypeId = 'lsp_bnsp' | 'industry'

export type CertInstitutionType = {
  id: CertInstitutionTypeId
  name: string
  shortName: string
  tagline: string
  description: string
  icon: LucideIcon
  color: string
  iconBg: string
  iconColor: string
  benefits: string[]
  requirements: string[]
  badgeTier: 1 | 2
}

// ============================================
// DATA — 2 Pilihan
// ============================================

export const CERT_INSTITUTION_TYPES: CertInstitutionType[] = [
  {
    id: 'lsp_bnsp',
    name: 'LSP BNSP',
    shortName: 'LSP',
    tagline: 'Lembaga Sertifikasi Profesi Resmi BNSP',
    description:
      'LSP P1 SMK, LSP P2, atau LSP P3 yang terdaftar resmi di BNSP. Dapat menerbitkan sertifikasi profesi nasional dengan badge Garuda Emas.',
    icon: ShieldCheck,
    color: 'amber',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    benefits: [
      'Terbitkan sertifikasi profesi nasional',
      'Badge "LSP-BNSP Certified"',
      'Verifikasi nomor registrasi BNSP',
      'Prioritas di profil talenta',
    ],
    requirements: [
      'Nomor SK BNSP aktif',
      'Terdaftar di sistem BNSP',
      'PIC bersertifikat asesor',
    ],
    badgeTier: 1,
  },
  {
    id: 'industry',
    name: 'Industri & Pelatihan',
    shortName: 'Industri',
    tagline: 'Vendor Industri, LPK & Training Center',
    description:
      'Vendor teknologi/industri, Lembaga Pelatihan Kerja (LPK), atau training center yang mengeluarkan sertifikat industri atau pelatihan terverifikasi.',
    icon: Building2,
    color: 'blue',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    benefits: [
      'Terbitkan sertifikasi industri/pelatihan',
      'Badge "Industry Certified"',
      'Validasi nomor sertifikat internal',
      'Terhubung dengan talenta vokasi',
    ],
    requirements: [
      'Program sertifikasi/pelatihan resmi',
      'Nomor registrasi mitra atau izin LPK',
      'Website resmi lembaga',
    ],
    badgeTier: 2,
  },
]

// ============================================
// BADGE CONFIG — untuk legacy support
// ============================================
// CATATAN: Untuk badge baru, pakai <CertificationBadge> dari
// @/components/shared/certification-badge

export type CertTier = 'lsp_bnsp' | 'industry'

export type BadgeStyle = {
  label: string
  bg: string
  text: string
  border: string
}

export const CERT_BADGE_STYLES: Record<CertTier, BadgeStyle> = {
  lsp_bnsp: {
    label: 'LSP-BNSP Certified',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  industry: {
    label: 'Industry Certified',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
}