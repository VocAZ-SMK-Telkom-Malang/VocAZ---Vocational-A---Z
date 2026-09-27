// components/student/dashboard/profile-checklist.tsx
import Link from 'next/link'
import { Check, Circle, ArrowRight } from 'lucide-react'

type ChecklistItem = {
  label: string
  description: string
  completed: boolean
  href: string
}

type Props = {
  items: ChecklistItem[]
}

export function ProfileChecklist({ items }: Props) {
  const completed = items.filter((i) => i.completed).length
  const total = items.length

  if (completed === total) {
    return (
      <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              Profil 100% Lengkap!
            </p>
            <p className="text-xs text-on-surface-variant">
              Kamu siap bersaing di dunia kerja 🎉
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-sm font-bold text-on-surface">
            Lengkapi Profil
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {completed}/{total} selesai
          </p>
        </div>
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
          {Math.round((completed / total) * 100)}%
        </span>
      </div>

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group flex items-start gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  item.completed
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {item.completed ? (
                  <Check className="w-3 h-3" strokeWidth={3} />
                ) : (
                  <Circle className="w-2 h-2 fill-current" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-semibold truncate ${
                    item.completed
                      ? 'text-on-surface-variant line-through'
                      : 'text-on-surface'
                  }`}
                >
                  {item.label}
                </p>
                <p className="text-[11px] text-on-surface-variant truncate">
                  {item.description}
                </p>
              </div>

              {!item.completed && (
                <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}