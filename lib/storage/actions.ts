// lib/storage/actions.ts
'use server'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3, BUCKET } from './s3'

type UploadTarget =
  | 'company-logo'
  | 'company-cover'
  | 'company-doc'
  | 'showcase-video'
  | 'showcase-thumb'
  | 'avatar'
  | 'cover'
  | 'portfolio'
  | 'cv'                    // ✅ TAMBAH INI
  | 'verification-doc'      // ✅ BONUS: buat sekolah/company verification

// MIME types yang dianggap PDF (browser sering beda-beda)
const PDF_MIMES = [
  'application/pdf',
  'application/x-pdf',
  'application/octet-stream', // browser kadang kirim ini buat PDF
  'application/acrobat',
  'applications/vnd.pdf',
  'text/pdf',
  'text/x-pdf',
]

const IMAGE_MIMES = ['image/png', 'image/jpeg', 'image/webp']
const VIDEO_MIMES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
]

// File extension yang di-allow per target (untuk fallback)
const ALLOWED_EXTENSIONS: Record<UploadTarget, string[]> = {
  'company-logo': ['png', 'jpg', 'jpeg', 'webp'],
  'company-cover': ['png', 'jpg', 'jpeg', 'webp'],
  'company-doc': ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
  'showcase-video': ['mp4', 'webm', 'mov', 'mkv'],
  'showcase-thumb': ['png', 'jpg', 'jpeg', 'webp'],
  avatar: ['png', 'jpg', 'jpeg', 'webp'],
  cover: ['png', 'jpg', 'jpeg', 'webp'],
  portfolio: ['png', 'jpg', 'jpeg', 'webp', 'pdf', 'mp4', 'webm'],
  cv: ['pdf'], // ✅ CV cuma PDF
  'verification-doc': ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
}

const ALLOWED_MIMES: Record<UploadTarget, string[]> = {
  'company-logo': IMAGE_MIMES,
  'company-cover': IMAGE_MIMES,
  'company-doc': [...IMAGE_MIMES, ...PDF_MIMES],
  'showcase-video': VIDEO_MIMES,
  'showcase-thumb': IMAGE_MIMES,
  avatar: IMAGE_MIMES,
  cover: IMAGE_MIMES,
  portfolio: [...IMAGE_MIMES, ...PDF_MIMES, ...VIDEO_MIMES],
  cv: PDF_MIMES, // ✅ CV terima semua variant PDF
  'verification-doc': [...IMAGE_MIMES, ...PDF_MIMES],
}

export async function getPresignedUploadUrl(input: {
  target: UploadTarget
  folderId: string
  fileName: string
  contentType: string
  fileSize: number
}): Promise<
  | { ok: true; url: string; key: string }
  | { ok: false; error: string }
> {
  try {
    const maxSize =
      input.target === 'showcase-video'
        ? 200 * 1024 * 1024
        : 5 * 1024 * 1024

    if (input.fileSize > maxSize) {
      const mb = Math.floor(maxSize / 1024 / 1024)
      return { ok: false, error: `Ukuran file maksimal ${mb}MB` }
    }

    // Cek extension dulu
    const ext = input.fileName.split('.').pop()?.toLowerCase() || ''
    const allowedExts = ALLOWED_EXTENSIONS[input.target] ?? []
    const extOk = allowedExts.length > 0 && allowedExts.includes(ext)

    // Cek MIME type
    const allowedMimes = ALLOWED_MIMES[input.target] ?? []
    const mimeOk =
      allowedMimes.length > 0 && allowedMimes.includes(input.contentType)

    // ✅ LOLOS kalau: extension valid ATAU MIME valid
    if (!extOk && !mimeOk) {
      return {
        ok: false,
        error: `Format file tidak didukung. Diizinkan: ${allowedExts.join(', ').toUpperCase()}`,
      }
    }

    if (!/^[a-zA-Z0-9-]{8,40}$/.test(input.folderId)) {
      return { ok: false, error: 'Folder ID tidak valid' }
    }

    const uuid = crypto.randomUUID()
    const timestamp = Date.now()
    const key = `${input.target}/${input.folderId}/${timestamp}-${uuid}.${ext || 'bin'}`

    // Normalize content-type kalau browser kirim octet-stream
    let finalContentType = input.contentType
    if (
      finalContentType === 'application/octet-stream' &&
      ext === 'pdf'
    ) {
      finalContentType = 'application/pdf'
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: finalContentType,
    })

    const url = await getSignedUrl(s3, command, { expiresIn: 600 })

    return { ok: true, url, key }
  } catch (err) {
    console.error('Presigned URL error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal generate URL',
    }
  }
}