// app/student/dashboard/page.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Bell } from 'lucide-react'
import { getServerSession } from '@/lib/auth/session'
import {
  getCurrentStudent,
  getStudentDashboardStats,
  getRecommendedJobs,
  getRecentApplications,
  getRecentNotifications,
  getProfileChecklist,
} from '@/lib/student/queries'
import { WelcomeHeader } from '@/components/student/dashboard/welcome-header'
import { StatsGrid } from '@/components/student/dashboard/stats-grid'
import { RecommendedJobs } from '@/components/student/dashboard/recommended-jobs'
import { RecentApplications } from '@/components/student/dashboard/recent-applications'
import { ProfileChecklist } from '@/components/student/dashboard/profile-checklist'

export default async function StudentDashboardPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/auth/sign-in')

  const user = await getCurrentStudent(session.user.id)
  if (!user) redirect('/onboarding')
  if (!user.studentProfile) redirect('/onboarding')

  const profileId = user.studentProfile.id

  const [stats, jobs, applications, notifications, checklist] =
    await Promise.all([
      getStudentDashboardStats(profileId),
      getRecommendedJobs(profileId, 5),
      getRecentApplications(profileId, 5),
      getRecentNotifications(user.id, 5),
      getProfileChecklist(profileId),
    ])

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <WelcomeHeader
        fullName={user.fullName}
        profileCompletion={user.studentProfile.profileCompletion}
      />

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Jobs */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-extrabold text-on-surface">
                  Rekomendasi Lowongan
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Cocok dengan skill kamu
                </p>
              </div>
              <Link
                href="/student/jobs"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
              >
                <span>Lihat semua</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <RecommendedJobs jobs={jobs} />
          </section>

          {/* Recent Applications */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-extrabold text-on-surface">
                  Lamaran Terbaru
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  5 lamaran terakhir
                </p>
              </div>
              <Link
                href="/student/applications"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
              >
                <span>Lihat semua</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-3">
              <RecentApplications applications={applications} />
            </div>
          </section>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-6">
          {/* Profile checklist */}
          <ProfileChecklist items={checklist} />

          {/* Notifications */}
          <section className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-on-surface-variant" />
                <h3 className="font-display text-sm font-bold text-on-surface">
                  Notifikasi
                </h3>
              </div>
              <Link
                href="/student/notifications"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Semua
              </Link>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-on-surface-variant text-center py-4">
                Belum ada notifikasi
              </p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container-low transition-colors"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        notif.isRead ? 'bg-transparent' : 'bg-primary'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-on-surface truncate">
                        {notif.title || 'Notifikasi'}
                      </p>
                      {notif.body && (
                        <p className="text-[11px] text-on-surface-variant line-clamp-2">
                          {notif.body}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}