// components/student/profile/cover-upload.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { uploadFile } from '@/lib/storage/upload-client'
import {
  updateStudentCover,
  removeStudentCover,
} from '@/lib/student/actions'

type Props = {
  studentProfileId: string
  currentCoverUrl: string | null
}

export function CoverUpload({ studentProfileId, currentCoverUrl }: Props) {
  const router = useRouter()
  const [coverUrl, setCoverUrl] = useState<string | null>(currentCoverUrl)
  const [coverKey, setCoverKey] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentCoverUrl)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return

    if (f.size > 5 * 1024 * 1024) {
      setError('Ukuran maksimal 5MB')
      return
    }

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(f.type)) {
      setError('Format harus PNG, JPG, atau WebP')
      return
    }

    setFile(f)
    setError(null)
    setSuccess(null)

    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError(null)
    setSuccess(null)

    const result = await uploadFile(file, 'cover', studentProfileId)
    setUploading(false)

    if (!result.ok) {
      setError(`Gagal upload: ${result.error}`)
      return
    }

    setCoverUrl(result.url)
    setCoverKey(result.key)

    // Save ke DB
    startTransition(async () => {
      const saveResult = await updateStudentCover(result.url, result.key)
      if (!saveResult.ok) {
        setError(saveResult.error || 'Gagal simpan cover')
        return
      }
      setSuccess('Cover berhasil diperbarui')
      setFile(null)
      router.refresh()
    })
  }

  function handleRemove() {
    if (!confirm('Hapus cover image?')) return

    startTransition(async () => {
      const result = await removeStudentCover()
      if (!result.ok) {
        setError(result.error || 'Gagal hapus')
        return
      }
      setCoverUrl(null)
      setCoverKey(null)
      setPreview(null)
      setFile(null)
      setSuccess('Cover berhasil dihapus')
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="relative aspect-video rounded-2xl overflow-hidden ring-1 ring-outline-variant/30 bg-gradient-to-br from-surface-container to-surface-container-high">
        {preview ? (
          <img
            src={preview}
            alt="Cover preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
            <ImageIcon className="w-10 h-10 mb-2" />
            <p className="text-xs font-semibold">Belum ada cover</p>
            <p className="text-[11px] text-on-surface-variant/70">
              Rasio 16:9 · PNG, JPG, atau WebP · Maks 5MB
            </p>
          </div>
        )}

        {coverUrl && !file && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            aria-label="Hapus cover"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full ring-1 ring-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer transition-colors">
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{file ? 'Ganti File' : 'Pilih File'}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
            onClick={(e) => ((e.target as HTMLInputElement).value = '')}
          />
        </label>

        {file && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-container to-[#dc2626] text-white text-sm font-semibold shadow-sm hover:brightness-105 transition-all disabled:opacity-60"
          >
            {uploading || isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? 'Mengunggah...' : isPending ? 'Menyimpan...' : 'Simpan'}</span>
          </button>
        )}

        {file && (
          <button
            type="button"
            onClick={() => {
              setFile(null)
              setPreview(coverUrl)
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface px-2 py-2 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Batal
          </button>
        )}
      </div>
    </div>
  )
}