import {
  User,
  Building2,
  FileText,
  BadgeCheck,
  Trash2,
  Power,
  Flag,
  ArrowRight,
} from 'lucide-react'
import { AdminCard, AdminCardHeader } from '@/components/admin/ui/admin-card'

type Activity = {
  id: string
  action: string
  targetType: string | null
  metadata: any
  createdAt: Date
  actor: {
    fullName: string | null
    email: string
    role: string
  } | null
}

type Props = {
  activities: Activity[]
}

const ACTION_CONFIG: Record<
  string,
  { label: string; icon: any; color: string }
> = {
  'user.activate': { label: 'Aktifkan User', icon: Power, color: 'text-emerald-600 bg-emerald-100' },
  'user.suspend': { label: 'Suspend User', icon: Power, color: 'text-amber-600 bg-amber-100' },
  'user.delete': { label: 'Hapus User', icon: Trash2, color: 'text-red-600 bg-red-100' },
  'user.role_change': { label: 'Ubah Role', icon: User, color: 'text-blue-600 bg-blue-100' },
  'company.approve': { label: 'Verifikasi Perusahaan', icon: BadgeCheck, color: 'text-emerald-600 bg-emerald-100' },
  'company.reject': { label: 'Tolak Verifikasi', icon: Flag, color: 'text-red-600 bg-red-100' },
  'company.register': { label: 'Registrasi Perusahaan', icon: Building2, color: 'text-purple-600 bg-purple-100' },
  'moderation.resolved': { label: 'Moderasi Selesai', icon: Flag, color: 'text-emerald-600 bg-emerald-100' },
  'moderation.dismissed': { label: 'Moderasi Diabaikan', icon: Flag, color: 'text-gray-600 bg-gray-100' },
}

export function RecentActivity({ activities }: Props) {
  if (activities.length === 0) {
    return (
      <AdminCard>
        <AdminCardHeader
          title="Aktivitas Terbaru"
          description="Log aksi terakhir di platform"
        />
        <p className="text-sm text-on-surface-variant py-6 text-center">
          Belum ada aktivitas.
        </p>
      </AdminCard>
    )
  }

  return (
    <AdminCard>
      <AdminCardHeader
        title="Aktivitas Terbaru"
        description="Log aksi terakhir di platform"
      />

      <div className="space-y-2">
        {activities.map((activity) => {
          const config = ACTION_CONFIG[activity.action] || {
            label: activity.action,
            icon: FileText,
            color: 'text-gray-600 bg-gray-100',
          }
          const Icon = config.icon

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">
                  {config.label}
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  oleh{' '}
                  <span className="font-medium">
                    {activity.actor?.fullName || activity.actor?.email || 'System'}
                  </span>
                </p>
              </div>

              <span className="text-[11px] text-on-surface-variant shrink-0">
                {formatRelativeTime(activity.createdAt)}
              </span>
            </div>
          )
        })}
      </div>
    </AdminCard>
  )
}

function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes}m lalu`
  if (hours < 24) return `${hours}j lalu`
  if (days < 30) return `${days}h lalu`
  return d.toLocaleDateString('id-ID')
}