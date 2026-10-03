// app/school/students/students-client.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type {
  SchoolStudentRow,
  SchoolStudentFilterOptions,
  SchoolStudentStats,
} from '@/lib/queries/school-students'

// ============================================
// TYPES
// ============================================

type Pagination = {
  page: number
  totalPages: number
  total: number
}

type Filters = {
  search: string
  status: string
  programId: string
  year: string
}

type Props = {
  students: SchoolStudentRow[]
  pagination: Pagination
  filters: Filters
  options: SchoolStudentFilterOptions
  stats: SchoolStudentStats
}

// ============================================
// COMPONENT
// ============================================

export function SchoolStudentsClient({
  students,
  pagination,
  filters,
  options,
  stats,
}: Props) {
  const [search, setSearch] = useState(filters.search)

  function buildUrl(overrides: Partial<Filters & { page: number }>) {
    const params = new URLSearchParams()
    const merged = { ...filters, page: pagination.page, ...overrides }
    if (merged.search) params.set('search', merged.search)
    if (merged.status && merged.status !== 'all') params.set('status', merged.status)
    if (merged.programId) params.set('program', merged.programId)
    if (merged.year) params.set('year', merged.year)
    if (merged.page && merged.page > 1) params.set('page', String(merged.page))
    return `/school/students?${params.toString()}`
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Siswa" value={stats.total} color="text-primary" />
        <StatCard icon={<GraduationCap className="w-5 h-5" />} label="Lulus" value={stats.graduated} color="text-tertiary" />
        <StatCard icon={<Briefcase className="w-5 h-5" />} label="Terserap" value={stats.placed} color="text-emerald-600" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Aktif" value={stats.active} color="text-amber-600" />
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <form
            action="/school/students"
            method="GET"
            className="flex-1 relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              name="search"
              defaultValue={filters.search}
              placeholder="Cari nama siswa..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {filters.status !== 'all' && (
              <input type="hidden" name="status" value={filters.status} />
            )}
            {filters.programId && (
              <input type="hidden" name="program" value={filters.programId} />
            )}
            {filters.year && <input type="hidden" name="year" value={filters.year} />}
          </form>

          {/* Status filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'graduated', 'dropped'].map((s) => (
              <Link
                key={s}
                href={buildUrl({ status: s, page: 1 })}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  filters.status === s || (s === 'all' && !filters.status)
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {s === 'all' ? 'Semua' : s === 'active' ? 'Aktif' : s === 'graduated' ? 'Lulus' : 'Drop'}
              </Link>
            ))}
          </div>

          {/* Program filter */}
          {options.programs.length > 0 && (
            <Link
              href={buildUrl({ programId: '', page: 1 })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              {filters.programId
                ? (options.programs.find((p) => p.id === filters.programId)?.name ?? 'Program')
                : 'Semua Program'}
            </Link>
          )}
        </div>

        {/* Active filters */}
        {(filters.search || (filters.status !== 'all') || filters.programId || filters.year) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.search && (
              <FilterChip label={`"${filters.search}"`} href={buildUrl({ search: '', page: 1 })} />
            )}
            {filters.status && filters.status !== 'all' && (
              <FilterChip label={filters.status} href={buildUrl({ status: 'all', page: 1 })} />
            )}
            {filters.programId && (
              <FilterChip
                label={options.programs.find((p) => p.id === filters.programId)?.name ?? 'Program'}
                href={buildUrl({ programId: '', page: 1 })}
              />
            )}
            {filters.year && (
              <FilterChip label={`TA ${filters.year}`} href={buildUrl({ year: '', page: 1 })} />
            )}
          </div>
        )}
      </div>

      {/* Table */}
      {students.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-12 text-center">
          <Users className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-3" />
          <p className="text-sm font-semibold text-on-surface-variant">Belum ada data siswa</p>
          <p className="text-xs text-on-surface-variant/60 mt-1">
            Siswa yang bergabung lewat token enrollment akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container/50">
                  <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Siswa
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Program
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Readiness
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Angkatan
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {students.map((student) => (
                  <StudentRow key={student.id} student={student} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant/30">
              <p className="text-xs text-on-surface-variant">
                {pagination.total} siswa total
              </p>
              <div className="flex items-center gap-2">
                {pagination.page > 1 && (
                  <Link
                    href={buildUrl({ page: pagination.page - 1 })}
                    className="p-1.5 rounded-lg hover:bg-surface-container transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                )}
                <span className="text-xs font-semibold text-on-surface">
                  {pagination.page} / {pagination.totalPages}
                </span>
                {pagination.page < pagination.totalPages && (
                  <Link
                    href={buildUrl({ page: pagination.page + 1 })}
                    className="p-1.5 rounded-lg hover:bg-surface-container transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-2xl font-black text-on-surface">{value.toLocaleString('id-ID')}</p>
      <p className="text-xs text-on-surface-variant font-medium mt-0.5">{label}</p>
    </div>
  )
}

function FilterChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition-colors"
    >
      {label}
      <X className="w-3 h-3" />
    </Link>
  )
}

function StudentRow({ student }: { student: SchoolStudentRow }) {
  const initials = (student.fullName ?? 'S')
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700',
    graduated: 'bg-blue-50 text-blue-700',
    dropped: 'bg-red-50 text-red-700',
  }

  return (
    <tr className="hover:bg-surface-container/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {student.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={student.avatarUrl}
              alt={student.fullName}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-on-surface text-sm truncate">{student.fullName}</p>
            <p className="text-xs text-on-surface-variant truncate">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs text-on-surface-variant">
          {student.programName ?? <span className="italic opacity-50">—</span>}
        </p>
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            statusColors[student.status] ?? 'bg-surface-container text-on-surface-variant'
          }`}
        >
          {student.status === 'active' ? 'Aktif' : student.status === 'graduated' ? 'Lulus' : 'Drop'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-surface-container-high max-w-[60px]">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${student.careerReadiness}%` }}
            />
          </div>
          <span className="text-xs font-bold text-on-surface-variant">
            {student.careerReadiness}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs text-on-surface-variant">
          {student.enrollmentYear ?? '—'}
        </p>
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          href={`/school/students/${student.studentId}`}
          className="text-xs font-semibold text-primary hover:underline underline-offset-4"
        >
          Detail →
        </Link>
      </td>
    </tr>
  )
}
