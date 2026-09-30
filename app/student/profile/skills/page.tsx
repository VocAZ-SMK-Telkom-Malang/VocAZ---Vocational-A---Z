// app/student/profile/skills/page.tsx
'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Award,
  Plus,
  Trash2,
  Pencil,
  X,
  Loader2,
  Sparkles,
  Check,
} from 'lucide-react'
import {
  addStudentSkill,
  deleteStudentSkill,
  updateStudentSkill,
} from '@/app/actions/profile'

type Skill = {
  id: string
  name: string
  category: string | null
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

type StudentSkill = {
  id: string
  skillId: string
  name: string
  category: string | null
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

const PROFICIENCY_OPTIONS = [
  { value: 'beginner', label: 'Beginner', color: 'text-slate-700' },
  { value: 'intermediate', label: 'Intermediate', color: 'text-blue-700' },
  { value: 'advanced', label: 'Advanced', color: 'text-indigo-700' },
  { value: 'expert', label: 'Expert', color: 'text-emerald-700' },
] as const

export default function SkillsPage() {
  const [mySkills, setMySkills] = useState<StudentSkill[]>([])
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Add modal
  const [addOpen, setAddOpen] = useState(false)
  type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

    const [addForm, setAddForm] = useState<{
        skillId: string
        proficiency: ProficiencyLevel
        }>({
        skillId: '',
        proficiency: 'intermediate',
        })

  // Edit modal
  const [editId, setEditId] = useState<string | null>(null)
  const [editProficiency, setEditProficiency] = useState<
    'beginner' | 'intermediate' | 'advanced' | 'expert'
  >('intermediate')

  // ============================================
  // LOAD DATA
  // ============================================
  useEffect(() => {
    async function load() {
      const [skillsData, allData] = await Promise.all([
        fetch('/api/student/skills').then((r) => r.json()),
        fetch('/api/skills').then((r) => r.json()),
      ])
      setMySkills(skillsData.skills ?? [])
      setAllSkills(allData.skills ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // ============================================
  // ADD
  // ============================================
  function handleAdd() {
    if (!addForm.skillId) return

    startTransition(async () => {
      const result = await addStudentSkill(addForm)
      if (result.ok) {
        // Reload
        const res = await fetch('/api/student/skills').then((r) => r.json())
        setMySkills(res.skills ?? [])
        setAddOpen(false)
        setAddForm({ skillId: '', proficiency: 'intermediate' })
      } else {
        alert(result.error)
      }
    })
  }

  // ============================================
  // UPDATE
  // ============================================
  function handleUpdate() {
    if (!editId) return

    startTransition(async () => {
      const result = await updateStudentSkill({
        id: editId,
        proficiency: editProficiency,
      })
      if (result.ok) {
        const res = await fetch('/api/student/skills').then((r) => r.json())
        setMySkills(res.skills ?? [])
        setEditId(null)
      } else {
        alert(result.error)
      }
    })
  }

  // ============================================
  // DELETE
  // ============================================
  function handleDelete(id: string) {
    if (!confirm('Hapus skill ini?')) return

    startTransition(async () => {
      const result = await deleteStudentSkill(id)
      if (result.ok) {
        setMySkills((prev) => prev.filter((s) => s.id !== id))
      } else {
        alert(result.error)
      }
    })
  }

  // Group by category
  const grouped = mySkills.reduce(
    (acc, s) => {
      const cat = s.category || 'Lainnya'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(s)
      return acc
    },
    {} as Record<string, StudentSkill[]>
  )

  // Skills yang belum di-add
  const availableSkills = allSkills.filter(
    (s) => !mySkills.some((ms) => ms.skillId === s.id)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Link
        href="/student/profile"
        className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Profile
      </Link>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50/60 via-surface-container-lowest to-surface-container-lowest border border-outline-variant/30 p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-3">
              <Award className="w-3 h-3" />
              Kelola Skills
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
              Skills Saya
            </h1>
            <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
              Tambah skill yang kamu kuasai biar recruiter gampang nemuin kamu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 shrink-0 shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Tambah Skill
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PROFICIENCY_OPTIONS.map((opt) => {
          const count = mySkills.filter((s) => s.proficiency === opt.value).length
          return (
            <div
              key={opt.value}
              className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30"
            >
              <p className="text-2xl font-black text-on-surface leading-none">
                {count}
              </p>
              <p className={`text-[11px] font-bold uppercase tracking-wider mt-1 ${opt.color}`}>
                {opt.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : mySkills.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-black text-on-surface mb-1">
            Belum ada skill
          </h3>
          <p className="text-sm text-on-surface-variant mb-5">
            Tambah skill biar profile kamu lebih menarik
          </p>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Tambah Skill Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category} className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-5">
              <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {skills.map((skill) => {
                  const cfg = PROFICIENCY_OPTIONS.find(
                    (o) => o.value === skill.proficiency
                  )
                  return (
                    <div
                      key={skill.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 group hover:border-primary/30 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-on-surface">
                          {skill.name}
                        </p>
                        <p className={`text-[11px] font-semibold mt-0.5 ${cfg?.color}`}>
                          {cfg?.label}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            setEditId(skill.id)
                            setEditProficiency(skill.proficiency)
                          }}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(skill.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          aria-label="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {addOpen && (
        <Modal title="Tambah Skill" onClose={() => setAddOpen(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Pilih Skill
              </label>
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
                    className={`p-3 rounded-xl border text-sm font-bold transition-colors ${
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
        </Modal>
      )}

      {/* Edit Modal */}
      {editId && (
        <Modal title="Ubah Level Skill" onClose={() => setEditId(null)}>
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
        </Modal>
      )}
    </div>
  )
}

function Modal({
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