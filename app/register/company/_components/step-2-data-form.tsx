// app/register/company/_components/step-2-data-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload,
  Image as ImageIcon,
  X,
  Info,
  Building2,
  MapPin,
  Phone,
  Globe,
  Loader2,
} from 'lucide-react'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { REGISTER_STEPS } from '@/lib/register/steps'
import {
  uploadFile,
  getOrCreateRegistrationId,
} from '@/lib/storage/upload-client'

type Industry = {
  id: string
  name: string
  slug: string
}

type Province = {
  id: string
  name: string
  code: string | null
}

type Props = {
  industries: Industry[]
  provinces: Province[]
}

const COMPANY_SIZES = [
  { value: 's1_10', label: '1-10 karyawan' },
  { value: 's11_50', label: '11-50 karyawan' },
  { value: 's51_200', label: '51-200 karyawan' },
  { value: 's201_500', label: '201-500 karyawan' },
  { value: 's500plus', label: '500+ karyawan' },
]

export function Step2DataForm({ industries, provinces }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [descriptionLength, setDescriptionLength] = useState(0)

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('Logo maksimal 2MB')
      return
    }

    setLogoFile(file)
    setError(null)

    const reader = new FileReader()
    reader.onload = (ev) => {
      setLogoPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  function removeLogo() {
    setLogoFile(null)
    setLogoPreview(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const companyName = formData.get('companyName') as string
    const industry = formData.get('industry') as string
    const companySize = formData.get('companySize') as string

    if (!companyName || companyName.trim().length < 2) {
      setError('Nama perusahaan minimal 2 karakter')
      setIsPending(false)
      return
    }

    if (!industry) {
      setError('Pilih industri perusahaan')
      setIsPending(false)
      return
    }

    if (!companySize) {
      setError('Pilih ukuran perusahaan')
      setIsPending(false)
      return
    }

    // Upload logo kalau ada
    let uploadedLogoUrl: string | undefined
    let uploadedLogoKey: string | undefined

    if (logoFile) {
      setLogoUploading(true)
      const regId = getOrCreateRegistrationId()
      const result = await uploadFile(logoFile, 'company-logo', regId)
      setLogoUploading(false)

      if (!result.ok) {
        setError(`Gagal upload logo: ${result.error}`)
        setIsPending(false)
        return
      }

      uploadedLogoUrl = result.url
      uploadedLogoKey = result.key
    }

    const existing = JSON.parse(
      sessionStorage.getItem('company-register') || '{}'
    )

    sessionStorage.setItem(
      'company-register',
      JSON.stringify({
        ...existing,
        companyName,
        industry,
        companySize,
        foundedYear: formData.get('foundedYear')
          ? parseInt(formData.get('foundedYear') as string)
          : undefined,
        website: formData.get('website') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        province: formData.get('province') as string,
        description: formData.get('description') as string,
        logoUrl: uploadedLogoUrl,
        logoKey: uploadedLogoKey,
      })
    )

    router.push('/register/company/3')
    setIsPending(false)
  }

  return (
    <RegisterShell
      role="company"
      steps={REGISTER_STEPS.company}
      currentStep={2}
      title="Beri Tahu Kami Tentang Perusahaan Anda"
      description="Berikan informasi perusahaan Anda agar kami dapat membuat profil perusahaan di VocAZ."
      sidebar={<WhyWeNeedThis />}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* SECTION 1 */}
        <div className="space-y-5">
          <SectionHeader icon={Building2} title="1. Informasi Perusahaan" />

          <Field
            id="companyName"
            label="Nama Perusahaan"
            placeholder="PT Teknologi Nusantara"
            required
            helper="Gunakan nama resmi perusahaan"
          />

          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Logo Perusahaan
            </label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-1 ring-outline-variant/30 shrink-0">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain bg-white"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}

              <label
                htmlFor="logo"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full ring-1 ring-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer transition-colors"
              >
                {logoUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{logoFile ? 'Ganti Logo' : 'Upload Logo'}</span>
                <input
                  id="logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleLogoChange}
                  onClick={(e) => ((e.target as HTMLInputElement).value = '')}
                />
              </label>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              Format: PNG, JPG, atau WebP. Maks 2MB. Otomatis dikompres.
            </p>
          </div>

          {/* Industri + Ukuran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              id="industry"
              label="Industri"
              required
              options={industries.map((i) => ({
                value: i.slug,
                label: i.name,
              }))}
              placeholder="Pilih Industri"
            />
            <SelectField
              id="companySize"
              label="Ukuran Perusahaan"
              required
              options={COMPANY_SIZES}
              placeholder="Pilih Ukuran"
            />
          </div>

          <Field
            id="foundedYear"
            label="Tahun Didirikan"
            type="number"
            placeholder="2020"
            helper="Opsional — tahun perusahaan didirikan"
          />
        </div>

        {/* SECTION 2 */}
        <div className="space-y-5 pt-6 border-t border-outline-variant/30">
          <SectionHeader icon={Phone} title="2. Informasi Kontak" />

          <Field
            id="email"
            label="Email Perusahaan"
            type="email"
            placeholder="company@example.com"
            helper="Email ini digunakan untuk kontak dengan kandidat"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="phone"
              label="Nomor Telepon"
              type="tel"
              placeholder="+62 812 3456 7890"
            />
            <Field
              id="website"
              label="Website"
              type="url"
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="space-y-5 pt-6 border-t border-outline-variant/30">
          <SectionHeader icon={MapPin} title="3. Lokasi Perusahaan" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              id="province"
              label="Provinsi"
              options={provinces.map((p) => ({
                value: p.name,
                label: p.name,
              }))}
              placeholder="Pilih Provinsi"
            />
            <Field
              id="city"
              label="Kota/Kabupaten"
              placeholder="Jakarta Selatan"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Alamat Lengkap
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Jl. Sudirman No. 123, RT 01 RW 02"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
            />
          </div>
        </div>

        {/* SECTION 4 */}
        <div className="space-y-5 pt-6 border-t border-outline-variant/30">
          <SectionHeader icon={Globe} title="4. Tentang Perusahaan" />

          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              maxLength={500}
              onChange={(e) => setDescriptionLength(e.target.value.length)}
              placeholder="Jelaskan secara singkat bidang usaha atau kegiatan perusahaan Anda..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
            />
            <p className="text-[11px] text-on-surface-variant mt-1.5 text-right">
              {descriptionLength}/500 karakter
            </p>
          </div>
        </div>

        <StepNav
          prevHref="/register/company/1"
          onSubmit
          isPending={isPending || logoUploading}
          submitLabel={
            logoUploading ? 'Mengunggah logo...' : 'Simpan & Lanjutkan'
          }
          submitLoadingLabel="Menyimpan..."
        />
      </form>
    </RegisterShell>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <h2 className="font-display text-base font-bold text-on-surface">
        {title}
      </h2>
    </div>
  )
}

function Field({
  id,
  label,
  type = 'text',
  placeholder,
  required,
  helper,
}: {
  id: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  helper?: string
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
      {helper && (
        <p className="text-[11px] text-on-surface-variant mt-1.5">{helper}</p>
      )}
    </div>
  )
}

function SelectField({
  id,
  label,
  options,
  placeholder,
  required,
}: {
  id: string
  label: string
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        name={id}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white"
      >
        <option value="">{placeholder || 'Pilih...'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function WhyWeNeedThis() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-on-surface mb-2">
            Kenapa kami butuh ini?
          </h3>
          <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
            Data perusahaan membantu memverifikasi organisasi Anda dan
            menciptakan profil terpercaya untuk kandidat.
          </p>
          <ul className="text-xs text-on-surface-variant space-y-2">
            {[
              'Membangun kredibilitas perusahaan',
              'Membantu mencocokkan kandidat akurat',
              'Syarat verifikasi BNSP',
            ].map((item) => (
              <li key={item} className="flex items-start gap-1.5">
                <span className="text-emerald-600 mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}