import { getSystemSettings, getSettingsStats } from '@/lib/admin/queries'
import { SettingsClient } from './settings-client'

export default async function AdminSettingsPage() {
  const [settings, stats] = await Promise.all([
    getSystemSettings(),
    getSettingsStats(),
  ])

  return <SettingsClient settings={settings} stats={stats} />
}