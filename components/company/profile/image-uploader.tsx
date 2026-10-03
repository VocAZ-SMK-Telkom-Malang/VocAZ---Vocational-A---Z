// components/company/profile/image-uploader.tsx
'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { uploadFile } from '@/lib/storage/upload-client'

type Props = {
  type: 'logo' | 'cover'
  currentUrl: string | null
  onUploaded: (url: string, key: string) => void
  onRemoved?: () => void
}

export function ImageUploader({
  type,
  currentUrl,
  onUploaded,
  onRemoved,
}: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isLogo = type === 'logo'
  const aspect = isLogo ? 'aspect-square' : 'aspect-[16/6]'
  const maxSize = isLogo ? 2 : 5 // MB

  async function handleFile(file: File) {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File maksimal ${maxSize}MB`)
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('File harus gambar')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const res = await uploadFile(file, isLogo ? 'company-logo' : 'company-cover', 'profile')

      if (!res.ok) {
        setError(res.error || 'Gagal upload')
        return
      }

      setPreview(res.url)
      onUploaded(res.url, res.key)
    } catch (err) {
      console.error(err)
      setError('Gagal upload')
    } finally {
      setUploading(false)
    }
  }

  function handleRemove() {
    setPreview(null)
    onRemoved?.()
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-2">
        {isLogo ? 'Logo Perusahaan' : 'Cover Image'}{' '}
        {isLogo && <span className="text-error">*</span>}
      </label>

      <div
        className={`relative w-full ${aspect} rounded-2xl overflow-hidden border-2 ${
          preview
            ? 'border-outline-variant/30 bg-surface-container'
            : 'border-dashed border-outline-variant/60 bg-surface-container-low'
        } ${isLogo ? 'max-w-[200px]' : ''}`}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={isLogo ? 'Logo' : 'Cover'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 rounded-full bg-white text-on-surface text-xs font-bold hover:bg-surface-container transition-colors"
              >
                Ganti
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center hover:bg-error/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {isLogo ? (
                    <Upload className="w-5 h-5 text-primary" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-primary" />
                  )}
                </div>
                <span className="text-xs font-bold">
                  {isLogo ? 'Upload Logo' : 'Upload Cover'}
                </span>
                <span className="text-[10px]">
                  Maks {maxSize}MB · {isLogo ? 'Square 1:1' : '16:6 landscape'}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-error">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
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