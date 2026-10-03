// components/shared/student-profile/role-actions/public-actions.tsx
'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'

export function PublicActions() {
  return (
    <Link
      href="/auth/sign-in"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-container transition-colors"
    >
      <Lock className="w-4 h-4" />
      Login untuk Kontak
    </Link>
  )
}