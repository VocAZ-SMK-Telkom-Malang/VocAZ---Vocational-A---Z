// components/company/profile/contact-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  Save,
  CheckCircle2,
  MapPin,
} from 'lucide-react'
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { updateContactAction } from '@/app/company/profile/actions'

const PROVINCES = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten',
  'DI Yogyakarta', 'Bali', 'Sumatera Utara', 'Sumatera Barat', 'Sumatera Selatan',
  'Riau', 'Kalimantan Timur', 'Kalimantan Selatan', 'Kalimantan Barat',
  'Sulawesi Selatan', 'Sulawesi Utara', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Papua', 'Aceh',
]

type Props = {
  address: string | null
  city: string | null
  province: string | null
  linkedinUrl: string | null
  instagramUrl: string | null
  facebookUrl: string | null
}

export function ContactForm({
  address,
  city,
  province,
  linkedinUrl,
  instagramUrl,
  facebookUrl,
}: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    address: address ?? '',
    city: city ?? '',
    province: province ?? '',
    linkedinUrl: linkedinUrl ?? '',
    instagramUrl: instagramUrl ?? '',
    facebookUrl: facebookUrl ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await updateContactAction({
        address: form.address || null,
        city: form.city || null,
        province: form.province || null,
        linkedinUrl: form.linkedinUrl || null,
        instagramUrl: form.instagramUrl || null,
        facebookUrl: form.facebookUrl || null,
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
      {/* Location */}
      <div>
        <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Lokasi
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Alamat Lengkap
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={2}
              maxLength={500}
              placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm resize-y transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Kota
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Jakarta Selatan"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Provinsi
              </label>
              <select
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm cursor-pointer"
              >
                <option value="">Pilih Provinsi</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="pt-6 border-t border-outline-variant/30">
        <h3 className="text-sm font-bold text-on-surface mb-4">
          Media Sosial
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2 flex items-center gap-2">
              <FaLinkedin className="w-4 h-4 text-blue-600" />
              LinkedIn
            </label>
            <input
              type="url"
              value={form.linkedinUrl}
              onChange={(e) =>
                setForm({ ...form, linkedinUrl: e.target.value })
              }
              placeholder="https://linkedin.com/company/contoh"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2 flex items-center gap-2">
              <FaInstagram className="w-4 h-4 text-pink-600" />
              Instagram
            </label>
            <input
              type="url"
              value={form.instagramUrl}
              onChange={(e) =>
                setForm({ ...form, instagramUrl: e.target.value })
              }
              placeholder="https://instagram.com/contoh"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2 flex items-center gap-2">
              <FaFacebook className="w-4 h-4 text-blue-700" />
              Facebook
            </label>
            <input
              type="url"
              value={form.facebookUrl}
              onChange={(e) =>
                setForm({ ...form, facebookUrl: e.target.value })
              }
              placeholder="https://facebook.com/contoh"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-outline-variant/30">
        <div>
          {error && <p className="text-sm text-error">{error}</p>}
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
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-md hover:brightness-110 disabled:opacity-60 transition-all"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan
            </>
          )}
        </button>
      </div>
    </div>
  )
}