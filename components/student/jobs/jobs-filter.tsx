// components/student/jobs/jobs-empty.tsx
'use client'

import { Search } from 'lucide-react'

type Props = {
  onReset?: () => void
}

export function JobsEmpty({ onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
        <Search className="w-7 h-7 text-on-surface-variant/60" />
      </div>
      <p className="text-base font-bold text-on-surface mb-1">
        Tidak ada lowongan yang cocok
      </p>
      <p className="text-sm text-on-surface-variant mb-5">
        Coba ubah kata kunci atau filter
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Reset pencarian
        </button>
      )}
    </div>
  )
}