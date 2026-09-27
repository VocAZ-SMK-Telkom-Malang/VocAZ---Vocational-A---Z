// app/register/student/_components/step-3-profile-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Info, Check } from 'lucide-react'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { REGISTER_STEPS } from '@/lib/register/steps'

type Skill = {
  id: string
  name: string
  category: string | null
}

type Props = {
  skills: Skill[]
}

export function Step3ProfileForm({ skills }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [headlineLength, setHeadlineLength] = useState(0)
  const [bioLength, setBioLength] = useState(0)

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Lainnya'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  function toggleSkill(id: string) {
    setSelectedSkills((prev) => {
      if (prev.includes(id)) {
        return prev.filter((s) => s !== id)
      }
      if (prev.length >= 15) {
        setError('Maksimal 15 skill')
        return prev
      }
      setError(null)
      return [...prev, id]
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    if (selectedSkills.length < 3) {
      setError('Pilih minimal 3 skill')
      setIsPending(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const headline = formData.get('headline') as string
    const bio = formData.get('bio') as string
    const isOpenToWork = formData.get('isOpenToWork') === 'on'
    const isPublic = formData.get('isPublic') === 'on'

    const existing = JSON.parse(
      sessionStorage.getItem('student-register') || '{}'
    )

    sessionStorage.setItem(
      'student-register',
      JSON.stringify({
        ...existing,
        headline: headline || undefined,
        bio: bio || undefined,
        skillIds: selectedSkills,
        isOpenToWork,
        isPublic,
      })
    )

    router.push('/register/student/4')
    setIsPending(false)
  }

  return (
    <RegisterShell
      role="student"
      steps={REGISTER_STEPS.student}
      currentStep={3}
      title="Bangun Profil Kamu"
      description="Profil yang lengkap meningkatkan peluangmu direkrut hingga 5x lebih besar."
      sidebar={<WhyWeNeedThis />}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* SECTION 1: Headline & Bio */}
        <div className="space-y-5">
          <SectionHeader icon={Sparkles} title="1. Tentang Kamu" />

          <div>
            <label
              htmlFor="headline"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Headline
            </label>
            <input
              id="headline"
              name="headline"
              type="text"
              maxLength={120}
              onChange={(e) => setHeadlineLength(e.target.value.length)}
              placeholder="Siswa RPL | Web Developer Pemula"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <p className="text-[11px] text-on-surface-variant mt-1.5 text-right">
              {headlineLength}/120 karakter
            </p>
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Bio Singkat
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              maxLength={300}
              onChange={(e) => setBioLength(e.target.value.length)}
              placeholder="Ceritakan singkat tentang dirimu, minat, dan tujuan kariermu..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
            />
            <p className="text-[11px] text-on-surface-variant mt-1.5 text-right">
              {bioLength}/300 karakter
            </p>
          </div>
        </div>

        {/* SECTION 2: Skills */}
        <div className="space-y-5 pt-6 border-t border-outline-variant/30">
          <div>
            <SectionHeader icon={Check} title="2. Skills" />
            <p className="text-xs text-on-surface-variant mt-2 ml-10">
              Pilih 3-15 skill. Skill yang kamu pilih akan dipakai untuk
              rekomendasi lowongan.
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(groupedSkills).map(([category, catSkills]) => (
              <div key={category}>
                <h3 className="font-display text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.id)
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-primary text-white ring-2 ring-primary/20'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        {skill.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">
              Terpilih:{' '}
              <strong className="text-on-surface">
                {selectedSkills.length}
              </strong>{' '}
              / 15
            </span>
            {selectedSkills.length >= 3 && (
              <span className="text-emerald-600 font-semibold">
                ✓ Cukup
              </span>
            )}
          </div>
        </div>

        {/* SECTION 3: Privacy */}
        <div className="space-y-4 pt-6 border-t border-outline-variant/30">
          <SectionHeader icon={Info} title="3. Privasi & Preferensi" />

          <label className="flex items-start gap-2.5 p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low cursor-pointer">
            <input
              type="checkbox"
              name="isOpenToWork"
              defaultChecked
              className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <div className="text-xs leading-relaxed">
              <span className="block font-semibold text-on-surface mb-0.5">
                Saya sedang mencari pekerjaan
              </span>
              <span className="text-on-surface-variant">
                Recruiter bisa melihat profil kamu di pencarian talenta.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low cursor-pointer">
            <input
              type="checkbox"
              name="isPublic"
              defaultChecked
              className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <div className="text-xs leading-relaxed">
              <span className="block font-semibold text-on-surface mb-0.5">
                Profil publik
              </span>
              <span className="text-on-surface-variant">
                Siapapun bisa melihat profil dan portofolio kamu.
              </span>
            </div>
          </label>
        </div>

        <StepNav
          prevHref="/register/student/2"
          onSubmit
          isPending={isPending}
          submitLabel="Simpan & Lanjutkan"
          submitLoadingLabel="Menyimpan..."
        />
      </form>
    </RegisterShell>
  )
}

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

function WhyWeNeedThis() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-on-surface mb-2">
            Tips profil kuat
          </h3>
          <ul className="text-xs text-on-surface-variant space-y-2">
            {[
              'Headline spesifik: "Siswa RPL | Web Dev"',
              'Bio jujur & singkat, tunjukkan minat',
              'Pilih skill yang benar-benar kamu kuasai',
              'Profil lengkap = 5x lebih dilirik',
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