// components/register/type-card.tsx
'use client'

import { Check } from 'lucide-react'
import type { CertInstitutionType } from '@/lib/register/certification-data'

type Props = {
  type: CertInstitutionType
  selected: boolean
  onSelect: (id: CertInstitutionType['id']) => void
}

export function TypeCard({ type, selected, onSelect }: Props) {
  const Icon = type.icon

  return (
    <button
      type="button"
      onClick={() => onSelect(type.id)}
      className={`group text-left w-full p-6 rounded-2xl transition-all duration-300 ${
        selected
          ? 'ring-2 ring-primary bg-primary/5 shadow-lg'
          : 'ring-1 ring-outline-variant/40 bg-surface-container-lowest hover:ring-primary/30 hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-14 h-14 rounded-2xl ${type.iconBg} ${type.iconColor} flex items-center justify-center shrink-0 transition-transform ${
            selected ? 'scale-110' : ''
          }`}
        >
          <Icon className="w-7 h-7" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-display text-lg font-extrabold text-on-surface">
              {type.name}
            </h3>
            {type.badgeTier === 1 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                🏆 Tier 1
              </span>
            )}
            {type.badgeTier === 2 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                Tier 2
              </span>
            )}
          </div>
          <p className="text-xs text-primary font-semibold mb-2">
            {type.tagline}
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {type.description}
          </p>
        </div>

        {selected && (
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="space-y-2 pt-4 border-t border-outline-variant/20">
        {type.benefits.map((benefit) => (
          <div
            key={benefit}
            className="flex items-start gap-2 text-xs text-on-surface-variant"
          >
            <div
              className={`w-4 h-4 rounded-full ${type.iconBg} ${type.iconColor} flex items-center justify-center shrink-0 mt-0.5`}
            >
              <Check className="w-2.5 h-2.5" strokeWidth={3} />
            </div>
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </button>
  )
}