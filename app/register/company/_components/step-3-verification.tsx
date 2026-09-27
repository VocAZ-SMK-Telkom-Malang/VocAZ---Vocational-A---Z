// app/register/company/_components/step-3-verification.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Upload,
  Check,
  AlertCircle,
  Trash2,
  Info,
  Loader2,
} from 'lucide-react'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { REGISTER_STEPS } from '@/lib/register/steps'
import {
  uploadFile,
  getOrCreateRegistrationId,
} from '@/lib/storage/upload-client'

type DocType = 'siup' | 'npwp' | 'tdp'

type UploadedDoc = {
  name: string
  url: string
  key: string
  size: number
}

const DOCUMENTS: {
  type: DocType
  label: string
  description: string
  required: boolean
}[] = [
  {
    type: 'siup',
    label: 'SIUP (Surat Izin Usaha Perdagangan)',
    description: 'Format: PDF, JPG, PNG. Maks 5MB.',
    required: false,
  },
  {
    type: 'npwp',
    label: 'NPWP (Nomor Pokok Wajib Pajak)',
    description: 'Format: PDF, JPG, PNG. Maks 5MB.',
    required: false,
  },
  {
    type: 'tdp',
    label: 'TDP (Tanda Daftar Perusahaan)',
    description: 'Format: PDF, JPG, PNG. Maks 5MB.',
    required: false,
  },
]

export function Step3Verification() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDoc>>(
    {}
  )
  const [uploadingType, setUploadingType] = useState<DocType | null>(null)
  const [noDocs, setNoDocs] = useState(false)

  async function handleFileUpload(type: DocType, file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB')
      return
    }

    setError(null)
    setUploadingType(type)

    const regId = getOrCreateRegistrationId()
    const result = await uploadFile(file, 'company-doc', regId)
    setUploadingType(null)

    if (!result.ok) {
      setError(`Gagal upload ${file.name}: ${result.error}`)
      return
    }

    setUploadedDocs((prev) => ({
      ...prev,
      [type]: {
        name: file.name,
        url: result.url,
        key: result.key,
        size: result.size,
      },
    }))
  }

  function handleRemove(type: DocType) {
    setUploadedDocs((prev) => {
      const next = { ...prev }
      delete next[type]
      return next
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    if (uploadingType) {
      setError('Tunggu upload selesai dulu')
      setIsPending(false)
      return
    }

    const formData = new FormData(e.currentTarget)

    const existing = JSON.parse(
      sessionStorage.getItem('company-register') || '{}'
    )

    sessionStorage.setItem(
      'company-register',
      JSON.stringify({
        ...existing,
        businessRegistrationNumber: formData.get(
          'businessRegistrationNumber'
        ) as string,
        responsibleName: formData.get('responsibleName') as string,
        responsiblePosition: formData.get('responsiblePosition') as string,
        responsibleEmail: formData.get('responsibleEmail') as string,
        documents: uploadedDocs,
        skippedDocs: noDocs,
      })
    )

    router.push('/register/company/4')
    setIsPending(false)
  }

  return (
    <RegisterShell
      role="company"
      steps={REGISTER_STEPS.company}
      currentStep={3}
      title="Verifikasi Perusahaan Anda"
      description="Bantu kami memverifikasi perusahaan Anda agar kandidat dapat mempercayai organisasi tempat mereka melamar."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* SECTION 1 */}
        <div className="space-y-4">
          <h2 className="font-display text-base font-bold text-on-surface">
            1. Nomor Registrasi Bisnis
          </h2>

          <div>
            <label
              htmlFor="businessRegistrationNumber"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Nomor Registrasi
              <span className="text-on-surface-variant/70 ml-1 font-normal normal-case">
                (Opsional)
              </span>
            </label>
            <input
              id="businessRegistrationNumber"
              name="businessRegistrationNumber"
              type="text"
              placeholder="e.g. 1234567890"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              Berikan informasi ini jika perusahaan Anda memiliki nomor
              registrasi bisnis yang terdaftar.
            </p>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="space-y-4 pt-6 border-t border-outline-variant/30">
          <div>
            <h2 className="font-display text-base font-bold text-on-surface mb-1">
              2. Dokumen Pendukung
            </h2>
            <p className="text-xs text-on-surface-variant">
              Upload dokumen resmi untuk membangun kredibilitas. File gambar
              otomatis dikompres.
            </p>
          </div>

          <div className="space-y-3">
            {DOCUMENTS.map((doc) => {
              const uploaded = uploadedDocs[doc.type]
              const isUploading = uploadingType === doc.type
              const isUploaded = !!uploaded

              return (
                <div
                  key={doc.type}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                    isUploaded
                      ? 'border-emerald-200 bg-emerald-50'
                      : isUploading
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-outline-variant/40 bg-white'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isUploaded
                        ? 'bg-emerald-100 text-emerald-700'
                        : isUploading
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isUploaded ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {doc.label}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {isUploading ? (
                        <span className="text-amber-700 font-medium">
                          Mengunggah...
                        </span>
                      ) : isUploaded ? (
                        <span className="text-emerald-700 font-medium">
                          {uploaded.name} ({(uploaded.size / 1024).toFixed(0)}{' '}
                          KB)
                        </span>
                      ) : (
                        doc.description
                      )}
                    </p>
                  </div>

                  {isUploaded ? (
                    <button
                      type="button"
                      onClick={() => handleRemove(doc.type)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      aria-label="Hapus dokumen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ring-1 ring-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer transition-colors shrink-0">
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="application/pdf,image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(doc.type, file)
                        }}
                        onClick={(e) =>
                          ((e.target as HTMLInputElement).value = '')
                        }
                      />
                    </label>
                  )}
                </div>
              )
            })}
          </div>

          <label className="flex items-start gap-2.5 p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low cursor-pointer">
            <input
              type="checkbox"
              checked={noDocs}
              onChange={(e) => setNoDocs(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <div className="text-xs text-on-surface-variant leading-relaxed">
              <span className="block font-semibold text-on-surface mb-1">
                Saya tidak memiliki dokumen di atas
              </span>
              Tidak masalah! VocAZ mendukung berbagai ukuran bisnis, termasuk
              UMKM dan startup awal.
            </div>
          </label>
        </div>

        {/* SECTION 3 */}
        <div className="space-y-4 pt-6 border-t border-outline-variant/30">
          <h2 className="font-display text-base font-bold text-on-surface">
            3. Penanggung Jawab Resmi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="responsibleName"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Nama
              </label>
              <input
                id="responsibleName"
                name="responsibleName"
                type="text"
                placeholder="Naufal Nizar De Bian"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
            <div>
              <label
                htmlFor="responsiblePosition"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Jabatan
              </label>
              <input
                id="responsiblePosition"
                name="responsiblePosition"
                type="text"
                placeholder="IT Manager"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="responsibleEmail"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Email
            </label>
            <input
              id="responsibleEmail"
              name="responsibleEmail"
              type="email"
              placeholder="bian@example.com"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* CHECKBOXES */}
        <div className="pt-4 space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-xs text-on-surface-variant leading-relaxed">
              Saya mengonfirmasi bahwa informasi yang diberikan adalah akurat
              dan benar sepengetahuan saya.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-xs text-on-surface-variant leading-relaxed">
              Saya berwenang untuk mewakili perusahaan ini dan menyetujui
              Ketentuan Layanan.
            </span>
          </label>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <Info className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
          <div className="text-xs text-blue-800 leading-relaxed">
            <span className="font-semibold block mb-0.5">
              Siap untuk Ditinjau
            </span>
            Setelah dikirimkan, tim kami akan meninjau permohonan Anda dalam
            1-2 hari kerja.
          </div>
        </div>

        <StepNav
          prevHref="/register/company/2"
          onSubmit
          isPending={isPending || uploadingType !== null}
          submitLabel={
            uploadingType ? 'Mengunggah dokumen...' : 'Kirim untuk Verifikasi'
          }
          submitLoadingLabel="Mengirim..."
        />
      </form>
    </RegisterShell>
  )
}