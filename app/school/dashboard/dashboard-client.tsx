// app/school/dashboard/dashboard-client.tsx
'use client'

import Link from 'next/link'
import {
  GraduationCap,
  Users,
  Target,
  Building2,
  TrendingUp,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

type Props = {
  schoolName: string
  stats: {
    totalStudents: number
    activeStudents: number
    alumniStudents: number
    totalPlacements: number
    studentsThisMonth: number
    partnerCount: number
  }
  recentStudents: Array<{
    id: string
    status: string
    enrollmentYear: number | null
    student: {
      id: string
      headline: string | null
      user: { fullName: string | null; avatarUrl: string | null }
    }
  }>
}

export function SchoolDashboardClient({
  schoolName,
  stats,
  recentStudents,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-container to-[#B70011] text-white p-6 md:p-8">
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
              BKK Dashboard
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Halo, {schoolName}
          </h1>
          <p className="text-sm md:text-base text-white/85 mt-2 max-w-2xl">
            Pantau siswa, monitor karier, dan kelola partner industri dalam satu
            dashboard.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon={GraduationCap}
          label="Total Siswa"
          value={stats.totalStudents}
          desc={`${stats.activeStudents} aktif`}
          color="red"
        />
        <StatCard
          icon={Target}
          label="Placement"
          value={stats.totalPlacements}
          desc="Siswa berhasil kerja"
          color="emerald"
        />
        <StatCard
          icon={Users}
          label="Alumni"
          value={stats.alumniStudents}
          desc="Siswa lulus"
          color="blue"
        />
        <StatCard
          icon={Building2}
          label="Partner Industri"
          value={stats.partnerCount}
          desc="Perusahaan partner"
          color="amber"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <QuickAction
          href="/school/students"
          icon={GraduationCap}
          title="Kelola Siswa"
          desc="Tambah, edit, dan pantau siswa"
        />
        <QuickAction
          href="/school/career"
          icon={Target}
          title="Career Monitoring"
          desc="Pantau status karier siswa"
        />
        <QuickAction
          href="/school/partners"
          icon={Building2}
          title="Partner Industri"
          desc="Kelola hubungan perusahaan"
        />
      </div>

      {/* Recent Students */}
      {recentStudents.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-on-surface">
                Siswa Terbaru
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                5 siswa terakhir yang bergabung
              </p>
            </div>
            <Link
              href="/school/students"
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentStudents.map((s) => {
              const name = s.student.user.fullName ?? 'Siswa'
              const initials = name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()

              return (
                <Link
                  key={s.id}
                  href={`/school/students/${s.student.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/50 hover:bg-surface-container transition-colors"
                >
                  {s.student.user.avatarUrl ? (
                    <img
                      src={s.student.user.avatarUrl}
                      alt={name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="text-xs font-black">{initials}</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-on-surface truncate">
                      {name}
                    </div>
                    <div className="text-[11px] text-on-surface-variant truncate">
                      {s.student.headline ?? 'Belum ada headline'}
                    </div>
                  </div>

                  {s.enrollmentYear && (
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold">
                      {s.enrollmentYear}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  desc,
  color,
}: {
  icon: any
  label: string
  value: number
  desc: string
  color: 'red' | 'emerald' | 'blue' | 'amber'
}) {
  const colors = {
    red: 'bg-red-50 text-primary',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 lg:p-5">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl lg:text-3xl font-black text-on-surface tracking-tight">
        {value}
      </div>
      <div className="text-xs font-bold text-on-surface mt-1">{label}</div>
      <div className="text-[11px] text-on-surface-variant mt-0.5">{desc}</div>
    </div>
  )
}

function QuickAction({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string
  icon: any
  title: string
  desc: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 hover:shadow-md transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-black text-on-surface">{title}</div>
        <div className="text-[11px] text-on-surface-variant mt-0.5">
          {desc}
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
    </Link>
  )
}