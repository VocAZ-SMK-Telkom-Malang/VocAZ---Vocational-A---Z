// components/company/profile/basic-info-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { ImageUploader } from './image-uploader'
import {
  updateBasicInfoAction,
  updateLogoAction,
  updateCoverAction,
} from '@/app/company/profile/actions'

type Company = {
  name: string
  slug: string
  logoUrl: string | null
  coverUrl: string | null
  tagline: string | null
  industry: string | null
  companySize: string | null
  website: string | null
  email: string | null
  phone: string | null
  foundedYear: number | null
  employeeRange: string | null
}

const COMPANY_SIZE_OPTIONS = [
  { value: 's1_10', label: '1-10 karyawan' },
  { value: 's11_50', label: '11-50 karyawan' },
  { value: 's51_200', label: '51-200 karyawan' },
  { value: 's201_500', label: '201-500 karyawan' },
  { value: 's500plus', label: '500+ karyawan' },
]

const INDUSTRY_OPTIONS = [
  'Technology',
  'Manufacturing',
  'Automotive',
  'Construction',
  'Retail',
  'Hospitality',
  'Healthcare',
  'Education',
  'Finance',
  'Agriculture',
  'Logistics',
  'Energy',
  'Telecommunications',
  'Creative & Design',
  'Food & Beverage',
  'Other',
]

export function BasicInfoForm({ company }: { company: Company }) {
  const router = useRouter()

  const [form, setForm] = useState({
    name: company.name,
    tagline: company.tagline ?? '',
    industry: company.industry ?? '',
    companySize: company.companySize ?? '',
    website: company.website ?? '',
    email: company.email ?? '',
    phone: company.phone ?? '',
    foundedYear: company.foundedYear ?? 0,
    employeeRange: company.employeeRange ?? '',
  })

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await updateBasicInfoAction({
        name: form.name,
        tagline: form.tagline || null,
        industry: form.industry || null,
        companySize: (form.companySize as any) || null,
        website: form.website || null,
        email: form.email || null,
        phone: form.phone || null,
        foundedYear: form.foundedYear || null,
        employeeRange: form.employeeRange || null,
      })

      if (!res.ok) {
        setError(res.error ?? 'Gagal simpan')
        return
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <ImageUploader
            type="logo"
            currentUrl={company.logoUrl}
            onUploaded={async (url, key) => {
              await updateLogoAction({ logoUrl: url, logoKey: key })
              router.refresh()
            }}
          />
        </div>
        <div className="md:col-span-2">
          <ImageUploader
            type="cover"
            currentUrl={company.coverUrl}
            onUploaded={async (url, key) => {
              await updateCoverAction({ coverUrl: url, coverKey: key })
              router.refresh()
            }}
          />
        </div>
      </div>

      {/* Name + Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Nama Perusahaan <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Slug (URL)
          </label>
          <input
            type="text"
            value={company.slug}
            disabled
            className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-sm text-on-surface-variant cursor-not-allowed"
          />
          <p className="mt-1 text-[11px] text-on-surface-variant">
            Slug tidak bisa diubah
          </p>
        </div>
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Tagline
        </label>
        <input
          type="text"
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          placeholder="Satu kalimat yang mendeskripsikan perusahaan"
          maxLength={200}
          className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
        />
        <p className="mt-1 text-[11px] text-on-surface-variant">
          {form.tagline.length}/200
        </p>
      </div>

      {/* Industry + Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Industry
          </label>
          <select
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm cursor-pointer"
          >
            <option value="">Pilih Industry</option>
            {INDUSTRY_OPTIONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Ukuran Perusahaan
          </label>
          <select
            value={form.companySize}
            onChange={(e) => setForm({ ...form, companySize: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm cursor-pointer"
          >
            <option value="">Pilih Ukuran</option>
            {COMPANY_SIZE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Website + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Website
          </label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="https://contoh.com"
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="hr@contoh.com"
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
          />
        </div>
      </div>

      {/* Phone + Founded Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+62 21 1234 5678"
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Tahun Berdiri
          </label>
          <input
            type="number"
            value={form.foundedYear || ''}
            onChange={(e) =>
              setForm({ ...form, foundedYear: Number(e.target.value) || 0 })
            }
            placeholder="2010"
            min={1900}
            max={new Date().getFullYear()}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-outline-variant/30">
        <div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-error">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              Berhasil disimpan
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !form.name}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-md hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </div>
  )
}