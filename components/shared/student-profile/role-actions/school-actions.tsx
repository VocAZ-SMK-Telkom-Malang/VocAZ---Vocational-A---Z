// components/shared/student-profile/role-actions/school-actions.tsx
'use client'

import { Eye, MessageSquare, FileText } from 'lucide-react'
import type { StudentProfileDetail } from '@/lib/queries/student-profile-detail'

export function SchoolActions({ profile }: { profile: StudentProfileDetail }) {
  return (
    <div className="flex items-center gap-2">
      <a
        href={`/school/students/${profile.id}`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-container transition-colors"
      >
        <Eye className="w-4 h-4" />
        Monitor
      </a>
      <a
        href={`/school/students/${profile.id}/notes`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors"
      >
        <FileText className="w-4 h-4" />
        Notes
      </a>
    </div>
  )
}