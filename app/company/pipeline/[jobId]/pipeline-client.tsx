// app/company/pipeline/[jobId]/pipeline-client.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  X,
  CheckSquare,
  Loader2,
} from 'lucide-react'
import { PipelineBoard } from '@/components/company/pipeline/pipeline-board'
import {
  updatePipelineStatusAction,
  bulkUpdateStatusAction,
} from '../actions'
import type { PipelineBoard as PipelineBoardType } from '@/lib/queries/company-pipeline'

type Props = {
  board: PipelineBoardType
}

export function PipelineClient({ board }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState('shortlisted')
  const [bulkLoading, setBulkLoading] = useState(false)
  const [optimisticColumns, setOptimisticColumns] = useState<
    Record<string, any[]> | null
  >(null)

  // Board untuk render — pakai optimistic kalau ada
  const displayBoard: PipelineBoardType = optimisticColumns
    ? { ...board, columns: optimisticColumns }
    : board

  // Filter by search
  const filteredColumns: Record<string, any[]> = {}
  for (const [status, cards] of Object.entries(displayBoard.columns)) {
    const q = search.toLowerCase()
    filteredColumns[status] = search
      ? cards.filter(
          (c) =>
            c.fullName.toLowerCase().includes(q) ||
            (c.school?.toLowerCase() ?? '').includes(q) ||
            (c.headline?.toLowerCase() ?? '').includes(q)
        )
      : cards
  }

  const filteredBoard: PipelineBoardType = {
    ...displayBoard,
    columns: filteredColumns,
  }

  const totalCards = Object.values(displayBoard.columns).reduce(
    (total, cards) => total + cards.length,
    0
  )

  // ============================================
  // SELECT
  // ============================================

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function selectAll() {
    const all = new Set<string>()
    for (const cards of Object.values(displayBoard.columns)) {
      for (const c of cards) all.add(c.applicationId)
    }
    setSelectedIds(all)
  }

  // ============================================
  // DRAG END
  // ============================================

  function moveCardOptimistically(applicationId: string, newStatus: string) {
    const newColumns: Record<string, any[]> = {}
    let movedCard: any = null

    for (const [status, cards] of Object.entries(displayBoard.columns)) {
      newColumns[status] = cards.filter((c) => {
        if (c.applicationId === applicationId) {
          movedCard = c
          return false
        }
        return true
      })
    }

    if (movedCard && newColumns[newStatus]) {
      newColumns[newStatus] = [
        { ...movedCard, status: newStatus },
        ...newColumns[newStatus],
      ]
    }

    setOptimisticColumns(newColumns)
  }

async function handleDragEnd(applicationId: string, newStatus: string) {
  // Optimistic
  moveCardOptimistically(applicationId, newStatus)

  try {
    const res = await updatePipelineStatusAction({
      applicationId,
      newStatus,
    })

    console.log('[Drag] Result:', res)

    if (!res.success) {
      alert(res.error ?? 'Gagal update status')
      setOptimisticColumns(null)  // rollback
      return
    }

    // Refresh dengan jeda biar optimistic kelihatan
    setTimeout(() => {
      setOptimisticColumns(null)
      router.refresh()
    }, 300)
  } catch (err) {
    console.error('[Drag] Error:', err)
    alert('Terjadi kesalahan')
    setOptimisticColumns(null)
  }
}

  // ============================================
  // BULK ACTION
  // ============================================

  async function handleBulkUpdate() {
  if (selectedIds.size === 0) return

  const statusLabel = {
    submitted: 'Kotak Masuk',
    reviewed: 'Ditinjau',
    shortlisted: 'Shortlist',
    interview: 'Wawancara',
    offered: 'Penawaran',
    hired: 'Diterima',
    rejected: 'Tidak Cocok',
  }[bulkStatus] ?? bulkStatus

  if (!confirm(`Update ${selectedIds.size} pelamar ke "${statusLabel}"?`))
    return

  setBulkLoading(true)

  try {
    const res = await bulkUpdateStatusAction({
      applicationIds: Array.from(selectedIds),
      newStatus: bulkStatus,
    })

    console.log('[Bulk] Result:', res)

    if (res.success) {
      clearSelection()
      setOptimisticColumns(null)  // clear optimistic
      router.refresh()            // ← refresh LANGSUNG
    } else {
      alert(res.error ?? 'Gagal bulk update')
    }
  } catch (err) {
    console.error('[Bulk] Error:', err)
    alert('Terjadi kesalahan')
  } finally {
    setBulkLoading(false)
  }
}

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            href="/company/pipeline"
            className="inline-flex items-center gap-2 text-xs font-medium text-on-surface-variant hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Semua Lowongan
          </Link>
          <h1 className="text-2xl font-black text-on-surface tracking-tight">
            {board.job.title}
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            {totalCards} pelamar di pipeline
          </p>
        </div>

        <Link
          href={`/company/jobs/${board.job.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-bold text-xs hover:bg-surface-container transition-colors"
        >
          Lihat Lowongan
        </Link>
      </div>

      {/* Search + bulk bar */}
      <div className="sticky top-16 z-20 bg-surface/80 backdrop-blur-md py-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, sekolah, atau headline..."
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
              <CheckSquare className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary whitespace-nowrap">
                {selectedIds.size} dipilih
              </span>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="px-2 py-1 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="submitted">Kotak Masuk</option>
                <option value="reviewed">Ditinjau</option>
                <option value="shortlisted">Shortlist</option>
                <option value="interview">Wawancara</option>
                <option value="offered">Penawaran</option>
                <option value="hired">Diterima</option>
                <option value="rejected">Tidak Cocok</option>
              </select>
              <button
                type="button"
                onClick={handleBulkUpdate}
                disabled={bulkLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-container disabled:opacity-60 transition-colors whitespace-nowrap"
              >
                {bulkLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  'Terapkan'
                )}
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="p-1 rounded-lg text-primary hover:bg-primary/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {selectedIds.size === 0 && (
            <button
              type="button"
              onClick={selectAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors shrink-0 whitespace-nowrap"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Pilih Semua
            </button>
          )}
        </div>
      </div>

      {/* Board */}
      <div className={isPending ? 'opacity-70 transition-opacity' : ''}>
        <PipelineBoard
          board={filteredBoard}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onDragEnd={handleDragEnd}
        />
      </div>
    </div>
  )
}