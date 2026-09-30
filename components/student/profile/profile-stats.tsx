// components/student/profile/profile-stats.tsx
'use client'

import {
  Award,
  FileCheck,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Video,
  Trophy,
  TrendingUp,
} from 'lucide-react'

type Props = {
  stats: {
    skills: number
    experiences: number
    educations: number
    certificates: number
    verifiedCertificates: number
    portfolios: number
    showcases: number
    achievements: number
  }
  profileCompletion?: number
}

export function ProfileStats({ stats, profileCompletion = 0 }: Props) {
  const items = [
    { icon: <Award className="w-4 h-4" />, label: 'Skills', value: stats.skills, color: 'bg-blue-100 text-blue-700' },
    { icon: <FileCheck className="w-4 h-4" />, label: 'Sertifikat', value: stats.certificates, color: 'bg-emerald-100 text-emerald-700', sub: `${stats.verifiedCertificates} verified` },
    { icon: <Briefcase className="w-4 h-4" />, label: 'Pengalaman', value: stats.experiences, color: 'bg-indigo-100 text-indigo-700' },
    { icon: <GraduationCap className="w-4 h-4" />, label: 'Pendidikan', value: stats.educations, color: 'bg-amber-100 text-amber-700' },
    { icon: <FolderGit2 className="w-4 h-4" />, label: 'Portfolio', value: stats.portfolios, color: 'bg-purple-100 text-purple-700' },
    { icon: <Video className="w-4 h-4" />, label: 'Showcase', value: stats.showcases, color: 'bg-pink-100 text-pink-700' },
    { icon: <Trophy className="w-4 h-4" />, label: 'Prestasi', value: stats.achievements, color: 'bg-orange-100 text-orange-700' },
  ]

  return (
    <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
      {/* Completion bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-xs font-black uppercase tracking-wider text-on-surface">
              Kelengkapan Profil
            </p>
          </div>
          <p className="text-sm font-black text-primary">
            {profileCompletion}%
          </p>
        </div>
        <div className="h-2 rounded-full bg-surface-container overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-center"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${item.color}`}
            >
              {item.icon}
            </div>
            <p className="text-xl font-black text-on-surface leading-none">
              {item.value}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">
              {item.label}
            </p>
            {item.sub && (
              <p className="text-[9px] text-emerald-600 font-bold mt-0.5">
                {item.sub}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}