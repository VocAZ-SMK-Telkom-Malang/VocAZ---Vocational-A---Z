// lib/storage/actions.ts
'use server'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3, BUCKET } from './s3'

type UploadTarget =
  | 'company-logo'
  | 'company-doc'
  | 'showcase-video'
  | 'showcase-thumb'
  | 'avatar'
  | 'cover'   
  | 'portfolio'

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

    const allowedByTarget: Record<UploadTarget, string[]> = {
      'company-logo': ['image/png', 'image/jpeg', 'image/webp'],
      'company-doc': [
        'image/png',
        'image/jpeg',
        'image/webp',
        'application/pdf',
      ],
      'showcase-video': [
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/x-matroska',
      ],
      'showcase-thumb': ['image/png', 'image/jpeg', 'image/webp'],
      avatar: ['image/png', 'image/jpeg', 'image/webp'],
     cover: ['image/png', 'image/jpeg', 'image/webp'],   // ← TAMBAH INI
      portfolio: [
        'image/png',
        'image/jpeg',
        'image/webp',
        'application/pdf',
        'video/mp4',
        'video/webm',
      ],
    }

    const allowed = allowedByTarget[input.target]
    if (!allowed || !allowed.includes(input.contentType)) {
      return { ok: false, error: 'Format file tidak didukung' }
    }

    if (!/^[a-zA-Z0-9-]{8,40}$/.test(input.folderId)) {
      return { ok: false, error: 'Folder ID tidak valid' }
    }

    const ext = input.fileName.split('.').pop()?.toLowerCase() || 'bin'
    const uuid = crypto.randomUUID()
    const timestamp = Date.now()
    const key = `${input.target}/${input.folderId}/${timestamp}-${uuid}.${ext}`

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: input.contentType,
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