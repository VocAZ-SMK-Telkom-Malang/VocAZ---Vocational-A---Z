// components/company/dashboard/quick-actions.tsx
import Link from 'next/link'
import { PlusCircle, UserSearch, Users, Building2 } from 'lucide-react'

const ACTIONS = [
  { label: 'Posting Job', href: '/company/jobs/new', icon: PlusCircle, primary: true },
  { label: 'Find Talent', href: '/company/talent', icon: UserSearch, primary: false },
  { label: 'Applicants', href: '/company/pipeline', icon: Users, primary: false },
  { label: 'Profil', href: '/company/profile', icon: Building2, primary: false },
]

export function QuickActions() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
      <h3 className="text-base font-bold text-on-surface mb-4">Aksi Cepat</h3>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((a) => {
          const Icon = a.icon
          return (
            <Link
              key={a.href}
              href={a.href}
              className={
                a.primary
                  ? 'flex flex-col items-center justify-center gap-2 aspect-square rounded-xl bg-primary text-white shadow-[0_4px_16px_rgba(183,0,17,0.20)] hover:bg-primary-container transition-all hover:scale-[1.02]'
                  : 'flex flex-col items-center justify-center gap-2 aspect-square rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-all'
              }
            >
              <Icon className="w-7 h-7" />
              <span className="text-xs font-semibold text-center px-2">{a.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}