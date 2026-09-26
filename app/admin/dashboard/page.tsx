import Link from 'next/link'
import {
  Users,
  GraduationCap,
  Building2,
  School,
  Award,
  Briefcase,
  FileText,
  BadgeCheck,
  Flag,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react'
import {
  getDashboardStats,
  getRecentUsers,
  getPendingCompanyVerifications,
  getUserGrowthData,
  getRoleDistribution,
  getActivityData,
} from '@/lib/admin/queries'
import { AdminCard, AdminCardHeader } from '@/components/admin/ui/admin-card'
import { AdminBadge } from '@/components/admin/ui/admin-badge'
import { UserGrowthChart } from '@/components/admin/charts/user-growth-chart'
import { RoleDistributionChart } from '@/components/admin/charts/role-distribution-chart'
import { ActivityChart } from '@/components/admin/charts/activity-chart'

export default async function AdminDashboard() {
  const [
    stats,
    recentUsers,
    pendingVerifications,
    userGrowth,
    roleDistribution,
    activity,
  ] = await Promise.all([
    getDashboardStats(),
    getRecentUsers(5),
    getPendingCompanyVerifications(3),
    getUserGrowthData(30),
    getRoleDistribution(),
    getActivityData(),
  ])

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-700' },
    { label: 'Students', value: stats.totalStudents, icon: GraduationCap, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Companies', value: stats.totalCompanies, icon: Building2, color: 'bg-amber-100 text-amber-700' },
    { label: 'Schools', value: stats.totalSchools, icon: School, color: 'bg-purple-100 text-purple-700' },
    { label: 'Cert Institutions', value: stats.totalCertInstitutions, icon: Award, color: 'bg-pink-100 text-pink-700' },
    { label: 'Jobs', value: stats.totalJobs, icon: Briefcase, color: 'bg-red-100 text-red-700' },
    { label: 'Applications', value: stats.totalApplications, icon: FileText, color: 'bg-cyan-100 text-cyan-700' },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Dashboard
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Ringkasan aktivitas platform VocAZ
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <AdminCard key={card.label} padding="sm">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="font-display text-3xl font-extrabold text-on-surface">
                {card.value.toLocaleString('id-ID')}
              </div>
            </AdminCard>
          )
        })}
      </div>

      {/* ============ CHARTS ROW 1 ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth */}
        <div className="lg:col-span-2">
          <AdminCard>
            <AdminCardHeader
              title="Pertumbuhan User"
              description="30 hari terakhir"
              action={
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  +{userGrowth.reduce((sum, d) => sum + d.new, 0)} baru
                </span>
              }
            />
            <UserGrowthChart data={userGrowth} />
          </AdminCard>
        </div>

        {/* Role Distribution */}
        <AdminCard>
          <AdminCardHeader
            title="Distribusi Role"
            description="Total user per role"
          />
          <RoleDistributionChart data={roleDistribution} />
        </AdminCard>
      </div>

      {/* ============ CHARTS ROW 2 ============ */}
      <AdminCard>
        <AdminCardHeader
          title="Aktivitas Platform"
          description="Ringkasan aktivitas seluruh platform"
        />
        <ActivityChart data={activity} />
      </AdminCard>

      {/* Needs Action */}
      <div>
        <h2 className="font-display text-lg font-bold text-on-surface mb-4">
          Perlu Tindakan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionCard
            label="Verifikasi Perusahaan"
            description="Menunggu review dokumen legal"
            value={stats.pendingVerifications}
            href="/admin/verifications"
            icon={BadgeCheck}
            color="bg-emerald-100 text-emerald-700"
          />
          <ActionCard
            label="Konten Dilaporkan"
            description="Menunggu moderasi admin"
            value={stats.reportedContent}
            href="/admin/moderation"
            icon={Flag}
            color="bg-red-100 text-red-700"
          />
        </div>
      </div>

      {/* Two columns: Recent Users & Pending Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <AdminCardHeader
            title="User Terbaru"
            description="5 user terakhir yang mendaftar"
            action={
              <Link
                href="/admin/users"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Lihat semua
                <ArrowRight className="w-3 h-3" />
              </Link>
            }
          />
          {recentUsers.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-6 text-center">
              Belum ada user.
            </p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <Link
                  key={u.id}
                  href={`/admin/users/${u.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    {(u.fullName || 'A')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary">
                      {u.fullName || 'Anonim'}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {u.email}
                    </p>
                  </div>
                  <AdminBadge
                    variant={
                      u.role === 'student'
                        ? 'student'
                        : u.role === 'company'
                        ? 'company'
                        : u.role === 'school'
                        ? 'school'
                        : u.role === 'certification'
                        ? 'certification'
                        : 'admin'
                    }
                  >
                    {u.role}
                  </AdminBadge>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardHeader
            title="Verifikasi Menunggu"
            description="Perusahaan yang perlu direview"
            action={
              <Link
                href="/admin/verifications"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Lihat semua
                <ArrowRight className="w-3 h-3" />
              </Link>
            }
          />
          {pendingVerifications.length === 0 ? (
            <div className="py-6 text-center">
              <BadgeCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-on-surface-variant">
                Semua verifikasi sudah diproses ✅
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingVerifications.map((v) => (
                <Link
                  key={v.id}
                  href={`/admin/verifications/${v.id}`}
                  className="block p-3 rounded-lg border border-outline-variant/30 hover:border-primary/30 hover:bg-surface-container-low transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {v.company.name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {v.company.industry || 'Industri tidak disebutkan'}
                      </p>
                    </div>
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-mono mt-2">
                    {new Date(v.submittedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function ActionCard({
  label,
  description,
  value,
  href,
  icon: Icon,
  color,
}: {
  label: string
  description: string
  value: number
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-outline-variant/30 p-5 hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(183,0,17,0.08)] transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-on-surface">{label}</p>
          </div>
          <p className="text-xs text-on-surface-variant mb-3">{description}</p>
          <div className="font-display text-3xl font-extrabold text-on-surface">
            {value}
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  )
}