// app/student/jobs/[slug]/not-found.tsx
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="w-20 h-20 rounded-2xl bg-surface-container mx-auto flex items-center justify-center mb-4">
        <Search className="w-10 h-10 text-on-surface-variant" />
      </div>
      <h1 className="font-display text-2xl font-extrabold text-on-surface mb-2">
        Lowongan Tidak Ditemukan
      </h1>
      <p className="text-sm text-on-surface-variant mb-6">
        Lowongan mungkin sudah ditutup atau tidak tersedia lagi.
      </p>
      <Link
        href="/student/jobs"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Lowongan</span>
      </Link>
    </div>
  )
}