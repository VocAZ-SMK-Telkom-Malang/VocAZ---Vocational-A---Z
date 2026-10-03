// components/company/saved/saved-empty-state.tsx
'use client'

import Link from 'next/link'
import { Bookmark, Sparkles, RotateCcw, ArrowRight } from 'lucide-react'

export function SavedEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-16 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Bookmark className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-base font-bold text-on-surface mb-1">
        Talent Pool Masih Kosong
      </h3>
      <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
        Simpan kandidat favorit dari <strong>Smart Talent Match</strong>,{' '}
        <strong>Video Showcase</strong>, atau <strong>halaman pelamar</strong>{' '}
        untuk direview nanti.
      </p>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Link
          href="/company/talent"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-md hover:brightness-110 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Cari Talent
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/company/showcase"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container text-on-surface font-bold text-sm hover:bg-surface-container-high transition-colors"
        >
          Lihat Video Showcase
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Filter
        </button>
      </div>
    </div>
  )
}