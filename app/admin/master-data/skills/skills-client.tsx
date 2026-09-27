'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { SkillItem } from '@/components/admin/master-data/skill-item'
import { SkillCreateModal } from '@/components/admin/master-data/skill-create-modal'

type Skill = {
  id: string
  name: string
  category: string | null
  _count: { students: number; jobSkills: number }
}

type Props = {
  skills: Skill[]
  totalCount: number
}

export function SkillsClient({ skills, totalCount }: Props) {
  const [showCreate, setShowCreate] = useState(false)

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Tanpa Kategori'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/master-data"
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-on-surface">
              Skills
            </h1>
            <p className="text-sm text-on-surface-variant">
              {totalCount} skill terdaftar
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white text-sm font-semibold shadow-[0_4px_16px_rgba(220,38,38,0.25)] hover:brightness-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah Skill</span>
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-display text-sm font-bold text-on-surface uppercase tracking-wider">
                {category}
              </h2>
              <span className="text-[10px] font-mono font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                {catSkills.length}
              </span>
              <div className="flex-1 h-px bg-outline-variant/30" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {catSkills.map((skill) => (
                <SkillItem key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="bg-white rounded-2xl border border-outline-variant/30 py-16 text-center">
            <p className="text-sm text-on-surface-variant">
              Belum ada skill terdaftar.
            </p>
          </div>
        )}
      </div>

      {showCreate && (
        <SkillCreateModal onClose={() => setShowCreate(false)} />
      )}
    </>
  )
}