// components/student/profile/portfolio-achievement-client.tsx
'use client'

import { useState } from 'react'
import { FolderGit2, Trophy, Sparkles } from 'lucide-react'
import { ProfilePortfolioSection } from './profile-portfolio-section'
import { ProfileAchievementsSection } from './profile-achievements-section'

type Portfolio = {
  id: string
  title: string
  description: string | null
  projectUrl: string | null
  thumbnailUrl: string | null
  thumbnailKey: string | null
  startDate: string | null
  endDate: string | null
  media: {
    id: string
    url: string
    key: string
    mediaType: string
  }[]
}

type Achievement = {
  id: string
  title: string
  issuer: string | null
  level: string | null
  dateAchieved: string | null
  description: string | null
  certificateUrl: string | null
  certificateKey: string | null
}

type Props = {
  portfolios: Portfolio[]
  achievements: Achievement[]
}

type Tab = 'portfolio' | 'achievements'

export function PortfolioAchievementClient({
  portfolios,
  achievements,
}: Props) {
  const [tab, setTab] = useState<Tab>('portfolio')

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab('portfolio')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            tab === 'portfolio'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface-container'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          Portfolio
          <span
            className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center ${
              tab === 'portfolio'
                ? 'bg-white/25 text-white'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {portfolios.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('achievements')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            tab === 'achievements'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface-container'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Prestasi
          <span
            className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center ${
              tab === 'achievements'
                ? 'bg-white/25 text-white'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {achievements.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {tab === 'portfolio' ? (
        <ProfilePortfolioSection portfolios={portfolios} />
      ) : (
        <ProfileAchievementsSection achievements={achievements} />
      )}
    </div>
  )
}