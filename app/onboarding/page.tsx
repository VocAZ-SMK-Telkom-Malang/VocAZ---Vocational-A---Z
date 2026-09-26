'use client'

import { useActionState } from 'react'
import {
  GraduationCap,
  Building2,
  Landmark,
  BadgeCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { submitOnboarding } from './actions'

const roles = [
  {
    value: 'student',
    label: 'Talenta SMK',
    desc: 'Saya siswa/pelajar SMK yang ingin membangun karier',
    Icon: GraduationCap,
    color: 'bg-primary-fixed text-primary',
    ring: 'peer-checked:ring-primary',
  },
  {
    value: 'company',
    label: 'Perusahaan',
    desc: 'Saya recruiter/perusahaan yang mencari talenta',
    Icon: Building2,
    color: 'bg-tertiary-fixed text-tertiary',
    ring: 'peer-checked:ring-tertiary',
  },
  {
    value: 'school',
    label: 'SMK / BKK',
    desc: 'Saya pengelola BKK yang ingin memonitor siswa',
    Icon: Landmark,
    color: 'bg-[#FEF3C7] text-[#B45309]',
    ring: 'peer-checked:ring-[#B45309]',
  },
  {
    value: 'certification',
    label: 'Lembaga Sertifikasi',
    desc: 'Saya institusi yang memverifikasi sertifikat',
    Icon: BadgeCheck,
    color: 'bg-[#FCE7F3] text-[#9D174D]',
    ring: 'peer-checked:ring-[#9D174D]',
  },
]

export default function OnboardingPage() {
  const [state, formAction, isPending] = useActionState(submitOnboarding, null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-[#FFF8F5] to-[#FAF8F5] relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-tertiary-container/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-white shadow-[0_2px_12px_rgba(220,38,38,0.06)] px-3 py-1 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-[11px] uppercase text-primary font-bold tracking-wider">
              Langkah Terakhir
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Selamat Datang di{' '}
            <span className="bg-gradient-to-r from-primary-container to-tertiary-container bg-clip-text text-transparent">
              VocAZ!
            </span>
          </h1>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Pilih peran kamu untuk memulai perjalanan karier yang lebih baik.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(183,0,17,0.14)] ring-1 ring-outline-variant/30 p-6 sm:p-10">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2">
              <span className="text-lg leading-none">⚠️</span>
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-8">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Nama Lengkap / Nama Instansi
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-white text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                Pilih Peran
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.Icon
                  return (
                    <label
                      key={role.value}
                      className="relative flex items-start gap-3 p-4 rounded-2xl border border-outline-variant/40 cursor-pointer bg-white hover:border-primary/30 hover:bg-[#FFF8F5] transition-all has-[:checked]:border-primary has-[:checked]:bg-[#FFF8F5] has-[:checked]:shadow-[0_8px_24px_rgba(220,38,38,0.08)]"
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        required
                        className="peer sr-only"
                      />

                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl ${role.color} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display text-sm font-bold text-on-surface">
                            {role.label}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {role.desc}
                        </p>
                      </div>

                      {/* Check indicator */}
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-outline-variant/40 flex items-center justify-center transition-all peer-checked:bg-primary peer-checked:border-primary">
                        <svg
                          className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display font-semibold py-3.5 px-6 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
            >
              {isPending ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>Lanjutkan ke Dashboard</span>
                  <ArrowRight className="w-[18px] h-[18px]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-on-surface-variant mt-6">
          Kamu bisa mengubah peran ini nanti di pengaturan akun.
        </p>
      </div>
    </div>
  )
}