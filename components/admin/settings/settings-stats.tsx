import { Settings, FolderTree, Activity } from 'lucide-react'
import { AdminCard } from '@/components/admin/ui/admin-card'

type Props = {
  stats: {
    total: number
    grouped: Record<string, number>
    recentlyUpdated: number
  }
}

export function SettingsStats({ stats }: Props) {
  const categoryCount = Object.keys(stats.grouped).length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <AdminCard padding="sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Total Settings
            </div>
            <div className="font-display text-2xl font-extrabold text-on-surface">
              {stats.total}
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard padding="sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Kategori
            </div>
            <div className="font-display text-2xl font-extrabold text-on-surface">
              {categoryCount}
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard padding="sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Baru Diubah
            </div>
            <div className="font-display text-2xl font-extrabold text-on-surface">
              {stats.recentlyUpdated}
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  )
}