// components/student/profile/profile-skills-summary.tsx
'use client'

import Link from 'next/link'
import { Award, ArrowUpRight, Sparkles } from 'lucide-react'

type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

type Skill = {
  id: string
  name: string
  category: string | null
  proficiency: ProficiencyLevel
}

type Props = {
  skills: Skill[]
  preview?: boolean
}

const PROFICIENCY_CONFIG: Record<
  ProficiencyLevel,
  { label: string; color: string; width: number }
> = {
  beginner: { label: 'Beginner', color: 'bg-slate-100 text-slate-700', width: 25 },
  intermediate: { label: 'Intermediate', color: 'bg-blue-100 text-blue-700', width: 50 },
  advanced: { label: 'Advanced', color: 'bg-indigo-100 text-indigo-700', width: 75 },
  expert: { label: 'Expert', color: 'bg-emerald-100 text-emerald-700', width: 100 },
}

export function ProfileSkillsSummary({ skills, preview = false }: Props) {
  const displaySkills = preview ? skills.slice(0, 8) : skills

  if (skills.length === 0) {
    return (
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <Award className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-on-surface mb-1">
          Belum ada skill
        </p>
        <p className="text-xs text-on-surface-variant mb-4">
          Tambahkan skill biar recruiter lebih gampang nemuin kamu
        </p>
        <Link
          href="/student/profile/skills"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90"
        >
          <Sparkles className="w-4 h-4" />
          Tambah Skill
        </Link>
      </div>
    )
  }

  return (
    <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <h2 className="text-base font-black text-on-surface">
            Skills{' '}
            <span className="text-on-surface-variant font-bold">
              ({skills.length})
            </span>
          </h2>
        </div>
        <Link
          href="/student/profile/skills"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4"
        >
          Kelola
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {displaySkills.map((skill) => {
          const cfg =
            PROFICIENCY_CONFIG[skill.proficiency] ??
            PROFICIENCY_CONFIG.intermediate

          return (
            <div
              key={skill.id}
              className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-sm font-bold text-on-surface truncate">
                  {skill.name}
                </p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}
                >
                  {cfg.label}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                  style={{ width: `${cfg.width}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {preview && skills.length > 8 && (
        <Link
          href="/student/profile/skills"
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4"
        >
          Lihat semua {skills.length} skill
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </section>
  )
}