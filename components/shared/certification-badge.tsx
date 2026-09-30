// components/shared/certification-badge.tsx
import {
  Award,
  ShieldCheck,
  BadgeCheck,
  Building2,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

export type CertTier = 'lsp_bnsp' | 'industry' | 'verified'
export type BadgeSize = 'sm' | 'md' | 'lg'

type BadgeConfig = {
  label: string
  defaultIcon: LucideIcon
  bg: string
  text: string
  border: string
}

// ============================================
// CONFIG
// ============================================

const BADGE_CONFIG: Record<CertTier, BadgeConfig> = {
  lsp_bnsp: {
    label: 'LSP-BNSP Certified',
    defaultIcon: Award,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  industry: {
    label: 'Industry Certified',
    defaultIcon: BadgeCheck,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  verified: {
    label: 'Verified',
    defaultIcon: CheckCircle2,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
}

const SIZE_CONFIG: Record<
  BadgeSize,
  { text: string; icon: string; padding: string; gap: string }
> = {
  sm: {
    text: 'text-[10px]',
    icon: 'w-3 h-3',
    padding: 'px-2 py-0.5',
    gap: 'gap-1',
  },
  md: {
    text: 'text-[11px]',
    icon: 'w-3.5 h-3.5',
    padding: 'px-2.5 py-1',
    gap: 'gap-1.5',
  },
  lg: {
    text: 'text-xs',
    icon: 'w-4 h-4',
    padding: 'px-3 py-1.5',
    gap: 'gap-1.5',
  },
}

// ============================================
// COMPONENT
// ============================================

type Props = {
  tier: CertTier
  size?: BadgeSize
  label?: string
  icon?: LucideIcon
  showIcon?: boolean
  className?: string
}

export function CertificationBadge({
  tier,
  size = 'md',
  label,
  icon,
  showIcon = true,
  className = '',
}: Props) {
  const config = BADGE_CONFIG[tier]
  const sizeConfig = SIZE_CONFIG[size]
  const Icon = icon || config.defaultIcon
  const finalLabel = label || config.label

  return (
    <span
      className={`inline-flex items-center ${sizeConfig.gap} ${sizeConfig.padding} rounded-full border ${config.bg} ${config.text} ${config.border} font-mono ${sizeConfig.text} font-bold uppercase tracking-wider whitespace-nowrap ${className}`}
    >
      {showIcon && <Icon className={`${sizeConfig.icon} shrink-0`} />}
      <span>{finalLabel}</span>
    </span>
  )
}