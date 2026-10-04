// app/school/partners/partners-client.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  Plus,
  Building2,
  CheckCircle2,
  Briefcase,
  Trophy,
  X,
  Loader2,
  MapPin,
  Trash2,
  MoreVertical,
  Calendar,
} from 'lucide-react'
import {
  addPartnerAction,
  removePartnerAction,
  updatePartnerAction,
} from './actions'

type Partner = {
  id: string
  partnershipType: string
  status: string
  startDate: string | null
  endDate: string | null
  notes: string | null
  createdAt: string
  company: {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    industry: string | null
    city: string | null
    isVerified: boolean
    activeJobsCount: number
    hiredCount: number
  }
}

type AvailableCompany = {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  industry: string | null
  city: string | null
}

type Props = {
  partners: Partner[]
  stats: {
    total: number
    active: number
    mou: number
    companies: number
  }
  availableCompanies: AvailableCompany[]
  filters: { search: string; type: string; status: string }
  canEdit: boolean
}

const TYPE_LABEL: Record<string, string> = {
  mou: 'MoU',
  internship: 'Magang',
  recruitment: 'Rekrutmen',
  training: 'Pelatihan',
}

const TYPE_STYLE: Record<string, string> = {
  mou: 'bg-primary/10 text-primary',
  internship: 'bg-blue-100 text-blue-700',
  recruitment: 'bg-amber-100 text-amber-700',
  training: 'bg-purple-100 text-purple-700',
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Aktif',
  expired: 'Kadaluarsa',
  terminated: 'Dihentikan',
}

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  expired: 'bg-slate-100 text-slate-700',
  terminated: 'bg-rose-100 text-rose-700',
}

export function SchoolPartnersClient({
  partners,
  stats,
  availableCompanies,
  filters: initialFilters,
  canEdit,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(initialFilters.search)
  const [type, setType] = useState(initialFilters.type)
  const [status, setStatus] = useState(initialFilters.status)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set(key, value)
    else params.delete(key)
    startTransition(() => {
      router.push(`/school/partners?${params.toString()}`)
    })
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    applyFilter('q', search)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-on-surface">
            Partner Industri
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola hubungan sekolah dengan perusahaan partner.
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-md hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Partner
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatPill
          icon={Building2}
          label="Total Partner"
          value={stats.total}
          color="bg-primary/10 text-primary"
        />
        <StatPill
          icon={CheckCircle2}
          label="Aktif"
          value={stats.active}
          color="bg-emerald-100 text-emerald-700"
        />
        <StatPill
          icon={Briefcase}
          label="MoU"
          value={stats.mou}
          color="bg-blue-100 text-blue-700"
        />
        <StatPill
          icon={Trophy}
          label="Perusahaan Unik"
          value={stats.companies}
          color="bg-amber-100 text-amber-700"
        />
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama perusahaan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Cari
          </button>
        </form>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Type filter */}
          <div className="flex gap-1.5 overflow-x-auto">
            {[
              { value: 'all', label: 'Semua Jenis' },
              { value: 'mou', label: 'MoU' },
              { value: 'internship', label: 'Magang' },
              { value: 'recruitment', label: 'Rekrutmen' },
              { value: 'training', label: 'Pelatihan' },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setType(t.value)
                  applyFilter('type', t.value)
                }}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap
                  ${
                    type === t.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }
                `}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              applyFilter('status', e.target.value)
            }}
            className="px-3 py-1.5 rounded-full bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-xs font-bold"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="expired">Kadaluarsa</option>
            <option value="terminated">Dihentikan</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {isPending && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      )}

      {/* List */}
      {!isPending && partners.length === 0 ? (
        <EmptyState
          canEdit={canEdit}
          onAdd={() => setShowAddModal(true)}
          hasFilters={
            !!search || type !== 'all' || status !== 'all'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {partners.map((p) => (
            <PartnerCard
              key={p.id}
              partner={p}
              canEdit={canEdit}
              onManage={() => setSelectedPartner(p)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddPartnerModal
          companies={availableCompanies}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            router.refresh()
          }}
        />
      )}

      {selectedPartner && (
        <ManagePartnerModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
          onSuccess={() => {
            setSelectedPartner(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}

// ============================================
// PARTNER CARD
// ============================================

function PartnerCard({
  partner,
  canEdit,
  onManage,
}: {
  partner: Partner
  canEdit: boolean
  onManage: () => void
}) {
  const typeStyle = TYPE_STYLE[partner.partnershipType] ?? TYPE_STYLE.mou
  const typeLabel = TYPE_LABEL[partner.partnershipType] ?? partner.partnershipType

  const statusStyle = STATUS_STYLE[partner.status] ?? STATUS_STYLE.active
  const statusLabel = STATUS_LABEL[partner.status] ?? partner.status

  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-3 mb-4">
        {partner.company.logoUrl ? (
          <img
            src={partner.company.logoUrl}
            alt={partner.company.name}
            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-outline-variant/30"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-black text-on-surface truncate">
              {partner.company.name}
            </h3>
            {partner.company.isVerified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            )}
          </div>
          {partner.company.industry && (
            <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
              {partner.company.industry}
            </p>
          )}
          {partner.company.city && (
            <span className="inline-flex items-center gap-1 text-[10px] text-on-surface-variant mt-1">
              <MapPin className="w-2.5 h-2.5" />
              {partner.company.city}
            </span>
          )}
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={onManage}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
            aria-label="Kelola partner"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        <span
          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${typeStyle}`}
        >
          {typeLabel}
        </span>
        <span
          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${statusStyle}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-outline-variant/30">
        <div>
          <div className="text-lg font-black text-on-surface font-mono leading-none">
            {partner.company.activeJobsCount}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1">
            Lowongan
          </div>
        </div>
        <div>
          <div className="text-lg font-black text-emerald-600 font-mono leading-none">
            {partner.company.hiredCount}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1">
            Diterima
          </div>
        </div>
      </div>

      {partner.startDate && (
        <div className="mt-3 pt-3 border-t border-outline-variant/30">
          <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-mono">
            <Calendar className="w-3 h-3" />
            {new Date(partner.startDate).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            {partner.endDate && (
              <>
                {' — '}
                {new Date(partner.endDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </>
            )}
          </div>
        </div>
      )}

      {partner.notes && (
        <p className="text-[11px] text-on-surface-variant mt-3 line-clamp-2 leading-relaxed">
          {partner.notes}
        </p>
      )}
    </div>
  )
}

// ============================================
// ADD PARTNER MODAL
// ============================================

function AddPartnerModal({
  companies,
  onClose,
  onSuccess,
}: {
  companies: AvailableCompany[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [type, setType] = useState<'mou' | 'internship' | 'recruitment' | 'training'>('mou')
  const [status, setStatus] = useState<'active' | 'expired' | 'terminated'>('active')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filtered = search.trim()
    ? companies.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.industry ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : companies

  async function handleSubmit() {
    if (!selectedId) {
      setError('Pilih perusahaan dulu')
      return
    }
    setSaving(true)
    setError(null)

    try {
      const res = await addPartnerAction({
        companyId: selectedId,
        partnershipType: type,
        status,
        startDate: startDate || null,
        endDate: endDate || null,
        notes: notes.trim() || null,
      })
      if (!res.ok) {
        setError(res.error ?? 'Gagal menambah')
        return
      }
      onSuccess()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ModalShell onClose={onClose} title="Tambah Partner Industri">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari perusahaan..."
            autoFocus
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
          />
        </div>

        <div className="max-h-64 overflow-y-auto rounded-xl border border-outline-variant/30 divide-y divide-outline-variant/30">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-on-surface-variant">
              Tidak ada perusahaan tersedia
            </div>
          ) : (
            filtered.map((c) => {
              const isSelected = selectedId === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={`
                    w-full flex items-center gap-3 p-3 text-left transition-colors
                    ${
                      isSelected
                        ? 'bg-primary/5'
                        : 'hover:bg-surface-container-low'
                    }
                  `}
                >
                  {c.logoUrl ? (
                    <img
                      src={c.logoUrl}
                      alt={c.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-on-surface truncate">
                      {c.name}
                    </div>
                    {c.industry && (
                      <div className="text-[11px] text-on-surface-variant truncate">
                        {c.industry}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Type + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              Jenis Kerja Sama
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
            >
              <option value="mou">MoU</option>
              <option value="internship">Magang</option>
              <option value="recruitment">Rekrutmen</option>
              <option value="training">Pelatihan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
            >
              <option value="active">Aktif</option>
              <option value="expired">Kadaluarsa</option>
              <option value="terminated">Dihentikan</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface mb-2">
            Catatan (opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Catatan tentang kerja sama ini..."
            className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm resize-none"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || !selectedId}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {saving ? 'Menambah...' : 'Tambah Partner'}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

// ============================================
// MANAGE PARTNER MODAL
// ============================================

function ManagePartnerModal({
  partner,
  onClose,
  onSuccess,
}: {
  partner: Partner
  onClose: () => void
  onSuccess: () => void
}) {
  const [type, setType] = useState(partner.partnershipType)
  const [status, setStatus] = useState(partner.status)
  const [startDate, setStartDate] = useState(
    partner.startDate ? partner.startDate.slice(0, 10) : ''
  )
  const [endDate, setEndDate] = useState(
    partner.endDate ? partner.endDate.slice(0, 10) : ''
  )
  const [notes, setNotes] = useState(partner.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await updatePartnerAction({
        id: partner.id,
        partnershipType: type as any,
        status: status as any,
        startDate: startDate || null,
        endDate: endDate || null,
        notes: notes.trim() || null,
      })
      if (!res.ok) {
        setError(res.error ?? 'Gagal menyimpan')
        return
      }
      onSuccess()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove() {
    if (!confirm('Yakin hapus partner ini?')) return
    setRemoving(true)
    try {
      const res = await removePartnerAction(partner.id)
      if (!res.ok) {
        setError(res.error ?? 'Gagal menghapus')
        return
      }
      onSuccess()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <ModalShell onClose={onClose} title={partner.company.name}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
          {partner.company.logoUrl ? (
            <img
              src={partner.company.logoUrl}
              alt={partner.company.name}
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-bold text-on-surface truncate">
              {partner.company.name}
            </div>
            {partner.company.industry && (
              <div className="text-[11px] text-on-surface-variant truncate">
                {partner.company.industry}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              Jenis Kerja Sama
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
            >
              <option value="mou">MoU</option>
              <option value="internship">Magang</option>
              <option value="recruitment">Rekrutmen</option>
              <option value="training">Pelatihan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
            >
              <option value="active">Aktif</option>
              <option value="expired">Kadaluarsa</option>
              <option value="terminated">Dihentikan</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface mb-2">
            Catatan
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm resize-none"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors"
          >
            {removing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Hapus
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  )
}

// ============================================
// SHARED
// ============================================

function ModalShell({
  children,
  title,
  onClose,
}: {
  children: React.ReactNode
  title: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 shrink-0">
          <h2 className="text-base font-black text-on-surface">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

function StatPill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3.5 flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-black text-on-surface leading-none">
          {value}
        </div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1 truncate">
          {label}
        </div>
      </div>
    </div>
  )
}

function EmptyState({
  canEdit,
  onAdd,
  hasFilters,
}: {
  canEdit: boolean
  onAdd: () => void
  hasFilters: boolean
}) {
  return (
    <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-lowest p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
        <Building2 className="w-6 h-6 text-on-surface-variant" />
      </div>
      <h3 className="text-sm font-bold text-on-surface mb-1">
        {hasFilters
          ? 'Tidak ada partner cocok'
          : 'Belum ada partner industri'}
      </h3>
      <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-4">
        {hasFilters
          ? 'Coba ubah filter atau reset untuk lihat semua partner.'
          : 'Tambahkan perusahaan yang bekerja sama dengan sekolah kamu.'}
      </p>
      {canEdit && !hasFilters && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Partner Pertama
        </button>
      )}
    </div>
  )
}