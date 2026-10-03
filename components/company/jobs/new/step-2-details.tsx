// components/company/jobs/new/step-2-details.tsx
'use client'

import { useState } from 'react'
import { MapPin, Eye, EyeOff } from 'lucide-react'

type Data = {
  location: string | null
  city: string
  province: string
  isSalaryVisible: boolean
  salaryMin: number | null
  salaryMax: number | null
}

type Props = {
  data: Data
  onChange: (patch: Partial<Data>) => void
  errors: Record<string, string>
}

const PROVINCES = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten',
  'DI Yogyakarta', 'Bali', 'Sumatera Utara', 'Sumatera Barat', 'Sumatera Selatan',
  'Riau', 'Kalimantan Timur', 'Kalimantan Selatan', 'Kalimantan Barat',
  'Sulawesi Selatan', 'Sulawesi Utara', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Papua', 'Aceh',
]

function formatRupiah(value: number | null): string {
  if (!value) return ''
  return new Intl.NumberFormat('id-ID').format(value)
}

function parseRupiah(value: string): number | null {
  const cleaned = value.replace(/[^\d]/g, '')
  if (!cleaned) return null
  return Number(cleaned)
}

export function Step2Details({ data, onChange, errors }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Kota <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="Contoh: Jakarta Selatan"
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition"
          />
          {errors.city && (
            <p className="mt-1 text-xs text-error">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Provinsi <span className="text-error">*</span>
          </label>
          <select
            value={data.province}
            onChange={(e) => onChange({ province: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface transition"
          >
            <option value="">Pilih Provinsi</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="mt-1 text-xs text-error">{errors.province}</p>
          )}
        </div>
      </div>

      {/* Full Address (Optional) */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Alamat Lengkap{' '}
          <span className="text-on-surface-variant font-normal">(opsional)</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            value={data.location ?? ''}
            onChange={(e) => onChange({ location: e.target.value || null })}
            placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition"
          />
        </div>
      </div>

      {/* Salary Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={data.isSalaryVisible}
              onChange={(e) =>
                onChange({
                  isSalaryVisible: e.target.checked,
                  salaryMin: e.target.checked ? data.salaryMin : null,
                  salaryMax: e.target.checked ? data.salaryMax : null,
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-container-highest rounded-full peer-checked:bg-primary transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-on-surface">
              Tampilkan Rentang Gaji
            </div>
            <div className="text-[11px] text-on-surface-variant">
              Kandidat bisa melihat estimasi gaji
            </div>
          </div>
        </label>
      </div>

      {/* Salary Inputs */}
      {data.isSalaryVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Gaji Minimum (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                Rp
              </span>
              <input
                type="text"
                value={formatRupiah(data.salaryMin)}
                onChange={(e) =>
                  onChange({ salaryMin: parseRupiah(e.target.value) })
                }
                placeholder="0"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-lowest border border-transparent focus:border-primary/30 focus:outline-none text-sm text-on-surface transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Gaji Maksimum (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                Rp
              </span>
              <input
                type="text"
                value={formatRupiah(data.salaryMax)}
                onChange={(e) =>
                  onChange({ salaryMax: parseRupiah(e.target.value) })
                }
                placeholder="0"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-lowest border border-transparent focus:border-primary/30 focus:outline-none text-sm text-on-surface transition"
              />
            </div>
            {errors.salaryMax && (
              <p className="mt-1 text-xs text-error">{errors.salaryMax}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}