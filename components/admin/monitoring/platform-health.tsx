import Link from 'next/link'
import {
  BadgeCheck,
  Flag,
  Award,
  UserX,
  FileEdit,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { AdminCard, AdminCardHeader } from '@/components/admin/ui/admin-card'

type Props = {
  data: {
    pendingVerifications: number
    pendingReports: number
    pendingCertificates: number
    inactiveUsers: number
    draftJobs: number
  }
}

export function PlatformHealth({ data }: Props) {
  const items = [
    {
      label: 'Verifikasi Perusahaan',
      description: 'Menunggu review admin',
      value: data.pendingVerifications,
      href: '/admin/verifications',
      icon: BadgeCheck,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Konten Dilaporkan',
      description: 'Perlu moderasi',
      value: data.pendingReports,
      href: '/admin/moderation',
      icon: Flag,
      color: 'bg-red-100 text-red-700',
    },
    {
      label: 'Sertifikat Pending',
      description: 'Menunggu verifikasi',
      value: data.pendingCertificates,
      href: '#',
      icon: Award,
      color: 'bg-pink-100 text-pink-700',
    },
    {
      label: 'User Suspended',
      description: 'Tidak aktif',
      value: data.inactiveUsers,
      href: '/admin/users',
      icon: UserX,
      color: 'bg-gray-200 text-gray-700',
    },
    {
      label: 'Lowongan Draft',
      description: 'Belum dipublikasi',
      value: data.draftJobs,
      href: '/admin/users?role=company',
      icon: FileEdit,
      color: 'bg-amber-100 text-amber-700',
    },
  ]

  const totalIssues = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <AdminCard>
      <AdminCardHeader
        title="Platform Health"
        description="Perlu tindakan admin"
        action={
          totalIssues > 0 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-100 text-amber-700">
              <AlertTriangle className="w-3 h-3" />
              {totalIssues} item
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              Sehat
            </span>
          )
        }
      />

      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isEmpty = item.value === 0

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${
                isEmpty
                  ? 'opacity-50'
                  : 'hover:bg-surface-container-low'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">
                  {item.label}
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`font-display text-lg font-bold ${
                    isEmpty ? 'text-on-surface-variant' : 'text-on-surface'
                  }`}
                >
                  {item.value}
                </span>
                {!isEmpty && (
                  <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </AdminCard>
  )
}