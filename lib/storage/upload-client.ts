// lib/storage/upload-client.ts
'use client'

import imageCompression from 'browser-image-compression'
import { getPresignedUploadUrl } from './actions'
import { getPublicUrl } from './url'

const MAX_IMAGE_DIMENSION = 1600
const IMAGE_QUALITY = 0.82
const MAX_DOC_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 200 * 1024 * 1024

const REG_ID_KEY = 'company-register-id'

export function getOrCreateRegistrationId(): string {
  if (typeof window === 'undefined') return ''
  let id = sessionStorage.getItem(REG_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(REG_ID_KEY, id)
  }
  return id
}

export function clearRegistrationId(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(REG_ID_KEY)
}

export async function compressIfImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  if (file.size < 300 * 1024) return file

  try {
    const compressed = await imageCompression(file, {
      maxWidthOrHeight: MAX_IMAGE_DIMENSION,
      initialQuality: IMAGE_QUALITY,
      useWebWorker: true,
      fileType: file.type === 'image/png' ? 'image/jpeg' : file.type,
    })
    return compressed.size < file.size ? compressed : file
  } catch (err) {
    console.warn('Compression failed, using original:', err)
    return file
  }
}

type UploadTarget =
  | 'company-logo'   // ← TAMBAH
  | 'company-cover'     
  | 'company-doc'
  | 'showcase-video'
  | 'showcase-thumb'
  | 'avatar'
   | 'cover'  
  | 'portfolio'

export async function uploadFile(
  file: File,
  target: UploadTarget,
  folderId: string
): Promise<
  | { ok: true; url: string; key: string; size: number }
  | { ok: false; error: string }
> {
  try {
    const processed = await compressIfImage(file)

    const maxSize =
      target === 'showcase-video' ? MAX_VIDEO_SIZE : MAX_DOC_SIZE
    if (processed.size > maxSize) {
      const mb = (processed.size / 1024 / 1024).toFixed(1)
      const max = Math.floor(maxSize / 1024 / 1024)
      return {
        ok: false,
        error: `Ukuran file terlalu besar (${mb}MB). Maks ${max}MB.`,
      }
    }

    const presign = await getPresignedUploadUrl({
      target,
      folderId,
      fileName: processed.name,
      contentType: processed.type || 'application/octet-stream',
      fileSize: processed.size,
    })

    if (!presign.ok) return presign

    const res = await fetch(presign.url, {
      method: 'PUT',
      body: processed,
      headers: {
        'Content-Type': processed.type || 'application/octet-stream',
      },
    })

    if (!res.ok) {
      return {
        ok: false,
        error: `Upload gagal: ${res.status} ${res.statusText}`,
      }
    }

    return {
      ok: true,
      url: getPublicUrl(presign.key),
      key: presign.key,
      size: processed.size,
    }
  } catch (err) {
    console.error('Upload error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Upload gagal',
    }
  }
}