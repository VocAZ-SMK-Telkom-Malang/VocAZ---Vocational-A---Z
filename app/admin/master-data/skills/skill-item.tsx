'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, Users, Briefcase } from 'lucide-react'
import { deleteSkill } from '@/lib/admin/actions'

type Skill = {
  id: string
  name: string
  category: string | null
  _count: { students: number; jobSkills: number }
}

export function SkillItem({ skill }: { skill: Skill }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDelete, setShowDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteSkill(skill.id)
      if (!result.ok) {
        setError(result.error || 'Gagal')
        return
      }
      setShowDelete(false)
      router.refresh()
    })
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-outline-variant/30 p-4 hover:border-primary/30 transition-colors group">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-semibold text-on-surface truncate">
            {skill.name}
          </p>
          <button
            onClick={() => setShowDelete(true)}
            disabled={isPending}
            className="p-1.5 rounded text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {skill._count.students}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {skill._count.jobSkills}
          </span>
        </div>
      </div>

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDelete(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-display text-lg font-bold text-on-surface mb-2">
              Hapus Skill?
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Skill <strong>{skill.name}</strong> akan dihapus permanen.
            </p>
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDelete(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-surface-container transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-5 py-2 text-sm font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}