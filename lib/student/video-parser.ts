// lib/student/video-parser.ts

export type VideoSource = 'youtube' | 'tiktok' | 'gdrive' | 'instagram'

export type ParsedVideo = {
  source: VideoSource
  id: string
  embedUrl: string
  thumbnailUrl: string | null
  warning?: string
}

/**
 * Parse URL video dari platform yang didukung.
 * Return null kalau tidak dikenali.
 */
export function parseVideoUrl(url: string): ParsedVideo | null {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null

  // ── YouTube ─────────────────────────────────────
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) {
    const id = ytMatch[1]
    return {
      source: 'youtube',
      id,
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    }
  }

  // ── TikTok ──────────────────────────────────────
  const ttMatch = trimmed.match(
    /tiktok\.com\/(?:@[\w.-]+\/video|embed\/v2|v)\/(\d+)/
  )
  if (ttMatch) {
    const id = ttMatch[1]
    return {
      source: 'tiktok',
      id,
      embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
      thumbnailUrl: null,
      warning: 'Upload thumbnail manual untuk tampilan lebih baik.',
    }
  }

  // ── Google Drive ────────────────────────────────
  const gdMatch =
    trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/docs\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (gdMatch) {
    const id = gdMatch[1]
    return {
      source: 'gdrive',
      id,
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
      warning: 'Pastikan file Drive-nya public biar bisa diputar.',
    }
  }

  // ── Instagram Reels / Posts ─────────────────────
  const igMatch = trimmed.match(
    /instagram\.com\/(?:reel|p|reels)\/([a-zA-Z0-9_-]+)/
  )
  if (igMatch) {
    const id = igMatch[1]
    return {
      source: 'instagram',
      id,
      embedUrl: `https://www.instagram.com/reel/${id}/embed`,
      thumbnailUrl: null,
      warning:
        'Instagram kadang tidak bisa embed karena rate limit. Wajib upload thumbnail.',
    }
  }

  return null
}

/**
 * Label human-readable per source.
 */
export const VIDEO_SOURCE_LABELS: Record<string, string> = {
  upload: 'Upload File',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  gdrive: 'Google Drive',
  instagram: 'Instagram Reels',
}

/**
 * Cek apakah URL valid untuk platform yang didukung.
 */
export function isValidVideoUrl(url: string): boolean {
  return parseVideoUrl(url) !== null
}