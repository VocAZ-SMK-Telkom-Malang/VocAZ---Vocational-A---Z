// components/student/saved/saved-empty.tsx
'use client'

import Link from 'next/link'
import { Bookmark, Briefcase, Building2, Search } from 'lucide-react'
import type { SavedTab } from './types'

type Props = {
  variant?: 'empty' | 'no-results'
  tab: SavedTab
  onReset?: () => void
}

export function SavedEmpty({ variant = 'empty', tab, onReset }: Props) {
  if (variant === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
          <Search className="w-7 h-7 text-on-surface-variant/60" />
        </div>
        <p className="text-base font-bold text-on-surface mb-1">
          Tidak ada yang cocok
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

  const isJobs = tab === 'jobs'

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5">
        {isJobs ? (
          <Briefcase className="w-9 h-9 text-primary" />
        ) : (
          <Building2 className="w-9 h-9 text-primary" />
        )}
      </div>
      <h2 className="text-lg font-black text-on-surface mb-1.5">
        Belum Ada {isJobs ? 'Lowongan' : 'Perusahaan'} Tersimpan
      </h2>
      <p className="text-sm text-on-surface-variant mb-6 max-w-sm">
        {isJobs
          ? 'Simpan lowongan menarik dengan klik ikon 🔖 di kartu lowongan. Lamaran kamu bakal muncul di sini.'
          : 'Simpan perusahaan favorit dengan klik ikon 🔖 di kartu perusahaan.'}
      </p>
      <Link
        href={isJobs ? '/student/jobs' : '/student/companies'}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
      >
        {isJobs ? (
          <>
            <Briefcase className="w-4 h-4" />
            Cari Lowongan
          </>
        ) : (
          <>
            <Building2 className="w-4 h-4" />
            Jelajahi Perusahaan
          </>
        )}
      </Link>
    </div>
  )
}