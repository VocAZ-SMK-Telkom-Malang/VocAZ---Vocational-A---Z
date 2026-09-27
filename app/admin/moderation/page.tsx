import { Flag, Clock, CheckCircle2, XCircle } from 'lucide-react'
import {
  getContentReports,
  getModerationStats,
} from '@/lib/admin/queries'
import { parsePageParam } from '@/lib/pagination'
import { AdminCard } from '@/components/admin/ui/admin-card'
import { AdminPagination } from '@/components/admin/ui/admin-pagination'
import { ReportsFilter } from '@/components/admin/moderation/reports-filter'
import { ReportsTable } from '@/components/admin/moderation/reports-table'

type SearchParams = Promise<{
  status?: string
  contentType?: string
  page?: string
}>

export default async function AdminModerationPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const page = parsePageParam(params.page)

  const [result, stats] = await Promise.all([
    getContentReports({
      status: (params.status as any) || 'pending',
      contentType: params.contentType,
      page,
    }),
    getModerationStats(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Content Moderation
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Review dan tindak lanjuti laporan konten dari pengguna
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
                Diselesaikan
              </div>
              <div className="font-display text-2xl font-extrabold text-on-surface">
                {stats.resolved}
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Diabaikan
              </div>
              <div className="font-display text-2xl font-extrabold text-on-surface">
                {stats.dismissed}
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <Flag className="w-5 h-5" />
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
      <ReportsFilter />

      {/* Table */}
      <ReportsTable reports={result.reports} />

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