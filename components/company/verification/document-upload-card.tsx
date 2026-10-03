// components/company/verification/document-upload-card.tsx
'use client'

import { useRef, useState } from 'react'
import {
  Upload,
  X,
  Loader2,
  FileCheck,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'
import { uploadFile } from '@/lib/storage/upload-client'

type UploadedDoc = {
  url: string
  key: string
} | null

type Props = {
  label: string
  description: string
  required?: boolean
  value: UploadedDoc
  onChange: (doc: UploadedDoc) => void
  disabled?: boolean
  accept?: string
  maxSizeMB?: number
}

export function DocumentUploadCard({
  label,
  description,
  required = false,
  value,
  onChange,
  disabled = false,
  accept = 'image/*,application/pdf',
  maxSizeMB = 5,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File maksimal ${maxSizeMB}MB`)
      return
    }

    const allowed =
      file.type.startsWith('image/') || file.type === 'application/pdf'
    if (!allowed) {
      setError('Format harus gambar atau PDF')
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
      onChange({ url: res.url, key: res.key })
    } catch (err) {
      console.error(err)
      setError('Gagal upload')
    } finally {
      setUploading(false)
    }
  }

  function handleRemove() {
    onChange(null)
    setError(null)
  }

  const fileName = value?.key?.split('/').pop() ?? ''

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-bold text-on-surface">{label}</h4>
            {required && (
              <span className="text-error text-xs font-bold">*</span>
            )}
          </div>
          <p className="text-[11px] text-on-surface-variant">{description}</p>
        </div>

        {value && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">
            <FileCheck className="w-3 h-3" />
            Uploaded
          </span>
        )}
      </div>

      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-emerald-800 truncate">
              {fileName || 'Dokumen'}
            </p>
            <p className="text-[10px] text-emerald-700 mt-0.5">
              Berhasil di-upload
            </p>
          </div>
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-700 transition-colors shrink-0"
            title="Lihat dokumen"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-error/10 flex items-center justify-center text-emerald-700 hover:text-error transition-colors shrink-0"
              title="Hapus"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full py-6 rounded-xl border-2 border-dashed border-outline-variant/60 hover:border-primary/40 bg-surface-container-low hover:bg-surface-container transition-all flex flex-col items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs text-on-surface-variant font-semibold">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-bold text-on-surface">
                Pilih File
              </span>
              <span className="text-[10px] text-on-surface-variant">
                PDF atau gambar · Maks {maxSizeMB}MB
              </span>
            </>
          )}
        </button>
      )}

      {error && (
        <div className="mt-2 flex items-start gap-1.5 text-[11px] text-error">
          <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
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