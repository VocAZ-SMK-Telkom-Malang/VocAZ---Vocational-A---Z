'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, MapPin, Trash2, Loader2 } from 'lucide-react'
import { deleteProvince } from '@/lib/admin/actions'
import { ProvinceCreateModal } from '@/components/admin/master-data/province-create-modal'

type Province = {
  id: string
  name: string
  code: string | null
  isActive: boolean
  _count: { cities: number }
}

export function ProvincesClient({ provinces }: { provinces: Province[] }) {
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
              Provinsi
            </h1>
            <p className="text-sm text-on-surface-variant">
              {provinces.length} provinsi terdaftar
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
                  Kode
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {provinces.map((province) => (
                <ProvinceRow key={province.id} province={province} />
              ))}
            </tbody>
          </table>
        </div>

        {provinces.length === 0 && (
          <div className="py-16 text-center">
            <MapPin className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
            <p className="text-sm text-on-surface-variant">
              Belum ada provinsi.
            </p>
          </div>
        )}
      </div>

      {showCreate && (
        <ProvinceCreateModal onClose={() => setShowCreate(false)} />
      )}
    </>
  )
}

function ProvinceRow({ province }: { province: Province }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDelete, setShowDelete] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      await deleteProvince(province.id)
      setShowDelete(false)
      router.refresh()
    })
  }

  return (
    <>
      <tr className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-container-low/50 transition-colors">
        <td className="px-4 py-3">
          <span className="text-sm font-semibold text-on-surface">
            {province.name}
          </span>
        </td>
        <td className="px-4 py-3">
          {province.code && (
            <code className="text-xs font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
              {province.code}
            </code>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-1">
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
          <td colSpan={3}>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowDelete(false)}
              />
              <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <h3 className="font-display text-lg font-bold text-on-surface mb-2">
                  Hapus Provinsi?
                </h3>
                <p className="text-sm text-on-surface-variant mb-4">
                  Provinsi <strong>{province.name}</strong> akan dihapus.
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