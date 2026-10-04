// app/certification/profile/profile-client.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Award,
  FileBadge,
  Edit3,
  Save,
  X,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Clock,
  TrendingUp,
  ExternalLink,
} from 'lucide-react'
import type { CertProfileData } from '@/lib/queries/cert-profile'
import { updateCertProfileAction } from './actions'

type Props = {
  profile: CertProfileData
  userRole: 'owner' | 'admin' | 'verifier'
}

type EditForm = {
  name: string
  licenseNumber: string
  email: string
  phone: string
  website: string
  address: string
  logoUrl: string
  description: string
}

const TYPE_LABEL: Record<string, string> = {
  lsp_bnsp: 'LSP / BNSP',
  industry: 'Industry Certification',
  training: 'Training Institution',
}

const TYPE_COLOR: Record<string, string> = {
  lsp_bnsp: 'bg-amber-100 text-amber-700 border-amber-200',
  industry: 'bg-blue-100 text-blue-700 border-blue-200',
  training: 'bg-purple-100 text-purple-700 border-purple-200',
}

export function CertProfileClient({ profile, userRole }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canEdit = userRole === 'owner'

  const initialForm: EditForm = {
    name: profile.name,
    licenseNumber: profile.licenseNumber ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    website: profile.website ?? '',
    address: profile.address ?? '',
    logoUrl: profile.logoUrl ?? '',
    description: profile.description ?? '',
  }

  const [form, setForm] = useState<EditForm>(initialForm)

  function update<K extends keyof EditForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  function cancelEdit() {
    setEditing(false)
    setError(null)
    setForm(initialForm)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await updateCertProfileAction({
        name: form.name,
        licenseNumber: form.licenseNumber || null,
        email: form.email || null,
        phone: form.phone || null,
        website: form.website || null,
        address: form.address || null,
        logoUrl: form.logoUrl || null,
        description: form.description || null,
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

  const typeLabel = TYPE_LABEL[profile.type] ?? profile.type
  const typeColor = TYPE_COLOR[profile.type] ?? TYPE_COLOR.industry

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
              <span
                className={`px-2 py-0.5 rounded border font-mono text-[10px] font-bold uppercase tracking-wider ${typeColor}`}
              >
                {typeLabel}
              </span>
              {profile.isApproved ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  Pending Approval
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
              {profile.name}
            </h1>

            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {profile.licenseNumber && (
                <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <FileBadge className="w-3.5 h-3.5" />
                  <span className="font-mono">
                    {profile.licenseNumber}
                  </span>
                </span>
              )}
              {profile.address && (
                <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.address}
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Award}
          label="Total Verified"
          value={profile.stats.totalVerified}
          color="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={Clock}
          label="Menunggu Review"
          value={profile.stats.pendingCount}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={TrendingUp}
          label="Approval Rate"
          value={profile.stats.approvalRate}
          suffix="%"
          color="bg-primary/10 text-primary"
        />
        <StatCard
          icon={FileBadge}
          label="Total Sertifikat"
          value={profile.stats.totalCertificates}
          color="bg-blue-100 text-blue-700"
        />
      </div>

      {/* Edit / View */}
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
// VIEW MODE
// ============================================

function ViewMode({ profile }: { profile: CertProfileData }) {
  const typeLabel = TYPE_LABEL[profile.type] ?? profile.type

  return (
    <div className="space-y-4">
      {/* Deskripsi */}
      {profile.description && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
          <SectionTitle icon={Building2} title="Tentang Institusi" />
          <p className="text-sm text-on-surface leading-relaxed mt-3 whitespace-pre-line">
            {profile.description}
          </p>
        </div>
      )}

      {/* Info Institusi */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <SectionTitle icon={Building2} title="Informasi Institusi" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <InfoRow label="Nama Institusi" value={profile.name} />
          <InfoRow label="Jenis" value={typeLabel} />
          <InfoRow
            label="Nomor Lisensi"
            value={profile.licenseNumber ?? '-'}
            mono
          />
          <InfoRow
            label="Status"
            value={profile.isApproved ? 'Approved' : 'Pending Approval'}
          />
          {profile.approvedAt && (
            <InfoRow
              label="Tanggal Approval"
              value={new Date(profile.approvedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            />
          )}
          <InfoRow
            label="Terdaftar Sejak"
            value={new Date(profile.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          />
        </div>
      </div>

      {/* Kontak */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <SectionTitle icon={Mail} title="Kontak & Lokasi" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
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
            label="Website"
            value={profile.website ?? '-'}
            icon={Globe}
            isLink={!!profile.website}
          />
          <InfoRow
            label="Alamat"
            value={profile.address ?? '-'}
            icon={MapPin}
            full
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
      {/* Info Institusi */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <SectionTitle icon={Building2} title="Informasi Institusi" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field
            label="Nama Institusi"
            value={form.name}
            onChange={(v) => update('name', v)}
            required
            full
            placeholder="Contoh: LSP Teknologi Digital"
          />
          <Field
            label="Nomor Lisensi"
            value={form.licenseNumber}
            onChange={(v) => update('licenseNumber', v)}
            placeholder="Contoh: LSP-1234-2024"
          />
          <Field
            label="Logo URL"
            type="url"
            value={form.logoUrl}
            onChange={(v) => update('logoUrl', v)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Kontak */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <SectionTitle icon={Mail} title="Kontak & Lokasi" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => update('email', v)}
            placeholder="email@institusi.com"
          />
          <Field
            label="Telepon"
            value={form.phone}
            onChange={(v) => update('phone', v)}
            placeholder="+62 21 1234 5678"
          />
          <Field
            label="Website"
            type="url"
            value={form.website}
            onChange={(v) => update('website', v)}
            placeholder="https://institusi.com"
            full
          />
          <Field
            label="Alamat"
            value={form.address}
            onChange={(v) => update('address', v)}
            placeholder="Jl. Contoh No. 123, Kota"
            full
          />
        </div>
      </div>

      {/* Deskripsi */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <SectionTitle icon={Building2} title="Deskripsi" />
        <div className="mt-4">
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={5}
            placeholder="Ceritakan tentang institusi kamu, jenis sertifikasi yang diverifikasi, dll..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/50 transition-colors resize-none"
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
// SHARED
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
  isLink,
  full,
}: {
  label: string
  value: string
  mono?: boolean
  icon?: any
  isLink?: boolean
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
      {isLink && value !== '-' ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 text-right truncate max-w-[60%] ${
            mono ? 'font-mono' : ''
          }`}
        >
          {value}
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      ) : (
        <span
          className={`text-xs font-bold text-on-surface text-right truncate max-w-[60%] ${
            mono ? 'font-mono' : ''
          }`}
        >
          {value}
        </span>
      )}
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
        className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/50 transition-colors"
      />
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
}: {
  icon: any
  label: string
  value: number
  suffix?: string
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
      <div className="text-2xl font-black text-on-surface tracking-tight font-mono">
        {value}
        {suffix && (
          <span className="text-sm text-on-surface-variant ml-0.5">
            {suffix}
          </span>
        )}
      </div>
      <div className="text-xs font-bold text-on-surface mt-1">{label}</div>
    </div>
  )
}