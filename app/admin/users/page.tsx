import { getUsers, getUserStats } from '@/lib/admin/queries'
import { parsePageParam } from '@/lib/pagination'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { UsersFilter } from '@/components/admin/users/users-filter'
import { UsersTable } from '@/components/admin/users/users-table'
import { AdminCard } from '@/components/admin/ui/admin-card'
import { AdminPagination } from '@/components/admin/ui/admin-pagination'
import { Users, UserCheck, UserX } from 'lucide-react'

type SearchParams = Promise<{
  search?: string
  role?: string
  page?: string
}>

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams

  const session = await getServerSession()
  const currentUser = await prisma.user.findUnique({
    where: { neonAuthUserId: session!.user.id },
    select: { id: true },
  })

  const page = parsePageParam(params.page)

  const [result, stats] = await Promise.all([
    getUsers({
      role: params.role,
      search: params.search,
      page,
    }),
    getUserStats(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          User Management
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Kelola semua user platform VocAZ
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Total User
              </div>
              <div className="font-display text-2xl font-extrabold text-on-surface">
                {stats.total.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Aktif
              </div>
              <div className="font-display text-2xl font-extrabold text-on-surface">
                {stats.active.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Suspended
              </div>
              <div className="font-display text-2xl font-extrabold text-on-surface">
                {stats.suspended.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Filter */}
      <UsersFilter />

      {/* Table */}
      <UsersTable
        users={result.users}
        currentAdminId={currentUser?.id || ''}
      />

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