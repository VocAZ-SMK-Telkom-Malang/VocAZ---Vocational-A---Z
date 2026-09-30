// components/student/profile/profile-portfolio-section.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Image as ImageIcon,
  Pencil,
  Trash2,
  ArrowUpRight,
} from 'lucide-react'
import { PortfolioModal } from './portfolio-modal'
import { deletePortfolio } from '@/app/actions/portfolio'
import { useRouter } from 'next/navigation'

type Portfolio = {
  id: string
  title: string
  description: string | null
  projectUrl: string | null
  thumbnailUrl: string | null
  thumbnailKey: string | null   // ← TAMBAH INI
  startDate: string | null
  endDate: string | null
  media: {
    id: string
    url: string
    key: string
    mediaType: string
  }[]
}

type Props = {
  portfolios: Portfolio[]
}

export function ProfilePortfolioSection({ portfolios }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Portfolio | null>(null)

  function handleAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function handleEdit(p: Portfolio) {
    setEditing(p)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus project ini?')) return
    const result = await deletePortfolio(id)
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
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-on-surface">
              Portfolio & Project{' '}
              <span className="text-on-surface-variant font-bold">
                ({portfolios.length})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Project
          </button>
        </div>

        {portfolios.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-on-surface mb-1">
              Belum ada project
            </p>
            <p className="text-xs text-on-surface-variant mb-4">
              Upload project yang pernah kamu buat biar recruiter bisa lihat
            </p>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Tambah Project Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((p) => (
              <div
                key={p.id}
                className="group relative rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-colors"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-surface-container relative overflow-hidden">
                  {p.thumbnailUrl ? (
                    <img
                      src={p.thumbnailUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : p.media[0] ? (
                    <img
                      src={p.media[0].url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  {/* Media count badge */}
                  {p.media.length > 0 && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold">
                      {p.media.length} foto
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-sm font-bold text-on-surface line-clamp-2">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/20">
                    {p.projectUrl ? (
                      <a
                        href={p.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                      >
                        Lihat Project
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-on-surface-variant">
                        No link
                      </span>
                    )}

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="p-1 rounded text-on-surface-variant hover:bg-surface-container"
                        aria-label="Edit"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50"
                        aria-label="Hapus"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {modalOpen && (
        <PortfolioModal
          existing={editing ?? undefined}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}