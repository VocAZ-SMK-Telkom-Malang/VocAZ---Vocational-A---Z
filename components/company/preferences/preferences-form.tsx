// components/company/preferences/preferences-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Award,
  Briefcase,
} from 'lucide-react'
import { TagSelector } from './tag-selector'
import { savePreferencesAction } from '@/app/company/preferences/actions'
import type {
  TalentPreferenceData,
  PreferencesOptions,
} from '@/lib/queries/company-preferences'

const WORK_MODE_OPTIONS = [
  { value: 'onsite', label: 'On-site', desc: 'Kerja di kantor' },
  { value: 'remote', label: 'Remote', desc: 'Kerja dari mana saja' },
  { value: 'hybrid', label: 'Hybrid', desc: 'Kombinasi' },
]

type Props = {
  prefs: TalentPreferenceData
  options: PreferencesOptions
}

export function PreferencesForm({ prefs, options }: Props) {
  const router = useRouter()

  const [form, setForm] = useState({
    skills: prefs.skills,
    programs: prefs.programs,
    locations: prefs.locations,
    certifications: prefs.certifications,
    minExperience: prefs.minExperience ?? 0,
    maxExperience: prefs.maxExperience ?? 0,
    workMode: prefs.workMode,
    preferVerified: prefs.preferVerified,
    preferBnsp: prefs.preferBnsp,
    minMatchScore: prefs.minMatchScore,
  })

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm({ ...form, [key]: value })
    setSuccess(false)
    setError(null)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await savePreferencesAction({
        skills: form.skills,
        programs: form.programs,
        locations: form.locations,
        certifications: form.certifications,
        minExperience: form.minExperience > 0 ? form.minExperience : null,
        maxExperience: form.maxExperience > 0 ? form.maxExperience : null,
        workMode: form.workMode as any,
        preferVerified: form.preferVerified,
        preferBnsp: form.preferBnsp,
        minMatchScore: form.minMatchScore,
      } as any)

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
    <div className="space-y-8">
      {/* Skills */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              Skills yang Dicari
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Kandidat dengan skill ini akan diprioritaskan di Smart Match.
            </p>
          </div>
        </div>

        <TagSelector
          label="Skills"
          placeholder="Cari skill..."
          options={options.skills.map((s) => ({
            value: s.name,
            label: s.name,
            category: s.category,
          }))}
          selected={form.skills}
          onChange={(v) => update('skills', v)}
          max={50}
          grouped
        />
      </div>

      {/* Programs */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              Program Keahlian
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Jurusan SMK yang sesuai dengan kebutuhan perusahaan.
            </p>
          </div>
        </div>

        <TagSelector
          label="Program"
          placeholder="Cari jurusan..."
          options={options.programs.map((p) => ({
            value: p,
            label: p,
          }))}
          selected={form.programs}
          onChange={(v) => update('programs', v)}
          max={20}
        />
      </div>

      {/* Locations */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              Lokasi Preferensi
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Kandidat dari kota ini akan mendapat bonus skor.
            </p>
          </div>
        </div>

        <TagSelector
          label="Kota"
          placeholder="Cari kota..."
          options={options.cities.map((c) => ({
            value: c,
            label: c,
          }))}
          selected={form.locations}
          onChange={(v) => update('locations', v)}
          max={50}
        />
      </div>

      {/* Criteria */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              Kriteria Tambahan
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Pengalaman, work mode, dan preferensi lainnya.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Min Experience (bulan)
              </label>
              <input
                type="number"
                min={0}
                max={120}
                value={form.minExperience || ''}
                onChange={(e) =>
                  update('minExperience', Number(e.target.value) || 0)
                }
                placeholder="0 = tanpa minimum"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Max Experience (bulan)
              </label>
              <input
                type="number"
                min={0}
                max={120}
                value={form.maxExperience || ''}
                onChange={(e) =>
                  update('maxExperience', Number(e.target.value) || 0)
                }
                placeholder="0 = tanpa maksimum"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
              />
            </div>
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Work Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => update('workMode', null)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  form.workMode === null
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/40 hover:border-primary/30'
                }`}
              >
                <div className="text-sm font-bold text-on-surface">
                  Fleksibel
                </div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  Semua work mode
                </div>
              </button>

              {WORK_MODE_OPTIONS.map((opt) => {
                const isActive = form.workMode === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update('workMode', opt.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      isActive
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant/40 hover:border-primary/30'
                    }`}
                  >
                    <div
                      className={`text-sm font-bold ${
                        isActive ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">
                      {opt.desc}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-4 border-t border-outline-variant/30">
            <label className="flex items-center justify-between gap-4 p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-on-surface">
                    Prioritaskan Verified Candidate
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    Kandidat dengan badge verified dapat bonus skor
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.preferVerified}
                onChange={(e) =>
                  update('preferVerified', e.target.checked)
                }
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between gap-4 p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-on-surface">
                    Prioritaskan BNSP Certified
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    Kandidat dengan sertifikat BNSP dapat bonus skor
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.preferBnsp}
                onChange={(e) => update('preferBnsp', e.target.checked)}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
              />
            </label>
          </div>

          {/* Min Match Score */}
          <div className="pt-4 border-t border-outline-variant/30">
            <label className="block text-sm font-semibold text-on-surface mb-3">
              Minimum Match Score:{' '}
              <span className="text-primary font-black">
                {form.minMatchScore}%
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={form.minMatchScore}
              onChange={(e) =>
                update('minMatchScore', Number(e.target.value))
              }
              className="w-full accent-primary"
            />
            <div className="flex justify-between mt-1 text-[10px] text-on-surface-variant font-mono">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
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
              Preferences berhasil disimpan
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-md hover:brightness-110 disabled:opacity-60 transition-all"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Preference
            </>
          )}
        </button>
      </div>
    </div>
  )
}