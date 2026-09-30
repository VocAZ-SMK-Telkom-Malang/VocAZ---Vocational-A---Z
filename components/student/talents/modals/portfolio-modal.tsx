// components/student/talents/modals/portfolio-modal.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  X,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

type Portfolio = {
  id: string
  title: string
  description: string | null
  projectUrl: string | null
  thumbnailUrl: string | null
  startDate: string | null
  endDate: string | null
  media: { id: string; url: string; type: string }[]
}

type Props = {
  portfolio: Portfolio
  onClose: () => void
}

export function PortfolioModal({ portfolio, onClose }: Props) {
  const allImages = [
    ...(portfolio.thumbnailUrl ? [portfolio.thumbnailUrl] : []),
    ...portfolio.media.map((m) => m.url),
  ]
  const uniqueImages = Array.from(new Set(allImages))

  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight')
        setActiveIdx((i) => Math.min(uniqueImages.length - 1, i + 1))
      if (e.key === 'ArrowLeft') setActiveIdx((i) => Math.max(0, i - 1))
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, uniqueImages.length])

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-outline-variant/30 shrink-0">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-primary mb-1">
              Project
            </p>
            <h2 className="text-lg font-black text-on-surface line-clamp-2">
              {portfolio.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Main image */}
          {uniqueImages.length > 0 && (
            <div className="relative aspect-video bg-black">
              <img
                src={uniqueImages[activeIdx]}
                alt={portfolio.title}
                className="w-full h-full object-contain"
              />

              {uniqueImages.length > 1 && (
                <>
                  {activeIdx > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveIdx((i) => i - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                      aria-label="Sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  {activeIdx < uniqueImages.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveIdx((i) => i + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                      aria-label="Berikutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  {/* Counter */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold">
                    {activeIdx + 1} / {uniqueImages.length}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-6 space-y-5">
            {/* Description */}
            {portfolio.description && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">
                  Deskripsi
                </h3>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                  {portfolio.description}
                </p>
              </div>
            )}

            {/* Thumbnails row */}
            {uniqueImages.length > 1 && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">
                  Galeri ({uniqueImages.length})
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {uniqueImages.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={`shrink-0 w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        idx === activeIdx
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-outline-variant/30 hover:border-primary/40'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${portfolio.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
              {(portfolio.startDate || portfolio.endDate) && (
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                    Timeline
                  </h3>
                  <p className="inline-flex items-center gap-1.5 text-sm text-on-surface">
                    <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                    {portfolio.startDate && (
                      <>
                        {new Date(portfolio.startDate).toLocaleDateString(
                          'id-ID',
                          { month: 'short', year: 'numeric' }
                        )}
                      </>
                    )}
                    {portfolio.startDate && portfolio.endDate && ' - '}
                    {portfolio.endDate && (
                      <>
                        {new Date(portfolio.endDate).toLocaleDateString('id-ID', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </>
                    )}
                  </p>
                </div>
              )}

              {portfolio.projectUrl && (
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                    Link Project
                  </h3>
                  <a
                    href={portfolio.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                  >
                    Buka Project
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}