// components/student/profile/profile-education-inline.tsx
'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react'
import { deleteEducation } from '@/app/actions/profile'
import { EditEducationModal } from './edit-education-modal'

type Education = {
  id: string
  schoolName: string
  major: string | null
  degree: string | null
  startYear: number | null
  endYear: number | null
  gpa: number | null
  description: string | null
}

type Props = {
  educations: Education[]
}

export function ProfileEducationInline({ educations }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [local, setLocal] = useState(educations)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Education | null>(null)

  useEffect(() => {
    setLocal(educations)
  }, [educations])

  function handleAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function handleEdit(edu: Education) {
    setEditing(edu)
    setModalOpen(true)
  }

  function handleDelete(id: string) {
    if (!confirm('Hapus pendidikan ini?')) return
    startTransition(async () => {
      const result = await deleteEducation(id)
      if (result.ok) {
        setLocal((prev) => prev.filter((e) => e.id !== id))
        router.refresh()
      } else {
        alert(result.error)
      }
    })
  }

  return (
    <>
      <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-on-surface">
              Pendidikan{' '}
              <span className="text-on-surface-variant font-bold">
                ({local.length})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah
          </button>
        </div>

        {local.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-on-surface mb-1">
              Belum ada pendidikan
            </p>
            <p className="text-xs text-on-surface-variant mb-4">
              Tambahkan riwayat pendidikan kamu
            </p>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Tambah Pendidikan
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {local.map((edu) => (
              <div
                key={edu.id}
                className="group flex items-start gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface">
                    {edu.schoolName}
                  </p>
                  {edu.major && (
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {edu.major}
                      {edu.degree ? ` · ${edu.degree}` : ''}
                    </p>
                  )}
                  {(edu.startYear || edu.endYear) && (
                    <p className="text-[10px] text-on-surface-variant mt-1.5">
                      {edu.startYear ?? '?'} - {edu.endYear ?? 'Sekarang'}
                      {edu.gpa ? ` · IPK ${edu.gpa}` : ''}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleEdit(edu)}
                    className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
                    aria-label="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(edu.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                    aria-label="Hapus"
                  >
                    {isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {modalOpen && (
        <EditEducationModal
          existing={editing ?? undefined}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}