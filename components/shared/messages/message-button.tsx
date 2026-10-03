// components/shared/messages/message-button.tsx
'use client'

import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

type Props = {
  // Cara 1: kirim userId
  userId?: string
  // Cara 2: kirim company slug
  companySlug?: string
  // Cara 3: kirim job ID (context)
  jobId?: string
  variant?: 'primary' | 'outline' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export function MessageButton({
  userId,
  companySlug,
  jobId,
  variant = 'outline',
  size = 'md',
  label = 'Pesan',
  className = '',
}: Props) {
  // Build query string
  const params = new URLSearchParams()
  if (userId) params.set('to', userId)
  if (companySlug) params.set('company', companySlug)
  if (jobId) params.set('job', jobId)

  const href = `/student/messages${params.toString() ? `?${params.toString()}` : ''}`

  // Styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-3 text-sm gap-2',
  }

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20',
    outline: 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface-container hover:border-primary/40',
    ghost: 'text-on-surface-variant hover:bg-surface-container',
    icon: 'p-2.5 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high',
  }

  if (variant === 'icon') {
    return (
      <Link
        href={href}
        className={`inline-flex items-center justify-center transition-colors shrink-0 ${variantStyles.icon} ${className}`}
        aria-label={label}
        title={label}
      >
        <MessageSquare className="w-4 h-4" />
      </Link>
    )
  }

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center font-bold rounded-xl transition-colors shrink-0 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      <MessageSquare className={iconSize} />
      <span>{label}</span>
    </Link>
  )
}