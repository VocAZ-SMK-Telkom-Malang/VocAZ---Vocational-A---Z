// components/company/jobs/jobs-empty-state.tsx
'use client'

import Link from 'next/link'
import { Briefcase, Plus, RotateCcw } from 'lucide-react'

type Props = {
  hasFilter: boolean
  onReset?: () => void
}

export function JobsEmptyState({ hasFilter, onReset }: Props) {
  if (hasFilter) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-16 px-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-on-surface-variant/40" />
        </div>
        <h3 className="text-lg font-bold text-on-surface mb-1">
          Tidak ada lowongan yang cocok
        </h3>
        <p className="text-sm text-on-surface-variant max-w-sm mb-5">
          Coba ubah filter atau kata kunci pencarian Anda.
        </p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container text-on-surface font-bold text-sm hover:bg-surface-container-high transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filter
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-16 px-6 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-primary-fixed/40 flex items-center justify-center mb-4">
        <Briefcase className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-on-surface mb-1">
        Belum ada lowongan
      </h3>
      <p className="text-sm text-on-surface-variant max-w-sm mb-5">
        Mulai posting lowongan pertama Anda untuk mendapatkan talenta SMK
        terbaik.
      </p>
      <Link
        href="/company/jobs/new"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-colors"
      >
        <Plus className="w-4 h-4" />
        Posting Lowongan Pertama
      </Link>
    </div>
  )
}