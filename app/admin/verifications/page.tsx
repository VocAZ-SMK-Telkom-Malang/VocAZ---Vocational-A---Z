import { Building2, Clock, CheckCircle2, XCircle } from 'lucide-react'
import {
  getVerifications,
  getVerificationStats,
} from '@/lib/admin/queries'
import { parsePageParam } from '@/lib/pagination'
import { AdminCard } from '@/components/admin/ui/admin-card'
import { AdminPagination } from '@/components/admin/ui/admin-pagination'
import { VerificationsFilter } from '@/components/admin/verifications/verifications-filter'
import { VerificationsTable } from '@/components/admin/verifications/verifications-table'

type SearchParams = Promise<{
  status?: string
  search?: string
  page?: string
}>

export default async function AdminVerificationsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const page = parsePageParam(params.page)

  const [result, stats] = await Promise.all([
    getVerifications({
      status: (params.status as any) || 'pending',
      search: params.search,
      page,
    }),
    getVerificationStats(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Verifikasi Perusahaan
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Review dan verifikasi perusahaan yang mendaftar di VocAZ
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Menunggu
              </div>
              <div className="font-display text-2xl font-extrabold text-on-surface">
                {stats.pending}
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Disetujui
              </div>
              <div className="font-display text-2xl font-extrabold text-on-surface">
                {stats.approved}
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Ditolak
              </div>
              <div className="font-display text-2xl font-extrabold text-on-surface">
                {stats.rejected}
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Total
              </div>
              <div className="font-display text-2xl font-extrabold text-on-surface">
                {stats.total}
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Filter */}
      <VerificationsFilter />

      {/* Table */}
      <VerificationsTable verifications={result.verifications} />

      {/* Pagination */}
      <AdminPagination
        currentPage={result.pagination.currentPage}
        totalPages={result.pagination.totalPages}
        totalItems={result.pagination.totalItems}
        pageSize={result.pagination.pageSize}
      />
    </div>
  )
}