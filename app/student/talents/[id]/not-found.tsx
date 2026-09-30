// app/student/talents/[id]/not-found.tsx
import Link from 'next/link'
import { UserX, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
        <UserX className="w-7 h-7 text-on-surface-variant/60" />
      </div>
      <p className="text-lg font-black text-on-surface mb-1">
        Talent tidak ditemukan
      </p>
      <p className="text-sm text-on-surface-variant mb-5">
        Mungkin sudah dihapus atau URL salah
      </p>
      <Link
        href="/student/talents"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar
      </Link>
    </div>
  )
}