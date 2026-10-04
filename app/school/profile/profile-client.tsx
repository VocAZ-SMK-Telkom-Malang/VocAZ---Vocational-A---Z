// app/school/profile/profile-client.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  School as SchoolIcon,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Loader2,
  Key,
  Edit3,
  Save,
  X,
} from 'lucide-react'
import type { SchoolProfileData } from '@/lib/queries/school-profile'
import {
  updateSchoolProfileAction,
  regenerateTokenAction,
  toggleTokenActiveAction,
} from './actions'

type Props = {
  profile: SchoolProfileData
  userRole: 'owner' | 'admin' | 'member'
}

type EditForm = {
  name: string
  npsn: string
  level: string
  accreditation: string
  email: string
  phone: string
  website: string
  address: string
  city: string
  province: string
  logoUrl: string
  description: string
  bkkName: string
  bkkContact: string
  bkkEmail: string
  bkkPhone: string
}

export function SchoolProfileClient({ profile, userRole }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<EditForm>({
    name: profile.name,
    npsn: profile.npsn ?? '',
    level: profile.level ?? '',
    accreditation: profile.accreditation ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    website: profile.website ?? '',
    address: profile.address ?? '',
    city: profile.city ?? '',
    province: profile.province ?? '',
    logoUrl: profile.logoUrl ?? '',
    description: profile.description ?? '',
    bkkName: profile.bkkName ?? '',
    bkkContact: profile.bkkContact ?? '',
    bkkEmail: profile.bkkEmail ?? '',
    bkkPhone: profile.bkkPhone ?? '',
  })

  const canEdit = userRole === 'owner' || userRole === 'admin'

  function update<K extends keyof EditForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  function cancelEdit() {
    setEditing(false)
    setError(null)
    setForm({
      name: profile.name,
      npsn: profile.npsn ?? '',
      level: profile.level ?? '',
      accreditation: profile.accreditation ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      website: profile.website ?? '',
      address: profile.address ?? '',
      city: profile.city ?? '',
      province: profile.province ?? '',
      logoUrl: profile.logoUrl ?? '',
      description: profile.description ?? '',
      bkkName: profile.bkkName ?? '',
      bkkContact: profile.bkkContact ?? '',
      bkkEmail: profile.bkkEmail ?? '',
      bkkPhone: profile.bkkPhone ?? '',
    })
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await updateSchoolProfileAction({
        name: form.name,
        npsn: form.npsn || null,
        level: form.level || null,
        accreditation: form.accreditation || null,
        email: form.email || null,
        phone: form.phone || null,
        website: form.website || null,
        address: form.address || null,
        city: form.city || null,
        province: form.province || null,
        logoUrl: form.logoUrl || null,
        description: form.description || null,
        bkkName: form.bkkName || null,
        bkkContact: form.bkkContact || null,
        bkkEmail: form.bkkEmail || null,
        bkkPhone: form.bkkPhone || null,
      })

      if (!res.ok) {
        setError(res.error ?? 'Gagal menyimpan')
        return
      }
      setEditing(false)
      startTransition(() => router.refresh())
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8">
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-5 flex-wrap">
          {profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={profile.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-2 ring-white shadow-lg shrink-0"
            />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-2xl md:text-3xl font-black">
                {initials}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {profile.isVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  Verified School
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Belum Verified
                </span>
              )}
              {profile.subscriptionStatus && (
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px] font-bold uppercase tracking-wider">
                  {profile.subscriptionPlan ?? 'Free'} · {profile.subscriptionStatus}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
              {profile.name}
            </h1>

            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {profile.level && (
                <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <SchoolIcon className="w-3.5 h-3.5" />
                  {profile.level.toUpperCase()}
                </span>
              )}
              {profile.city && (
                <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.city}
                  {profile.province && `, ${profile.province}`}
                </span>
              )}
              {profile.npsn && (
                <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
                  NPSN: {profile.npsn}
                </span>
              )}
            </div>
          </div>

          {canEdit && !editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profil
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={GraduationCap}
          label="Total Siswa"
          value={profile.stats.totalStudents}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          icon={Users}
          label="Aktif"
          value={profile.stats.activeStudents}
          color="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={GraduationCap}
          label="Alumni"
          value={profile.stats.alumniStudents}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon={Briefcase}
          label="Partner Industri"
          value={profile.stats.totalPartners}
          color="bg-amber-100 text-amber-700"
        />
      </div>

      {/* Enrollment Token Card — fitur penting */}
      <EnrollmentTokenCard
        token={profile.enrollmentToken}
        tokenActive={profile.tokenActive}
        canEdit={canEdit}
      />

      {/* Edit / View Mode */}
      {editing ? (
        <EditMode
          form={form}
          update={update}
          onSave={handleSave}
          onCancel={cancelEdit}
          saving={saving}
          error={error}
        />
      ) : (
        <ViewMode profile={profile} />
      )}
    </div>
  )
}

// ============================================
// ENROLLMENT TOKEN CARD
// ============================================

function EnrollmentTokenCard({
  token,
  tokenActive,
  canEdit,
}: {
  token: string | null
  tokenActive: boolean
  canEdit: boolean
}) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [showToken, setShowToken] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCopy() {
    if (!token) return
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleRegenerate() {
    if (!confirm('Regenerate token? Token lama tidak akan bisa dipakai lagi.')) return
    setRegenerating(true)
    setError(null)
    try {
      const res = await regenerateTokenAction()
      if (!res.ok) {
        setError(res.error ?? 'Gagal regenerate')
        return
      }
      router.refresh()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setRegenerating(false)
    }
  }

  async function handleToggle() {
    setToggling(true)
    setError(null)
    try {
      const res = await toggleTokenActiveAction(!tokenActive)
      if (!res.ok) {
        setError(res.error ?? 'Gagal ubah status')
        return
      }
      router.refresh()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 lg:p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-black text-on-surface">
              Token Enrollment Siswa
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Bagikan token ini ke siswa untuk daftar di VocAZ.
            </p>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggle}
              disabled={toggling}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                tokenActive
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              } disabled:opacity-50`}
            >
              {toggling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : tokenActive ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
              {tokenActive ? 'Aktif' : 'Nonaktif'}
            </button>

            <button
              type="button"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-outline-variant/40 text-xs font-bold text-on-surface hover:border-primary/40 disabled:opacity-50 transition-colors"
            >
              {regenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Regenerate
            </button>
          </div>
        )}
      </div>

      {!token ? (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
          Token belum tersedia. Klik <strong>Regenerate</strong> untuk generate token baru.
        </div>
      ) : (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-white border border-primary/20">
          <code className="flex-1 font-mono font-black text-lg md:text-xl text-on-surface tracking-wider break-all">
            {showToken ? token : '••••••••••••'}
          </code>

          <button
            type="button"
            onClick={() => setShowToken((v) => !v)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
            aria-label={showToken ? 'Sembunyikan' : 'Tampilkan'}
          >
            {showToken ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Tersalin
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}

      <p className="text-[11px] text-on-surface-variant mt-3 leading-relaxed">
        💡 Siswa yang mendaftar dengan token ini akan otomatis ter-link ke
        sekolah kamu dan muncul di daftar siswa BKK.
      </p>
    </div>
  )
}

// ============================================
// VIEW MODE
// ============================================

function ViewMode({ profile }: { profile: SchoolProfileData }) {
  return (
    <div className="space-y-4">
      {/* Deskripsi */}
      {profile.description && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
          <SectionTitle icon={SchoolIcon} title="Tentang Sekolah" />
          <p className="text-sm text-on-surface leading-relaxed mt-3">
            {profile.description}
          </p>
        </div>
      )}

      {/* Info Sekolah */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <SectionTitle icon={Building2} title="Informasi Sekolah" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <InfoRow label="NPSN" value={profile.npsn ?? '-'} mono />
          <InfoRow
            label="Jenjang"
            value={profile.level ? profile.level.toUpperCase() : '-'}
          />
          <InfoRow
            label="Akreditasi"
            value={profile.accreditation ?? '-'}
          />
          <InfoRow label="Website" value={profile.website ?? '-'} />
          <InfoRow
            label="Email"
            value={profile.email ?? '-'}
            icon={Mail}
          />
          <InfoRow
            label="Telepon"
            value={profile.phone ?? '-'}
            icon={Phone}
          />
          <InfoRow
            label="Alamat"
            value={profile.address ?? '-'}
            full
          />
          <InfoRow
            label="Kota"
            value={profile.city ?? '-'}
            icon={MapPin}
          />
          <InfoRow label="Provinsi" value={profile.province ?? '-'} />
        </div>
      </div>

      {/* Info BKK */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <SectionTitle icon={Users} title="Informasi BKK" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <InfoRow
            label="Nama BKK"
            value={profile.bkkName ?? '-'}
          />
          <InfoRow
            label="Narahubung"
            value={profile.bkkContact ?? '-'}
          />
          <InfoRow
            label="Email BKK"
            value={profile.bkkEmail ?? '-'}
            icon={Mail}
          />
          <InfoRow
            label="Telepon BKK"
            value={profile.bkkPhone ?? '-'}
            icon={Phone}
          />
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <SectionTitle icon={Award} title="Subscription" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <InfoRow
            label="Paket"
            value={profile.subscriptionPlan ?? 'Free'}
          />
          <InfoRow
            label="Status"
            value={profile.subscriptionStatus ?? 'trial'}
          />
          <InfoRow
            label="Kuota Siswa Aktif"
            value={String(profile.activeStudentQuota)}
          />
          <InfoRow
            label="Kuota Admin Seat"
            value={String(profile.adminSeatQuota)}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================
// EDIT MODE
// ============================================

function EditMode({
  form,
  update,
  onSave,
  onCancel,
  saving,
  error,
}: {
  form: EditForm
  update: <K extends keyof EditForm>(k: K, v: string) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
  error: string | null
}) {
  return (
    <div className="space-y-4">
      {/* Info Sekolah */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <SectionTitle icon={Building2} title="Informasi Sekolah" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field
            label="Nama Sekolah"
            value={form.name}
            onChange={(v) => update('name', v)}
            required
            full
          />
          <Field
            label="NPSN"
            value={form.npsn}
            onChange={(v) => update('npsn', v)}
            placeholder="8 digit NPSN"
          />
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-2">
              Jenjang
            </label>
            <select
              value={form.level}
              onChange={(e) => update('level', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
            >
              <option value="">Pilih jenjang</option>
              <option value="smk">SMK</option>
              <option value="sma">SMA</option>
              <option value="ma">MA</option>
              <option value="smk_negeri">SMK Negeri</option>
              <option value="smk_swasta">SMK Swasta</option>
            </select>
          </div>
          <Field
            label="Akreditasi"
            value={form.accreditation}
            onChange={(v) => update('accreditation', v)}
            placeholder="A / B / C"
          />
          <Field
            label="Email Sekolah"
            type="email"
            value={form.email}
            onChange={(v) => update('email', v)}
          />
          <Field
            label="Telepon"
            value={form.phone}
            onChange={(v) => update('phone', v)}
          />
          <Field
            label="Website"
            type="url"
            value={form.website}
            onChange={(v) => update('website', v)}
            placeholder="https://..."
          />
          <Field
            label="Logo URL"
            type="url"
            value={form.logoUrl}
            onChange={(v) => update('logoUrl', v)}
            placeholder="https://..."
          />
          <Field
            label="Alamat"
            value={form.address}
            onChange={(v) => update('address', v)}
            full
          />
          <Field
            label="Kota"
            value={form.city}
            onChange={(v) => update('city', v)}
          />
          <Field
            label="Provinsi"
            value={form.province}
            onChange={(v) => update('province', v)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-xs font-bold text-on-surface-variant mb-2">
            Deskripsi Sekolah
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            placeholder="Ceritakan tentang sekolah..."
            className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm resize-none"
          />
        </div>
      </div>

      {/* Info BKK */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <SectionTitle icon={Users} title="Informasi BKK" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field
            label="Nama BKK"
            value={form.bkkName}
            onChange={(v) => update('bkkName', v)}
          />
          <Field
            label="Narahubung BKK"
            value={form.bkkContact}
            onChange={(v) => update('bkkContact', v)}
          />
          <Field
            label="Email BKK"
            type="email"
            value={form.bkkEmail}
            onChange={(v) => update('bkkEmail', v)}
          />
          <Field
            label="Telepon BKK"
            value={form.bkkPhone}
            onChange={(v) => update('bkkPhone', v)}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl border border-outline-variant/30 p-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  )
}

// ============================================
// SHARED COMPONENTS
// ============================================

function SectionTitle({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary" />
      <h3 className="text-sm font-bold text-on-surface">{title}</h3>
    </div>
  )
}

function InfoRow({
  label,
  value,
  mono,
  icon: Icon,
  full,
}: {
  label: string
  value: string
  mono?: boolean
  icon?: any
  full?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-container-low/50 ${
        full ? 'md:col-span-2' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-on-surface-variant" />}
        <span className="text-xs text-on-surface-variant">{label}</span>
      </div>
      <span
        className={`text-xs font-bold text-on-surface text-right truncate max-w-[60%] ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  full,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  full?: boolean
}) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-bold text-on-surface-variant mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm transition-colors"
      />
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-black text-on-surface tracking-tight">
        {value}
      </div>
      <div className="text-xs font-bold text-on-surface mt-1">{label}</div>
    </div>
  )
}