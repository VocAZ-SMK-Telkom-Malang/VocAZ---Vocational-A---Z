// components/student/showcase/showcase-upload-form.tsx
'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload,
  X,
  Video as VideoIcon,
  Link2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Music,
  HardDrive,
  Info,
  Save,
} from 'lucide-react'
import {
  uploadFile,
  getOrCreateRegistrationId,
} from '@/lib/storage/upload-client'
import { saveShowcaseVideo } from '@/lib/student/actions'
import { parseVideoUrl, VIDEO_SOURCE_LABELS } from '@/lib/student/video-parser'
import { ShowcaseVideoPlayer } from './showcase-video-player'
import { FaYoutube, FaTiktok, FaGoogleDrive, FaInstagram } from 'react-icons/fa'

type ExistingVideo = {
  id: string
  title: string
  description: string | null
  videoUrl: string
  videoKey: string | null
  videoSource: string
  thumbnailUrl: string | null
  thumbnailKey: string | null
  category: string | null
  skillTags: string[]
}

type Props = {
  studentProfileId: string
  existing?: ExistingVideo
}

const CATEGORIES = [
  { value: 'software', label: 'Software & Programming' },
  { value: 'network', label: 'Jaringan & Cybersecurity' },
  { value: 'multimedia', label: 'Multimedia & Design' },
  { value: 'mechatronics', label: 'Mekatronika & Otomasi' },
  { value: 'automotive', label: 'Otomotif & EV' },
  { value: 'business', label: 'Bisnis & Akuntansi' },
  { value: 'other', label: 'Lainnya' },
]

const SOURCE_ICON: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  youtube: FaYoutube,
  tiktok: FaTiktok,
  gdrive: FaGoogleDrive,
  instagram: FaInstagram,
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ShowcaseUploadForm({ studentProfileId, existing }: Props) {
  const router = useRouter()
  const isEdit = !!existing
  const [isPending, startTransition] = useTransition()

  // Mode: 'upload' atau 'link'
  const [mode, setMode] = useState<'upload' | 'link'>(
    existing?.videoSource && existing.videoSource !== 'upload'
      ? 'link'
      : 'upload'
  )

  // ===== Video Upload =====
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState(existing?.videoUrl || '')
  const [videoKey, setVideoKey] = useState(existing?.videoKey || '')
  const [videoUploading, setVideoUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [duration, setDuration] = useState<number | null>(null)

  // ===== Link Mode =====
  const [linkInput, setLinkInput] = useState(
    existing?.videoSource && existing.videoSource !== 'upload'
      ? existing.videoUrl
      : ''
  )
  const [linkError, setLinkError] = useState<string | null>(null)

  const parsedLink = useMemo(
    () => (linkInput ? parseVideoUrl(linkInput) : null),
    [linkInput]
  )

  // ===== Thumbnail =====
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbUrl, setThumbUrl] = useState(existing?.thumbnailUrl || '')
  const [thumbKey, setThumbKey] = useState(existing?.thumbnailKey || '')
  const [thumbPreview, setThumbPreview] = useState<string | null>(
    existing?.thumbnailUrl || null
  )
  const [thumbUploading, setThumbUploading] = useState(false)

  // ===== Fields =====
  const [title, setTitle] = useState(existing?.title || '')
  const [description, setDescription] = useState(existing?.description || '')
  const [category, setCategory] = useState(existing?.category || '')
  const [skillInput, setSkillInput] = useState('')
  const [skillTags, setSkillTags] = useState<string[]>(
    existing?.skillTags || []
  )

  // ===== Status =====
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // ===== Computed =====
  const currentSource:
    | 'upload'
    | 'youtube'
    | 'tiktok'
    | 'gdrive'
    | 'instagram'
    | 'vimeo'
    | 'external' =
    mode === 'upload' ? 'upload' : parsedLink?.source || 'upload'

  const isInstagram = currentSource === 'instagram'
  const isYouTube = currentSource === 'youtube'

  // Thumbnail auto dari YouTube
  const autoThumb = parsedLink?.thumbnailUrl || null

  // ============================================
  // VIDEO UPLOAD HANDLERS
  // ============================================

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 200 * 1024 * 1024) {
      setError('Video maksimal 200MB')
      return
    }

    setVideoFile(file)
    setError(null)

    // Baca durasi video
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      setDuration(Math.round(video.duration))
      URL.revokeObjectURL(video.src)
    }
    video.src = URL.createObjectURL(file)
  }

  async function uploadVideoFile() {
    if (!videoFile) return
    setVideoUploading(true)
    setUploadProgress(30)
    setError(null)

    try {
      const result = await uploadFile(
        videoFile,
        'showcase-video',
        studentProfileId
      )

      setUploadProgress(100)

      if (!result.ok) {
        setError(`Gagal upload video: ${result.error}`)
        setVideoUploading(false)
        setUploadProgress(0)
        return
      }

      setVideoUrl(result.url)
      setVideoKey(result.key)
      setTimeout(() => {
        setVideoUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal')
      setVideoUploading(false)
      setUploadProgress(0)
    }
  }

  // ============================================
  // LINK HANDLERS
  // ============================================

  function handleLinkChange(value: string) {
    setLinkInput(value)
    setError(null)
    setLinkError(null)

    if (!value.trim()) return

    const parsed = parseVideoUrl(value)
    if (!parsed) {
      setLinkError(
        'Platform tidak didukung. Cuma YouTube, TikTok, Google Drive, & Instagram.'
      )
    }
  }

  // ============================================
  // THUMBNAIL HANDLERS
  // ============================================

  function handleThumbChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('Thumbnail maksimal 2MB')
      return
    }

    setThumbFile(file)
    setError(null)

    const reader = new FileReader()
    reader.onload = (ev) => setThumbPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function uploadThumbFile() {
    if (!thumbFile) return
    setThumbUploading(true)
    setError(null)

    const result = await uploadFile(
      thumbFile,
      'showcase-thumb',
      studentProfileId
    )
    setThumbUploading(false)

    if (!result.ok) {
      setError(`Gagal upload thumbnail: ${result.error}`)
      return
    }

    setThumbUrl(result.url)
    setThumbKey(result.key)
  }

  function useAutoThumb() {
    if (!autoThumb) return
    setThumbUrl(autoThumb)
    setThumbKey('')
    setThumbPreview(autoThumb)
  }

  function clearThumb() {
    setThumbFile(null)
    setThumbUrl('')
    setThumbKey('')
    setThumbPreview(null)
  }

  // ============================================
  // SKILL TAGS
  // ============================================

  function addSkill() {
    const val = skillInput.trim()
    if (!val) return
    if (skillTags.length >= 8) {
      setError('Maksimal 8 skill tag')
      return
    }
    if (skillTags.includes(val)) {
      setSkillInput('')
      return
    }
    setSkillTags((prev) => [...prev, val])
    setSkillInput('')
    setError(null)
  }

  function removeSkill(tag: string) {
    setSkillTags((prev) => prev.filter((t) => t !== tag))
  }

  // ============================================
  // SUBMIT
  // ============================================

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validasi
    if (title.trim().length < 2) {
      setError('Judul minimal 2 karakter')
      return
    }

    let finalVideoUrl = ''
    let finalVideoKey: string | null = null

    if (mode === 'upload') {
      if (!videoUrl || !videoKey) {
        setError('Upload video terlebih dahulu')
        return
      }
      finalVideoUrl = videoUrl
      finalVideoKey = videoKey
    } else {
      if (!linkInput.trim()) {
        setError('Paste URL video terlebih dahulu')
        return
      }
      const parsed = parseVideoUrl(linkInput)
      if (!parsed) {
        setError('Platform tidak didukung atau URL tidak valid')
        return
      }
      finalVideoUrl = linkInput.trim()
      finalVideoKey = null
    }

    // Instagram wajib thumbnail
    if (currentSource === 'instagram' && !thumbUrl) {
      setError('Instagram wajib upload thumbnail')
      return
    }

    startTransition(async () => {
      const result = await saveShowcaseVideo({
        id: existing?.id,
        title: title.trim(),
        description: description.trim() || undefined,
        videoUrl: finalVideoUrl,
        videoKey: finalVideoKey,
        videoSource: currentSource,
        thumbnailUrl: thumbUrl || undefined,
        thumbnailKey: thumbKey || undefined,
        category: category || undefined,
        skillTags,
        durationSec: duration || undefined,
        status: 'published',
      })

      if (!result.ok) {
        setError(result.error || 'Gagal menyimpan')
        return
      }

      setSuccess(
        isEdit ? 'Video berhasil diperbarui' : 'Video berhasil diupload'
      )
      setTimeout(() => {
        router.push('/student/showcase/my')
        router.refresh()
      }, 1200)
    })
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alerts */}
      {error && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* ============================================
          SECTION 1: VIDEO SOURCE
          ============================================ */}
      <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-6 space-y-5">
        <div>
          <h2 className="font-display text-base font-bold text-on-surface mb-1">
            1. Sumber Video
          </h2>
          <p className="text-xs text-on-surface-variant">
            Upload file dari HP atau paste link dari platform video.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 rounded-xl bg-surface-container-low">
          <button
            type="button"
            onClick={() => {
              setMode('upload')
              setError(null)
            }}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === 'upload'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('link')
              setError(null)
            }}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === 'link'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Paste Link</span>
          </button>
        </div>

        {/* === MODE: UPLOAD === */}
        {mode === 'upload' && (
          <div className="space-y-3">
            {!videoUrl ? (
              <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-outline-variant/50 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                {videoUploading ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <VideoIcon className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-semibold text-on-surface mb-1">
                    {videoUploading
                      ? `Mengunggah... ${uploadProgress}%`
                      : videoFile
                        ? videoFile.name
                        : 'Klik untuk pilih video'}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    MP4, WebM, MOV, MKV — Maks 200MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                  className="hidden"
                  onChange={handleVideoChange}
                  onClick={(e) => ((e.target as HTMLInputElement).value = '')}
                  disabled={videoUploading}
                />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-on-surface-variant">
                    ✅ Video siap diupload
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null)
                      setVideoUrl('')
                      setVideoKey('')
                      setDuration(null)
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                  >
                    <X className="w-3 h-3" />
                    Hapus
                  </button>
                </div>
              </div>
            )}

            {/* Upload button */}
            {videoFile && !videoUrl && !videoUploading && (
              <button
                type="button"
                onClick={uploadVideoFile}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:brightness-105 transition-all"
              >
                <Upload className="w-4 h-4" />
                Upload Video Sekarang
              </button>
            )}

            {videoUploading && (
              <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* === MODE: LINK === */}
        {mode === 'link' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Link Video
              </label>
              <input
                type="url"
                value={linkInput}
                onChange={(e) => handleLinkChange(e.target.value)}
                placeholder="https://youtube.com/watch?v=... atau https://tiktok.com/..."
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
              <p className="text-[11px] text-on-surface-variant mt-1.5">
                Support: YouTube, TikTok, Google Drive, Instagram Reels
              </p>
            </div>

            {/* Link Error */}
            {linkError && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{linkError}</span>
              </div>
            )}

            {/* Link Parsed — Preview */}
            {parsedLink && (
              <div className="space-y-3">
                {/* Detected badge */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-700">
                    {VIDEO_SOURCE_LABELS[parsedLink.source]} detected
                  </span>
                </div>

                {/* Warning */}
                {parsedLink.warning && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{parsedLink.warning}</span>
                  </div>
                )}

                {/* Embed Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <ShowcaseVideoPlayer
                    videoUrl={linkInput}
                    videoSource={parsedLink.source}
                    thumbnailUrl={thumbPreview || parsedLink.thumbnailUrl}
                    className="absolute inset-0"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================
          SECTION 2: THUMBNAIL
          ============================================ */}
      <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-6 space-y-4">
        <div>
          <h2 className="font-display text-base font-bold text-on-surface mb-1">
            2. Thumbnail
            {isInstagram ? (
              <span className="text-red-500 ml-1">*</span>
            ) : (
              <span className="text-on-surface-variant/70 ml-1 font-normal normal-case text-xs">
                (Opsional)
              </span>
            )}
          </h2>
          <p className="text-xs text-on-surface-variant">
            {isInstagram
              ? 'Instagram wajib pakai thumbnail manual.'
              : isYouTube
                ? 'YouTube thumbnail otomatis — bisa di-override kalau mau.'
                : 'Upload gambar untuk tampilan video di list.'}
          </p>
        </div>

        <div className="flex items-start gap-4">
          {/* Preview */}
          {thumbPreview ? (
            <div className="relative w-32 h-20 rounded-lg overflow-hidden ring-1 ring-outline-variant/30 shrink-0">
              <img
                src={thumbPreview}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={clearThumb}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-32 h-20 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-1">
            {!thumbUrl && !thumbPreview && (
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full ring-1 ring-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer transition-colors w-fit">
                {thumbUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>Upload Thumbnail</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleThumbChange}
                  onClick={(e) => ((e.target as HTMLInputElement).value = '')}
                  disabled={thumbUploading}
                />
              </label>
            )}

            {/* Auto thumbnail button (YouTube only) */}
            {isYouTube && autoThumb && !thumbUrl && (
              <button
                type="button"
                onClick={useAutoThumb}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full ring-1 ring-primary/30 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors w-fit"
              >
                <FaYoutube className="w-3.5 h-3.5" />
                Gunakan Thumbnail YouTube
              </button>
            )}

            {/* Upload button kalau ada file */}
            {thumbFile && !thumbUrl && !thumbUploading && (
              <button
                type="button"
                onClick={uploadThumbFile}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:brightness-105 transition-all w-fit"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Sekarang
              </button>
            )}

            {thumbUrl && (
              <p className="text-[11px] text-emerald-700 font-semibold">
                ✅ Thumbnail siap
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 3: DETAILS
          ============================================ */}
      <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-6 space-y-5">
        <h2 className="font-display text-base font-bold text-on-surface">
          3. Detail Video
        </h2>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
          >
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder="Misal: Bikin Website Portfolio dengan Next.js"
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <p className="text-[11px] text-on-surface-variant mt-1.5 text-right">
            {title.length}/120
          </p>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Ceritakan singkat tentang video ini..."
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
          />
          <p className="text-[11px] text-on-surface-variant mt-1.5 text-right">
            {description.length}/500
          </p>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
          >
            Kategori
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white"
          >
            <option value="">Pilih kategori...</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Skill Tags */}
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
            Skill Tags
            <span className="text-on-surface-variant/70 ml-1 font-normal normal-case">
              (Maks 8)
            </span>
          </label>

          {/* Tags */}
          {skillTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skillTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeSkill(tag)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill()
                }
              }}
              placeholder="Ketik skill (misal: React) lalu Enter"
              disabled={skillTags.length >= 8}
              className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={addSkill}
              disabled={!skillInput.trim() || skillTags.length >= 8}
              className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>

      {/* ============================================
          SUBMIT
          ============================================ */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="px-6 py-3 rounded-full ring-1 ring-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-40"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isPending || videoUploading || thumbUploading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Simpan Perubahan' : 'Publish Video'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}