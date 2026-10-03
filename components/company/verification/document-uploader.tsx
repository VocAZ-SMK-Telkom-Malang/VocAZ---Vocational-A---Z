// components/company/verification/document-uploader.tsx
'use client'

import { useRef, useState } from 'react'
import {
  Upload,
  X,
  Loader2,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { uploadFile } from '@/lib/storage/upload-client'

type Props = {
  label: string
  description?: string
  required?: boolean
  currentUrl: string | null
  onUploaded: (url: string, key: string, name: string) => void
  onRemoved?: () => void
}

export function DocumentUploader({
  label,
  description,
  required = true,
  currentUrl,
  onUploaded,
  onRemoved,
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const allowed = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'application/pdf',
    ]

    if (!allowed.includes(file.type)) {
      setError('Format: PNG, JPG, WebP, atau PDF')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File maksimal 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const res = await uploadFile(file, 'company-doc', 'verification')

      if (!res.ok) {
        setError(res.error || 'Gagal upload')
        return
      }

      setFileName(file.name)
      onUploaded(res.url, res.key, file.name)
    } catch (err) {
      console.error(err)
      setError('Gagal upload')
    } finally {
      setUploading(false)
    }
  }

  function handleRemove() {
    setFileName(null)
    onRemoved?.()
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <label className="block text-sm font-semibold text-on-surface">
            {label} {required && <span className="text-error">*</span>}
          </label>
          {description && (
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {currentUrl ? (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-emerald-800 truncate">
              {fileName ?? 'Dokumen terupload'}
            </div>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-700 hover:underline"
            >
              Lihat dokumen →
            </a>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="w-8 h-8 rounded-lg hover:bg-emerald-100 flex items-center justify-center text-emerald-700 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full p-6 rounded-xl border-2 border-dashed border-outline-variant/60 hover:border-primary/40 hover:bg-primary/[0.02] transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-semibold text-primary">
                Uploading...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-bold text-on-surface">
                Upload {label}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                PNG, JPG, WebP, atau PDF · maks 5MB
              </span>
            </div>
          )}
        </button>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-2 text-xs text-error">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
        className="hidden"
      />
    </div>
  )
}