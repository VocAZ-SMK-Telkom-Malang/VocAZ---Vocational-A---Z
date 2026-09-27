'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react'
import { updateSchoolPrograms } from '@/lib/admin/actions'

type Program = {
  name: string
  code: string
}

export function SchoolProgramsClient({
  initialPrograms,
}: {
  initialPrograms: Program[]
}) {
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>(initialPrograms)
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function addProgram() {
    if (newName.trim().length < 2 || newCode.trim().length < 1) {
      setError('Nama & kode wajib diisi')
      return
    }

    setPrograms([...programs, { name: newName.trim(), code: newCode.trim().toUpperCase() }])
    setNewName('')
    setNewCode('')
    setError(null)
  }

  function removeProgram(index: number) {
    setPrograms(programs.filter((_, i) => i !== index))
  }

  function handleSave() {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await updateSchoolPrograms({ programs })
      if (!result.ok) {
        setError(result.error || 'Gagal')
        return
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      router.refresh()
    })
  }

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
              Program Keahlian SMK
            </h1>
            <p className="text-sm text-on-surface-variant">
              {programs.length} program terdaftar
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white text-sm font-semibold shadow-[0_4px_16px_rgba(220,38,38,0.25)] hover:brightness-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{success ? 'Tersimpan' : 'Simpan'}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl mb-4">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama program (contoh: Rekayasa Perangkat Lunak)"
            className="px-3 py-2 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <input
            type="text"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="Kode (RPL)"
            maxLength={10}
            className="px-3 py-2 rounded-lg border border-outline-variant/50 text-sm font-mono uppercase focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <button
            type="button"
            onClick={addProgram}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-surface-tint transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Kode
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Nama Program
              </th>
              <th className="text-right px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program, index) => (
              <tr
                key={`${program.code}-${index}`}
                className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-container-low/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded font-bold">
                    {program.code}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-on-surface">
                    {program.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeProgram(index)}
                    className="p-2 rounded-lg text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {programs.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-on-surface-variant">
              Belum ada program keahlian.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-on-surface-variant text-center mt-6">
        Jangan lupa klik <strong>Simpan</strong> untuk menyimpan perubahan.
      </p>
    </>
  )
}