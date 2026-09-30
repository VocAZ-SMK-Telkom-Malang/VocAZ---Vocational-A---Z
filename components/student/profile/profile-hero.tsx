// components/student/profile/profile-hero.tsx
'use client'

import { useState, useTransition, useRef } from 'react'
import {
  MapPin,
  Mail,
  Phone,
  Users,
  CheckCircle2,
  XCircle,
  Pencil,
  Save,
  X,
  Camera,
  Loader2,
  UserCircle2,
  ImageIcon,
} from 'lucide-react'
import { updateProfile, updateCoverImage, updateAvatar } from '@/app/actions/profile'
import { uploadFile } from '@/lib/storage/upload-client'
import { useRouter } from 'next/navigation'

type Props = {
  profile: {
    id: string
    userId: string
    fullName: string
    email: string
    phone: string | null
    headline: string | null
    bio: string | null
    city: string | null
    province: string | null
    address: string | null
    gender: string | null
    dateOfBirth: string | null
    coverImageUrl: string | null
    coverImageKey: string | null
    avatarUrl: string | null
    avatarKey: string | null
    isOpenToWork: boolean
    isPublic: boolean
    followerCount: number
    followingCount: number
  }
}

export function ProfileHero({ profile }: Props) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [coverUrl, setCoverUrl] = useState(profile.coverImageUrl)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl)

  const [form, setForm] = useState({
    headline: profile.headline ?? '',
    bio: profile.bio ?? '',
    city: profile.city ?? '',
    province: profile.province ?? '',
    address: profile.address ?? '',
    phone: profile.phone ?? '',
    gender: profile.gender ?? '',
    dateOfBirth: profile.dateOfBirth?.slice(0, 10) ?? '',
    isOpenToWork: profile.isOpenToWork,
    isPublic: profile.isPublic,
  })

  const initials = profile.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  async function handleSave() {
    setIsSaving(true)
    const result = await updateProfile(form)

    if (result.ok) {
      setIsEditing(false)
      router.refresh()
    } else {
      alert(result.error || 'Gagal menyimpan')
    }
    setIsSaving(false)
  }

async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (!file) return

  setIsUploadingCover(true)
  const result = await uploadFile(file, 'cover', profile.userId)  // ← TARGET BENAR!

  if (result.ok) {
    setCoverUrl(result.url)
    await updateCoverImage(result.url, result.key)
    router.refresh()
  } else {
    alert(result.error || 'Gagal upload cover')
  }
  setIsUploadingCover(false)
}

 async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (!file) return

  console.log('👤 [Avatar Upload] Started:', file.name, file.size)

  setIsUploadingAvatar(true)

  const result = await uploadFile(file, 'avatar', profile.userId)

  console.log('👤 [Avatar Upload] Result:', result)

  if (result.ok) {
    console.log('👤 [Avatar Upload] URL:', result.url)

    setAvatarUrl(result.url)

    const dbResult = await updateAvatar(result.url, result.key)
    console.log('👤 [Avatar Upload] DB Update:', dbResult)

    if (dbResult.ok) {
      router.refresh()
    } else {
      alert(dbResult.error || 'Gagal simpan avatar')
    }
  } else {
    console.error('❌ [Avatar Upload] Failed:', result.error)
    alert(result.error || 'Gagal upload avatar')
  }

  setIsUploadingAvatar(false)
}

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
      {/* Cover */}
      <div
        className="h-40 sm:h-52 relative group"
        style={{
          background: coverUrl
            ? `url(${coverUrl}) center/cover`
            : 'linear-gradient(135deg, #b7001125, #4059aa15)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Open to work badge */}
        {profile.isOpenToWork && (
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
            <CheckCircle2 className="w-3 h-3" />
            Open to Work
          </div>
        )}

        {/* Edit buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploadingCover}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest/90 backdrop-blur-sm text-xs font-bold text-on-surface hover:bg-surface-container-lowest shadow-sm disabled:opacity-60"
          >
            {isUploadingCover ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5" />
            )}
            Cover
          </button>
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest/90 backdrop-blur-sm text-xs font-bold text-on-surface hover:bg-surface-container-lowest shadow-sm"
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5" />
                Batal
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </>
            )}
          </button>
        </div>

        <input
          ref={coverInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleCoverUpload}
          className="hidden"
        />
      </div>

      {/* Profile content */}
      <div className="px-6 sm:px-8 pb-6 -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-primary text-white flex items-center justify-center text-3xl font-black shadow-lg ring-4 ring-surface-container-lowest overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute inset-0 rounded-3xl bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Camera className="w-6 h-6" />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2">
            <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              {profile.fullName}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {profile.headline || 'Belum ada headline'}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {profile.email}
              </span>
              {profile.city && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.city}
                  {profile.province ? `, ${profile.province}` : ''}
                </span>
              )}
              {profile.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {profile.phone}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center px-3 py-2 rounded-xl bg-surface-container">
              <p className="text-lg font-black text-on-surface leading-none">
                {profile.followerCount}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">
                Followers
              </p>
            </div>
            <div className="text-center px-3 py-2 rounded-xl bg-surface-container">
              <p className="text-lg font-black text-on-surface leading-none">
                {profile.followingCount}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">
                Following
              </p>
            </div>
          </div>
        </div>

        {/* Edit form */}
        {isEditing && (
          <div className="mt-6 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Headline">
                <input
                  type="text"
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  placeholder="Frontend Developer Enthusiast"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
                />
              </Field>

              <Field label="No. HP">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+62 812..."
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
                />
              </Field>

              <Field label="Kota">
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Jakarta"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
                />
              </Field>

              <Field label="Provinsi">
                <input
                  type="text"
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  placeholder="DKI Jakarta"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
                />
              </Field>

              <Field label="Tanggal Lahir">
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    setForm({ ...form, dateOfBirth: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
                />
              </Field>

              <Field label="Gender">
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
                >
                  <option value="">Pilih...</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                  <option value="other">Lainnya</option>
                </select>
              </Field>
            </div>

            <Field label="Alamat Lengkap">
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={2}
                placeholder="Jl. Merdeka No. 1..."
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50 resize-none"
              />
            </Field>

            <Field label="Bio">
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Ceritakan tentang diri kamu..."
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50 resize-none"
              />
            </Field>

            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isOpenToWork}
                  onChange={(e) =>
                    setForm({ ...form, isOpenToWork: e.target.checked })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-semibold">Open to Work</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) =>
                    setForm({ ...form, isPublic: e.target.checked })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-semibold">Profile Publik</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Bio (read-only) */}
        {!isEditing && profile.bio && (
          <p className="mt-5 text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}