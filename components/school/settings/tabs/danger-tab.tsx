// components/school/settings/tabs/danger-tab.tsx
'use client'

import { AlertTriangle } from 'lucide-react'

export function DangerTab({ userRole }: { userRole: string }) {
  const canDelete = userRole === 'owner'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-rose-700 mb-1">
          Zona Berbahaya
        </h2>
        <p className="text-sm text-on-surface-variant">
          Tindakan di bawah ini tidak bisa dibatalkan
        </p>
      </div>

      {!canDelete && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
          Hanya <strong>Owner</strong> yang bisa melakukan tindakan ini.
        </div>
      )}

      <div className="p-5 rounded-xl bg-rose-50 border border-rose-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-rose-900">Hapus Akun</div>
            <p className="text-xs text-rose-800 mt-1 leading-relaxed">
              Menghapus akun akan menghilangkan seluruh data sekolah, siswa,
              partner industri, dan monitoring karier secara permanen.
            </p>
            <button
              type="button"
              disabled={!canDelete}
              className="mt-4 px-4 py-2 rounded-lg bg-white border border-rose-300 text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Hapus Akun Permanen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}