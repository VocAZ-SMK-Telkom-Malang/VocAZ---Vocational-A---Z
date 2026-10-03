// components/student/settings/tabs/danger-tab.tsx
'use client'

import { useState } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

export function DangerTab() {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-black text-rose-600 mb-1">
          Zona Berbahaya
        </h2>
        <p className="text-sm text-on-surface-variant">
          Aksi yang tidak bisa dibatalkan
        </p>
      </div>

      {/* Warning card */}
      <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-rose-700 mb-1">
              Hapus Akun Permanen
            </p>
            <p className="text-xs text-rose-700/80 leading-relaxed mb-4">
              Semua data kamu (profil, lamaran, portfolio, chat, sertifikat)
              akan dihapus permanen. Aksi ini tidak bisa dibatalkan.
            </p>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Akun Saya
            </button>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
            </div>

            <h3 className="text-lg font-black text-on-surface text-center mb-2">
              Yakin mau hapus akun?
            </h3>
            <p className="text-sm text-on-surface-variant text-center mb-5">
              Semua data kamu akan hilang permanen. Aksi ini tidak bisa
              dibatalkan.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Fitur hapus akun akan segera hadir. Hubungi support untuk bantuan.')
                  setConfirmOpen(false)
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}