// components/company/jobs/detail/job-detail-tabs.tsx
'use client'

import { useState } from 'react'
import { JobOverviewTab } from './job-overview-tab'
import { JobApplicantsTab } from './job-applicants-tab'
import { JobSkillMatchTab } from './job-skill-match-tab'
import { JobActivityTab } from './job-activity-tab'
import type { JobDetail, JobApplicant } from '@/lib/queries/company-job-detail'

type TabKey = 'overview' | 'applicants' | 'match' | 'activity'

type Props = {
  job: JobDetail
  applicants: JobApplicant[]
}

export function JobDetailTabs({ job, applicants }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  const tabs: Array<{ key: TabKey; label: string; count?: number }> = [
    { key: 'overview', label: 'Overview' },
    {
      key: 'applicants',
      label: 'Pelamar',
      count: job.stats.totalApplicants,
    },
    { key: 'match', label: 'Skill Match' },
    { key: 'activity', label: 'Activity' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Bar */}
      <div className="border-b border-outline-variant/30 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`
                  relative px-4 py-3 text-sm font-bold transition-colors
                  ${
                    isActive
                      ? 'text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }
                `}
              >
                <span className="inline-flex items-center gap-2">
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md font-mono text-[10px] ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <JobOverviewTab job={job} />}
        {activeTab === 'applicants' && (
          <JobApplicantsTab jobId={job.id} applicants={applicants} />
        )}
        {activeTab === 'match' && <JobSkillMatchTab job={job} />}
        {activeTab === 'activity' && <JobActivityTab job={job} />}
      </div>
    </div>
  )
}