// components/register/comparison-table.tsx
'use client'

import { Check, X } from 'lucide-react'
import {
  SCHOOL_PLANS,
  COMPARISON_ROWS,
  COMPARISON_DATA,
} from '@/lib/register/school-plans'

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
      <div className="min-w-[640px] rounded-2xl overflow-hidden ring-1 ring-outline-variant/30 bg-surface-container-lowest">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-low/50">
              <th className="text-left px-5 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Fitur
              </th>
              {SCHOOL_PLANS.map((plan) => (
                <th
                  key={plan.id}
                  className={`text-center px-5 py-4 ${
                    plan.popular ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`font-display text-sm font-extrabold ${
                        plan.popular ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {plan.name}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      {plan.priceDisplay}/th
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr
                key={row.key}
                className={`border-b border-outline-variant/20 last:border-0 ${
                  i % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/20'
                }`}
              >
                <td className="px-5 py-3 text-xs font-semibold text-on-surface">
                  {row.label}
                </td>
                {SCHOOL_PLANS.map((plan) => {
                  const value = COMPARISON_DATA[plan.id][row.key]
                  return (
                    <td
                      key={plan.id}
                      className={`text-center px-5 py-3 text-xs ${
                        plan.popular ? 'bg-primary/5' : ''
                      }`}
                    >
                      {typeof value === 'boolean' ? (
                        value ? (
                          <Check
                            className="w-4 h-4 text-emerald-600 mx-auto"
                            strokeWidth={3}
                          />
                        ) : (
                          <X
                            className="w-4 h-4 text-on-surface-variant/30 mx-auto"
                            strokeWidth={3}
                          />
                        )
                      ) : (
                        <span className="font-semibold text-on-surface">
                          {value}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}