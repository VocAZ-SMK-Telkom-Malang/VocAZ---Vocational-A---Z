// components/student/profile/profile-experience-inline.tsx
'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
  MapPin,
} from 'lucide-react'
import { deleteExperience } from '@/app/actions/profile'
import { EditExperienceModal } from './edit-experience-modal'

type Experience = {
  id: string
  title: string
  companyName: string | null
  employmentType: string | null
  location: string | null
  startDate: string | null
  endDate: string | null
  isCurrent: boolean
  description: string | null
}

type Props = {
  experiences: Experience[]
}

export function ProfileExperienceInline({ experiences }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [local, setLocal] = useState(experiences)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Experience | null>(null)

  useEffect(() => {
    setLocal(experiences)
  }, [experiences])

  function handleAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function handleEdit(exp: Experience) {
    setEditing(exp)
    setModalOpen(true)
  }

  function handleDelete(id: string) {
    if (!confirm('Hapus pengalaman ini?')) return
    startTransition(async () => {
      const result = await deleteExperience(id)
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
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-on-surface">
              Pengalaman{' '}
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
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-on-surface mb-1">
              Belum ada pengalaman
            </p>
            <p className="text-xs text-on-surface-variant mb-4">
              Tambahkan pengalaman magang / kerja kamu
            </p>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Tambah Pengalaman
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {local.map((exp) => (
              <div
                key={exp.id}
                className="group flex items-start gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface">
                    {exp.title}
                  </p>
                  {exp.companyName && (
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {exp.companyName}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-on-surface-variant">
                    {exp.startDate && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(exp.startDate).toLocaleDateString('id-ID', {
                          month: 'short',
                          year: 'numeric',
                        })}
                        {' - '}
                        {exp.isCurrent
                          ? 'Sekarang'
                          : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString(
                                'id-ID',
                                { month: 'short', year: 'numeric' }
                              )
                            : '-'}
                      </span>
                    )}
                    {exp.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleEdit(exp)}
                    className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
                    aria-label="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(exp.id)}
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
        <EditExperienceModal
          existing={editing ?? undefined}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}