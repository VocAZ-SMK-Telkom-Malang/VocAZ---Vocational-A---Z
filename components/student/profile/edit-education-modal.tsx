// components/student/profile/edit-education-modal.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { X, Save, Loader2, AlertCircle, GraduationCap } from 'lucide-react'
import { saveEducation } from '@/app/actions/profile'

type Education = {
  id: string
  schoolName: string
  major: string | null
  degree: string | null
  startYear: number | null
  endYear: number | null
  gpa: number | null
  description: string | null
}

type Props = {
  existing?: Education
  onClose: () => void
}

export function EditEducationModal({ existing, onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    schoolName: existing?.schoolName ?? '',
    major: existing?.major ?? '',
    degree: existing?.degree ?? '',
    startYear: existing?.startYear?.toString() ?? '',
    endYear: existing?.endYear?.toString() ?? '',
    gpa: existing?.gpa?.toString() ?? '',
    description: existing?.description ?? '',
  })

  function handleSubmit() {
    setError(null)

    if (!form.schoolName.trim()) {
      setError('Nama sekolah wajib diisi')
      return
    }

    startTransition(async () => {
      const result = await saveEducation({
        id: existing?.id,
        schoolName: form.schoolName.trim(),
        major: form.major.trim() || undefined,
        degree: form.degree.trim() || undefined,
        startYear: form.startYear ? parseInt(form.startYear) : undefined,
        endYear: form.endYear ? parseInt(form.endYear) : undefined,
        gpa: form.gpa ? parseFloat(form.gpa) : undefined,
        description: form.description.trim() || undefined,
      })

      if (result.ok) {
        router.refresh()
        onClose()
      } else {
        setError(result.error || 'Gagal menyimpan')
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => !isPending && onClose()}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/30 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h2 className="text-base font-black text-on-surface flex-1">
            {existing ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Nama Sekolah *
            </label>
            <input
              type="text"
              value={form.schoolName}
              onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
              placeholder="SMK Telkom Malang"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Jurusan
              </label>
              <input
                type="text"
                value={form.major}
                onChange={(e) => setForm({ ...form, major: e.target.value })}
                placeholder="RPL"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Jenjang
              </label>
              <input
                type="text"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="SMK / D3 / S1"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Tahun Mulai
              </label>
              <input
                type="number"
                value={form.startYear}
                onChange={(e) => setForm({ ...form, startYear: e.target.value })}
                placeholder="2023"
                min="1990"
                max="2100"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Tahun Selesai
              </label>
              <input
                type="number"
                value={form.endYear}
                onChange={(e) => setForm({ ...form, endYear: e.target.value })}
                placeholder="2026"
                min="1990"
                max="2100"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                IPK/Nilai
              </label>
              <input
                type="number"
                step="0.01"
                value={form.gpa}
                onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                placeholder="3.85"
                min="0"
                max="4"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Prestasi, kegiatan, dll..."
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-4 border-t border-outline-variant/30 shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !form.schoolName.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}