// components/register/plan-card.tsx
'use client'

import { Check, X, Sparkles } from 'lucide-react'
import type { SchoolPlan } from '@/lib/register/school-plans'

type Props = {
  plan: SchoolPlan
  selected?: boolean
  onSelect: (planId: SchoolPlan['id']) => void
}

export function PlanCard({ plan, selected, onSelect }: Props) {
  const Icon = plan.icon

  return (
    <div
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 flex flex-col ${
        plan.popular
          ? 'ring-2 ring-primary shadow-[0_16px_40px_-10px_rgba(220,38,38,0.25)] scale-[1.02]'
          : selected
            ? 'ring-2 ring-primary shadow-lg'
            : 'ring-1 ring-outline-variant/30 hover:ring-primary/30 hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#ff5757] to-[#dc2626] text-white font-mono text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3" />
          Paling Populer
        </div>
      )}

      <div className="p-6 flex flex-col flex-1 gap-5">
        {/* Icon + Name */}
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              plan.popular
                ? 'bg-gradient-to-br from-[#ff5757] to-[#dc2626] text-white'
                : 'bg-surface-container text-primary'
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-extrabold text-on-surface">
              {plan.name}
            </h3>
            <p className="text-[11px] text-on-surface-variant">
              {plan.tagline}
            </p>
          </div>
        </div>

        {/* Price */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-extrabold text-on-surface">
              {plan.priceDisplay}
            </span>
            <span className="text-xs text-on-surface-variant">/tahun</span>
          </div>
          <p className="text-[11px] text-primary font-semibold mt-1">
            {plan.pricePerStudent}
          </p>
        </div>

        {/* Highlights (3 poin penting) */}
        <div className="space-y-2 pt-3 border-t border-outline-variant/20">
          {plan.highlights.map((h) => (
            <div key={h} className="flex items-start gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </div>
              <span className="text-on-surface font-medium">{h}</span>
            </div>
          ))}
        </div>

        {/* Full features */}
        <div className="space-y-1.5 pt-3 border-t border-outline-variant/20 flex-1">
          {plan.features.map((f) => (
            <div key={f.label} className="flex items-start gap-2 text-[11px]">
              {f.included ? (
                <Check
                  className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"
                  strokeWidth={3}
                />
              ) : (
                <X
                  className="w-3.5 h-3.5 text-on-surface-variant/40 shrink-0 mt-0.5"
                  strokeWidth={3}
                />
              )}
              <span
                className={
                  f.included
                    ? 'text-on-surface-variant'
                    : 'text-on-surface-variant/50 line-through'
                }
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => onSelect(plan.id)}
          className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-display font-bold text-sm shadow-sm transition-all ${
            plan.popular
              ? 'bg-gradient-to-r from-[#ff5757] to-[#dc2626] text-white hover:brightness-105 hover:shadow-md'
              : selected
                ? 'bg-primary text-white'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          {plan.popular ? 'Pilih Pro' : `Pilih ${plan.name}`}
        </button>
      </div>
    </div>
  )
}