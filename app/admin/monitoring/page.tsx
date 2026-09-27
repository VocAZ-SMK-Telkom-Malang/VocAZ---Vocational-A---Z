import { Activity, TrendingUp } from 'lucide-react'
import {
  getMonitoringOverview,
  getGrowthTrend,
  getTopCompanies,
  getTopSchools,
  getRecentActivity,
  getPlatformHealth,
} from '@/lib/admin/queries'
import { AdminCard, AdminCardHeader } from '@/components/admin/ui/admin-card'
import { OverviewStats } from '@/components/admin/monitoring/overview-stats'
import { GrowthChart } from '@/components/admin/monitoring/growth-chart'
import { ActivityChart } from '@/components/admin/monitoring/activity-chart'
import { TopCompanies } from '@/components/admin/monitoring/top-companies'
import { TopSchools } from '@/components/admin/monitoring/top-schools'
import { RecentActivity } from '@/components/admin/monitoring/recent-activity'
import { PlatformHealth } from '@/components/admin/monitoring/platform-health'

export default async function AdminMonitoringPage() {
  const [
    overview,
    growth,
    topCompanies,
    topSchools,
    recentActivity,
    health,
  ] = await Promise.all([
    getMonitoringOverview(),
    getGrowthTrend(90),
    getTopCompanies(5),
    getTopSchools(5),
    getRecentActivity(10),
    getPlatformHealth(),
  ])

  // Data untuk activity chart
  const activityData = [
    { label: 'Users', value: overview.totalUsers, color: '#3b82f6' },
    { label: 'Students', value: overview.totalStudents, color: '#10b981' },
    { label: 'Companies', value: overview.totalCompanies, color: '#f59e0b' },
    { label: 'Jobs', value: overview.totalJobs, color: '#ef4444' },
    { label: 'Applications', value: overview.totalApplications, color: '#f97316' },
    { label: 'Certs', value: overview.verifiedCertificates, color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Platform Monitoring
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Pantau kesehatan dan pertumbuhan ekosistem VocAZ
        </p>
      </div>

      {/* Overview Stats */}
      <OverviewStats data={overview} />

      {/* Growth Chart */}
      <AdminCard>
        <AdminCardHeader
          title="Tren Pertumbuhan"
          description="Aktivitas platform dalam periode terpilih"
          action={
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              Live data
            </div>
          }
        />
        <GrowthChart data={growth} />
      </AdminCard>

      {/* Two columns: Activity Chart + Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminCard>
            <AdminCardHeader
              title="Ringkasan Aktivitas"
              description="Distribusi data di seluruh platform"
            />
            <ActivityChart data={activityData} />
          </AdminCard>
        </div>
        <div>
          <PlatformHealth data={health} />
        </div>
      </div>

      {/* Two columns: Top Companies + Top Schools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCompanies companies={topCompanies} />
        <TopSchools schools={topSchools} />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivity} />
    </div>
  )
}