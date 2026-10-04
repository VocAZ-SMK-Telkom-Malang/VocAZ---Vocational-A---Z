// components/shared/support-widget/support-widget-wrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import { SupportWidget } from './support-widget'

const EXCLUDE_PATTERNS = [
  /^\/auth/,
  /^\/register/,
  /^\/student/,
  /^\/company/,
  /^\/school/,
  /^\/certification/,
  /^\/admin/,
  /^\/onboarding/,
]

export function SupportWidgetWrapper() {
  const pathname = usePathname()

  const isExcluded = EXCLUDE_PATTERNS.some((p) => p.test(pathname))
  if (isExcluded) return null

  return <SupportWidget />
}