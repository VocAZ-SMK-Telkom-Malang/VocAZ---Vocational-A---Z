// components/student/profile/profile-skills-inline.tsx
'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
  Sparkles,
} from 'lucide-react'
import {
  addStudentSkill,
  updateStudentSkill,
  deleteStudentSkill,
} from '@/app/actions/profile'

type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

type Skill = {
  id: string
  skillId: string
  name: string
  category: string | null
  proficiency: ProficiencyLevel
}

type MasterSkill = {
  id: string
  name: string
  category: string | null
}

type Props = {
  skills: Skill[]
}

const PROFICIENCY_OPTIONS: {
  value: ProficiencyLevel
  label: string
  color: string
  width: number
}[] = [
  { value: 'beginner', label: 'Beginner', color: 'bg-slate-100 text-slate-700', width: 25 },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-700', width: 50 },
  { value: 'advanced', label: 'Advanced', color: 'bg-indigo-100 text-indigo-700', width: 75 },
  { value: 'expert', label: 'Expert', color: 'bg-emerald-100 text-emerald-700', width: 100 },
]

export function ProfileSkillsInline({ skills }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [localSkills, setLocalSkills] = useState<Skill[]>(skills)
  const [masterSkills, setMasterSkills] = useState<MasterSkill[]>([])
  const [loadingMaster, setLoadingMaster] = useState(false)

  // Add modal
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState<{
    skillId: string
    proficiency: ProficiencyLevel
  }>({ skillId: '', proficiency: 'intermediate' })

  // Edit modal
  const [editId, setEditId] = useState<string | null>(null)
  const [editProficiency, setEditProficiency] = useState<ProficiencyLevel>('intermediate')

  useEffect(() => {
    setLocalSkills(skills)
  }, [skills])

  // Load master skills saat buka modal add
  useEffect(() => {
    if (!addOpen || masterSkills.length > 0) return

    async function loadMaster() {
      setLoadingMaster(true)
      try {
        const res = await fetch('/api/skills').then((r) => r.json())
        setMasterSkills(res.skills ?? [])
      } catch {
        // silent
      }
      setLoadingMaster(false)
    }
    loadMaster()
  }, [addOpen, masterSkills.length])

  function handleAdd() {
    if (!addForm.skillId) return

    startTransition(async () => {
      const result = await addStudentSkill({
        skillId: addForm.skillId,
        proficiency: addForm.proficiency,
      })

      if (result.ok) {
        // Reload
        const res = await fetch('/api/student/skills').then((r) => r.json())
        setLocalSkills(res.skills ?? [])
        setAddOpen(false)
        setAddForm({ skillId: '', proficiency: 'intermediate' })
        router.refresh()
      } else {
        alert(result.error)
      }
    })
  }

  function handleUpdate() {
    if (!editId) return

    startTransition(async () => {
      const result = await updateStudentSkill({
        id: editId,
        proficiency: editProficiency,
      })
      if (result.ok) {
        setLocalSkills((prev) =>
          prev.map((s) =>
            s.id === editId ? { ...s, proficiency: editProficiency } : s
          )
        )
        setEditId(null)
        router.refresh()
      } else {
        alert(result.error)
      }
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Hapus skill ini?')) return

    startTransition(async () => {
      const result = await deleteStudentSkill(id)
      if (result.ok) {
        setLocalSkills((prev) => prev.filter((s) => s.id !== id))
        router.refresh()
      } else {
        alert(result.error)
      }
    })
  }

  // Group by category
  const grouped = localSkills.reduce(
    (acc, s) => {
      const cat = s.category || 'Lainnya'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(s)
      return acc
    },
    {} as Record<string, Skill[]>
  )

  const availableSkills = masterSkills.filter(
    (s) => !localSkills.some((ls) => ls.skillId === s.id)
  )

  return (
    <>
      <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-on-surface">
              Skills{' '}
              <span className="text-on-surface-variant font-bold">
                ({localSkills.length})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah
          </button>
        </div>

        {localSkills.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-on-surface mb-1">
              Belum ada skill
            </p>
            <p className="text-xs text-on-surface-variant mb-4">
              Tambahkan skill biar recruiter gampang nemuin kamu
            </p>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Tambah Skill
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">
                  {category}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {items.map((skill) => {
                    const cfg =
                      PROFICIENCY_OPTIONS.find(
                        (o) => o.value === skill.proficiency
                      ) ?? PROFICIENCY_OPTIONS[1]
                    return (
                      <div
                        key={skill.id}
                        className="group p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-sm font-bold text-on-surface truncate">
                            {skill.name}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}
                            >
                              {cfg.label}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-surface-container overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                              style={{ width: `${cfg.width}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => {
                                setEditId(skill.id)
                                setEditProficiency(skill.proficiency)
                              }}
                              className="p-1 rounded text-on-surface-variant hover:bg-surface-container"
                              aria-label="Edit"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(skill.id)}
                              className="p-1 rounded text-rose-600 hover:bg-rose-50"
                              aria-label="Hapus"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Modal */}
      {addOpen && (
        <ModalShell title="Tambah Skill" onClose={() => setAddOpen(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Pilih Skill
              </label>
              {loadingMaster ? (
                <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-on-surface-variant">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memuat...
                </div>
              ) : (
                <select
                  value={addForm.skillId}
                  onChange={(e) =>
                    setAddForm({ ...addForm, skillId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
                >
                  <option value="">Pilih skill...</option>
                  {availableSkills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.category ? `(${s.category})` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PROFICIENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setAddForm({ ...addForm, proficiency: opt.value })
                    }
                    className={`p-2.5 rounded-lg border text-xs font-bold transition-colors ${
                      addForm.proficiency === opt.value
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'border-outline-variant/30 text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!addForm.skillId || isPending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Tambah
              </button>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container"
              >
                Batal
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Edit Modal */}
      {editId && (
        <ModalShell title="Ubah Level Skill" onClose={() => setEditId(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {PROFICIENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setEditProficiency(opt.value)}
                  className={`p-3 rounded-xl border text-sm font-bold transition-colors ${
                    editProficiency === opt.value
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'border-outline-variant/30 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setEditId(null)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container"
              >
                Batal
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </>
  )
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
          <h2 className="text-base font-black text-on-surface">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}