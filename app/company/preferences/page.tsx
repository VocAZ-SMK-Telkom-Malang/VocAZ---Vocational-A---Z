// app/company/preferences/page.tsx
import { redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import {
  getCompanyPreferences,
  getPreferencesOptions,
  getPreferenceStats,
} from '@/lib/queries/company-preferences'
import { CompanyPreferencesClient } from './preferences-client'

export const metadata = {
  title: 'Talent Preferences — VocAZ',
}

export default async function CompanyPreferencesPage() {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const [prefs, options, stats] = await Promise.all([
    getCompanyPreferences(ctx.companyId),
    getPreferencesOptions(),
    getPreferenceStats(ctx.companyId),
  ])

  return (
    <CompanyPreferencesClient
      prefs={prefs}
      options={options}
      stats={stats}
    />
  )
}