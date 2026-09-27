// components/student/jobs/jobs-empty.tsx
import { Briefcase } from 'lucide-react'

type Props = {
  hasFilter: boolean
}

export function JobsEmpty({ hasFilter }: Props) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container mx-auto flex items-center justify-center mb-4">
        <Briefcase className="w-8 h-8 text-on-surface-variant" />
      </div>
      <h3 className="font-display text-lg font-bold text-on-surface mb-2">
        {hasFilter ? 'Tidak ada lowongan yang cocok' : 'Belum ada lowongan'}
      </h3>
      <p className="text-sm text-on-surface-variant max-w-md mx-auto">
        {hasFilter
          ? 'Coba ubah filter atau kata kunci pencarianmu.'
          : 'Lowongan akan muncul di sini setelah perusahaan mulai posting.'}
      </p>
    </div>
  )
}