// components/student/profile/portfolio-modal.tsx
'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Plus,
  Loader2,
  Upload,
  Image as ImageIcon,
  Trash2,
  Link2,
  AlertCircle,
} from 'lucide-react'
import { savePortfolio } from '@/app/actions/portfolio'
import { uploadFile } from '@/lib/storage/upload-client'

type MediaItem = {
  id?: string
  url: string
  key: string
  mediaType: 'image' | 'video' | 'document'
  mimeType?: string
}

type Portfolio = {
  id: string
  title: string
  description: string | null
  projectUrl: string | null
  thumbnailUrl: string | null
  thumbnailKey: string | null
  startDate: string | null
  endDate: string | null
  media: {
    id: string
    url: string
    key: string
    mediaType: string
  }[]
}

type Props = {
  existing?: Portfolio
  onClose: () => void
  studentProfileId?: string
}

export function PortfolioModal({ existing, onClose, studentProfileId }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)

  const [form, setForm] = useState({
    title: existing?.title ?? '',
    description: existing?.description ?? '',
    projectUrl: existing?.projectUrl ?? '',
    startDate: existing?.startDate?.slice(0, 10) ?? '',
    endDate: existing?.endDate?.slice(0, 10) ?? '',
  })

  const [media, setMedia] = useState<MediaItem[]>(
    existing?.media.map((m) => ({
      id: m.id,
      url: m.url,
      key: m.key,
      mediaType: m.mediaType as 'image' | 'video' | 'document',
    })) ?? []
  )

  const [error, setError] = useState<string | null>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    if (media.length + files.length > 6) {
      setError('Maksimal 6 file')
      return
    }

    setIsUploading(true)
    setError(null)

    const folderId = studentProfileId ?? existing?.id ?? 'temp'

    const uploaded: MediaItem[] = []

    for (const file of files) {
      const result = await uploadFile(file, 'portfolio', folderId)
      if (result.ok) {
        uploaded.push({
          url: result.url,
          key: result.key,
          mediaType: file.type.startsWith('image/')
            ? 'image'
            : file.type.startsWith('video/')
              ? 'video'
              : 'document',
          mimeType: file.type,
        })
      } else {
        setError(result.error)
      }
    }

    setMedia((prev) => [...prev, ...uploaded])
    setIsUploading(false)

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleRemoveMedia(idx: number) {
    setMedia((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleSubmit() {
    setError(null)

    if (!form.title.trim()) {
      setError('Judul wajib diisi')
      return
    }

    startTransition(async () => {
      const result = await savePortfolio({
        id: existing?.id,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        projectUrl: form.projectUrl.trim() || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        thumbnailUrl: media[0]?.url,
        thumbnailKey: media[0]?.key,
        media: media.map((m) => ({
          url: m.url,
          key: m.key,
          mediaType: m.mediaType,
          mimeType: m.mimeType,
        })),
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
        className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 shrink-0">
          <h2 className="text-base font-black text-on-surface">
            {existing ? 'Edit Project' : 'Tambah Project'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Judul Project *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Aplikasi Kasir Sederhana"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Jelaskan project kamu, peran kamu, teknologi yang dipakai..."
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          {/* Project URL */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Link Project (opsional)
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="url"
                value={form.projectUrl}
                onChange={(e) => setForm({ ...form, projectUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {/* Media */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Galeri Gambar ({media.length}/6)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || media.length >= 6}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary/90 disabled:opacity-60"
              >
                {isUploading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Upload className="w-3 h-3" />
                )}
                Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,application/pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {media.length === 0 ? (
              <div className="p-6 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 text-center">
                <ImageIcon className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
                <p className="text-xs text-on-surface-variant">
                  Belum ada gambar. Klik Upload.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {media.map((m, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden bg-surface-container group"
                  >
                    {m.mediaType === 'image' ? (
                      <img
                        src={m.url}
                        alt={`Media ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="absolute top-1 right-1 p-1 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary text-white text-[9px] font-bold">
                        Thumbnail
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
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