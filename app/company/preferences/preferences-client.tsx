// app/company/preferences/preferences-client.tsx
'use client'

import { PreferencesHeader } from '@/components/company/preferences/preferences-header'
import { PreferencesForm } from '@/components/company/preferences/preferences-form'
import type {
  TalentPreferenceData,
  PreferencesOptions,
} from '@/lib/queries/company-preferences'

type Props = {
  prefs: TalentPreferenceData
  options: PreferencesOptions
  stats: {
    totalCandidates: number
    topSkillCount: number
  }
}

export function CompanyPreferencesClient({ prefs, options, stats }: Props) {
  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
      <PreferencesHeader
        stats={stats}
        currentPrefs={{
          totalSkills: prefs.skills.length,
          totalPrograms: prefs.programs.length,
          totalLocations: prefs.locations.length,
          minMatchScore: prefs.minMatchScore,
        }}
      />

      <PreferencesForm prefs={prefs} options={options} />
    </div>
  )
}