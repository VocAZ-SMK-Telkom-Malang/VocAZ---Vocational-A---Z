'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  GraduationCap,
  Building2,
  Landmark,
  Award,
  Briefcase,
  FileText,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { AdminCard } from '@/components/admin/ui/admin-card'

type Overview = {
  totalUsers: number
  totalStudents: number
  totalCompanies: number
  totalSchools: number
  totalCertInstitutions: number
  totalJobs: number
  activeJobs: number
  totalApplications: number
  hiredApplications: number
  totalCertificates: number
  verifiedCertificates: number
  totalPlacements: number
  userGrowthPercent: number
  usersLast30: number
}

type Props = {
  data: Overview
}

export function OverviewStats({ data }: Props) {
  const stats = [
    {
      label: 'Total Users',
      value: data.totalUsers,
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      sub: `${data.usersLast30} baru (30 hari)`,
      growth: data.userGrowthPercent,
    },
    {
      label: 'Students',
      value: data.totalStudents,
      icon: GraduationCap,
      color: 'bg-emerald-100 text-emerald-700',
      sub: `${Math.round((data.totalStudents / Math.max(data.totalUsers, 1)) * 100)}% dari total`,
    },
    {
      label: 'Companies',
      value: data.totalCompanies,
      icon: Building2,
      color: 'bg-amber-100 text-amber-700',
      sub: `${data.activeJobs} lowongan aktif`,
    },
    {
      label: 'Schools',
      value: data.totalSchools,
      icon: Landmark,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Cert Institutions',
      value: data.totalCertInstitutions,
      icon: Award,
      color: 'bg-pink-100 text-pink-700',
    },
    {
      label: 'Jobs',
      value: data.totalJobs,
      icon: Briefcase,
      color: 'bg-red-100 text-red-700',
      sub: `${data.activeJobs} aktif`,
    },
    {
      label: 'Applications',
      value: data.totalApplications,
      icon: FileText,
      color: 'bg-cyan-100 text-cyan-700',
      sub: `${data.hiredApplications} hired`,
    },
    {
      label: 'Verified Certs',
      value: data.verifiedCertificates,
      icon: CheckCircle2,
      color: 'bg-teal-100 text-teal-700',
      sub: `dari ${data.totalCertificates} total`,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <AdminCard key={stat.label} padding="sm">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                {stat.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="font-display text-3xl font-extrabold text-on-surface">
                {stat.value.toLocaleString('id-ID')}
              </div>
              {typeof stat.growth === 'number' && (
                <GrowthBadge percent={stat.growth} />
              )}
            </div>

            {stat.sub && (
              <p className="text-[11px] text-on-surface-variant mt-1.5">
                {stat.sub}
              </p>
            )}
          </AdminCard>
        )
      })}
    </div>
  )
}

function GrowthBadge({ percent }: { percent: number }) {
  if (percent === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
        <Minus className="w-3 h-3" />
        0%
      </span>
    )
  }

  if (percent > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
        <TrendingUp className="w-3 h-3" />
        {percent}%
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
      <TrendingDown className="w-3 h-3" />
      {Math.abs(percent)}%
    </span>
  )
}