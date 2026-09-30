export type ParsedVideo = {
  source: 'youtube' | 'tiktok' | 'instagram' | 'gdrive' | 'vimeo' | 'external'
  embedUrl: string
  thumbnailUrl?: string
  warning?: string
}

export const VIDEO_SOURCE_LABELS: Record<string, string> = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram Reels',
  gdrive: 'Google Drive',
  vimeo: 'Vimeo',
  external: 'External Link',
}

export function parseVideoUrl(url: string): ParsedVideo | null {
  if (!url) return null

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) {
    return {
      source: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`,
    }
  }

  // TikTok
  const ttMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)
  if (ttMatch) {
    return {
      source: 'tiktok',
      embedUrl: `https://www.tiktok.com/embed/v2/${ttMatch[1]}`,
    }
  }

  // Instagram
  const igMatch = url.match(/instagram\.com\/(?:reel|p|tv)\/([\w-]+)/)
  if (igMatch) {
    return {
      source: 'instagram',
      embedUrl: `https://www.instagram.com/reel/${igMatch[1]}/embed`,
    }
  }

  // Google Drive
  const gdMatch = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (gdMatch) {
    return {
      source: 'gdrive',
      embedUrl: `https://drive.google.com/file/d/${gdMatch[1]}/preview`,
    }
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return {
      source: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    }
  }

  return null
}