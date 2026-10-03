// components/company/talent/talent-empty-state.tsx
'use client'

import { Users, RotateCcw } from 'lucide-react'

export function TalentEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-on-surface-variant/40" />
      </div>
      <h3 className="text-base font-bold text-on-surface mb-1">
        Tidak ada kandidat yang cocok
      </h3>
      <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-5">
        Coba ubah filter, turunkan min match score, atau reset pencarian.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container text-on-surface font-bold text-sm hover:bg-surface-container-high transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Reset Filter
      </button>
    </div>
  )
}