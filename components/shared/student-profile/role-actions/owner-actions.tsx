// components/shared/student-profile/role-actions/owner-actions.tsx
'use client'

import Link from 'next/link'
import { Edit, Eye } from 'lucide-react'
import type { StudentProfileDetail } from '@/lib/queries/student-profile-detail'

type Props = {
  profile: StudentProfileDetail
  onEdit: () => void
}

export function OwnerActions({ onEdit }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-container transition-colors"
      >
        <Edit className="w-4 h-4" />
        Edit Profil
      </button>
      <Link
        href="/company/talent/preview"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors"
      >
        <Eye className="w-4 h-4" />
        Preview
      </Link>
    </div>
  )
}