// components/student/profile/profile-achievements-section.tsx
'use client'

import { useState } from 'react'
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Medal,
} from 'lucide-react'
import { AchievementModal } from './achievement-modal'
import { deleteAchievement } from '@/app/actions/portfolio'
import { useRouter } from 'next/navigation'

type Achievement = {
  id: string
  title: string
  issuer: string | null
  level: string | null
  dateAchieved: string | null
  description: string | null
  certificateUrl: string | null
  certificateKey: string | null   // ← TAMBAH INI
}

type Props = {
  achievements: Achievement[]
}

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  school: { label: 'Sekolah', color: 'bg-slate-100 text-slate-700' },
  regional: { label: 'Regional', color: 'bg-blue-100 text-blue-700' },
  national: { label: 'Nasional', color: 'bg-amber-100 text-amber-700' },
  international: { label: 'Internasional', color: 'bg-purple-100 text-purple-700' },
}

export function ProfileAchievementsSection({ achievements }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Achievement | null>(null)

  function handleAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function handleEdit(a: Achievement) {
    setEditing(a)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus prestasi ini?')) return
    const result = await deleteAchievement(id)
    if (result.ok) {
      router.refresh()
    } else {
      alert(result.error)
    }
  }

  return (
    <>
      <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-on-surface">
              Prestasi{' '}
              <span className="text-on-surface-variant font-bold">
                ({achievements.length})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Prestasi
          </button>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-on-surface mb-1">
              Belum ada prestasi
            </p>
            <p className="text-xs text-on-surface-variant mb-4">
              Catat prestasi akademik & non-akademik kamu
            </p>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Tambah Prestasi Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((a) => {
              const levelCfg = a.level ? LEVEL_CONFIG[a.level] : null

              return (
                <div
                  key={a.id}
                  className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-colors group"
                >
                  {a.certificateUrl ? (
                    <img
                      src={a.certificateUrl}
                      alt={a.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                      <Medal className="w-7 h-7" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface line-clamp-2">
                      {a.title}
                    </p>
                    {a.issuer && (
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {a.issuer}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {levelCfg && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${levelCfg.color}`}
                        >
                          {levelCfg.label}
                        </span>
                      )}
                      {a.dateAchieved && (
                        <span className="text-[10px] text-on-surface-variant">
                          {new Date(a.dateAchieved).toLocaleDateString('id-ID', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {a.certificateUrl && (
                      <a
                        href={a.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-on-surface-variant hover:bg-surface-container"
                        aria-label="Lihat bukti"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEdit(a)}
                      className="p-1 rounded text-on-surface-variant hover:bg-surface-container"
                      aria-label="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="p-1 rounded text-rose-600 hover:bg-rose-50"
                      aria-label="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {modalOpen && (
        <AchievementModal
          existing={editing ?? undefined}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}