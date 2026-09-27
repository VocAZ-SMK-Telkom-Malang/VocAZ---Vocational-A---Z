'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Building2, Power, Trash2, Loader2 } from 'lucide-react'
import { toggleIndustryActive, deleteIndustry } from '@/lib/admin/actions'
import { IndustryCreateModal } from '@/components/admin/master-data/industry-create-modal'

type Industry = {
  id: string
  name: string
  slug: string
  icon: string | null
  isActive: boolean
}

export function IndustriesClient({ industries }: { industries: Industry[] }) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)

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
              Industri
            </h1>
            <p className="text-sm text-on-surface-variant">
              {industries.length} industri terdaftar
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white text-sm font-semibold shadow-[0_4px_16px_rgba(220,38,38,0.25)] hover:brightness-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-surface-container-low border-b border-outline-variant/30">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Nama
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Slug
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {industries.map((industry) => (
                <IndustryRow key={industry.id} industry={industry} />
              ))}
            </tbody>
          </table>
        </div>

        {industries.length === 0 && (
          <div className="py-16 text-center">
            <Building2 className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
            <p className="text-sm text-on-surface-variant">
              Belum ada industri.
            </p>
          </div>
        )}
      </div>

      {showCreate && (
        <IndustryCreateModal onClose={() => setShowCreate(false)} />
      )}
    </>
  )
}

function IndustryRow({ industry }: { industry: Industry }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDelete, setShowDelete] = useState(false)

  function handleToggle() {
    startTransition(async () => {
      await toggleIndustryActive(industry.id)
      router.refresh()
    })
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteIndustry(industry.id)
      setShowDelete(false)
      router.refresh()
    })
  }

  return (
    <>
      <tr className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-container-low/50 transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-on-surface">
              {industry.name}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <code className="text-xs font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
            {industry.slug}
          </code>
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
              industry.isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {industry.isActive ? 'Aktif' : 'Nonaktif'}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={handleToggle}
              disabled={isPending}
              title={industry.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Power className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setShowDelete(true)}
              disabled={isPending}
              title="Hapus"
              className="p-2 rounded-lg text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {showDelete && (
        <tr>
          <td colSpan={4}>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowDelete(false)}
              />
              <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <h3 className="font-display text-lg font-bold text-on-surface mb-2">
                  Hapus Industri?
                </h3>
                <p className="text-sm text-on-surface-variant mb-4">
                  Industri <strong>{industry.name}</strong> akan dihapus.
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowDelete(false)}
                    className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-surface-container transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-5 py-2 text-sm font-semibold rounded-full bg-red-600 text-white hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}