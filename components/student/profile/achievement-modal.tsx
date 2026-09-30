// components/student/profile/achievement-modal.tsx
'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Plus,
  Loader2,
  Upload,
  Trash2,
  Trophy,
  AlertCircle,
} from 'lucide-react'
import { saveAchievement } from '@/app/actions/portfolio'
import { uploadFile } from '@/lib/storage/upload-client'

type Achievement = {
  id: string
  title: string
  issuer: string | null
  level: string | null
  dateAchieved: string | null
  description: string | null
  certificateUrl: string | null
  certificateKey: string | null
}

type Props = {
  existing?: Achievement
  onClose: () => void
  studentProfileId?: string
}

const LEVELS = [
  { value: 'school', label: 'Sekolah' },
  { value: 'regional', label: 'Regional' },
  { value: 'national', label: 'Nasional' },
  { value: 'international', label: 'Internasional' },
]

export function AchievementModal({ existing, onClose, studentProfileId }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)

  const [form, setForm] = useState({
    title: existing?.title ?? '',
    issuer: existing?.issuer ?? '',
    level: (existing?.level ?? 'school') as
      | 'school'
      | 'regional'
      | 'national'
      | 'international',
    dateAchieved: existing?.dateAchieved?.slice(0, 10) ?? '',
    description: existing?.description ?? '',
  })

  const [imageUrl, setImageUrl] = useState(existing?.certificateUrl ?? '')
  const [imageKey, setImageKey] = useState(existing?.certificateKey ?? '')
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    const folderId = studentProfileId ?? existing?.id ?? 'temp'
    const result = await uploadFile(file, 'company-doc', folderId)

    if (result.ok) {
      setImageUrl(result.url)
      setImageKey(result.key)
    } else {
      setError(result.error)
    }
    setIsUploading(false)
  }

  function handleSubmit() {
    setError(null)

    if (!form.title.trim()) {
      setError('Judul prestasi wajib diisi')
      return
    }

    startTransition(async () => {
      const result = await saveAchievement({
        id: existing?.id,
        title: form.title.trim(),
        issuer: form.issuer.trim() || undefined,
        level: form.level,
        dateAchieved: form.dateAchieved || undefined,
        description: form.description.trim() || undefined,
        certificateUrl: imageUrl || undefined,
        certificateKey: imageKey || undefined,
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 shrink-0">
          <h2 className="text-base font-black text-on-surface">
            {existing ? 'Edit Prestasi' : 'Tambah Prestasi'}
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
              Judul Prestasi *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Juara 1 LKS Web Design"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Penyelenggara
            </label>
            <input
              type="text"
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              placeholder="Kemendikbud / Disdik"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Tingkat
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setForm({ ...form, level: lvl.value as any })}
                  className={`p-2.5 rounded-lg border text-xs font-bold transition-colors ${
                    form.level === lvl.value
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'border-outline-variant/30 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Tanggal
            </label>
            <input
              type="date"
              value={form.dateAchieved}
              onChange={(e) => setForm({ ...form, dateAchieved: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Ceritakan prestasi ini..."
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Bukti (gambar)
            </label>

            {imageUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-surface-container aspect-video group">
                <img
                  src={imageUrl}
                  alt="Bukti"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('')
                    setImageKey('')
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full p-6 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 text-center hover:border-primary/40 transition-colors disabled:opacity-60"
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                ) : (
                  <Upload className="w-6 h-6 text-on-surface-variant mx-auto mb-2" />
                )}
                <p className="text-xs font-bold text-on-surface">
                  {isUploading ? 'Uploading...' : 'Upload Bukti'}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-1">
                  PNG, JPG, WebP — max 5MB
                </p>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-4 border-t border-outline-variant/30 shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || isUploading || !form.title.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {existing ? 'Simpan' : 'Tambah'}
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