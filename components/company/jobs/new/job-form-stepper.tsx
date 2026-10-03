// components/company/jobs/new/job-form-stepper.tsx
'use client'

import { Check } from 'lucide-react'

const STEPS = [
  { number: 1, label: 'Info Dasar', desc: 'Posisi & tipe kerja' },
  { number: 2, label: 'Lokasi & Gaji', desc: 'Dimana & berapa' },
  { number: 3, label: 'Detail & Skill', desc: 'Deskripsi & requirement' },
  { number: 4, label: 'Review', desc: 'Konfirmasi & publish' },
]

type Props = {
  currentStep: number
}

export function JobFormStepper({ currentStep }: Props) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {STEPS.map((step, idx) => {
          const isActive = step.number === currentStep
          const isDone = step.number < currentStep
          const isLast = idx === STEPS.length - 1

          return (
            <div key={step.number} className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                    ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isActive
                        ? 'bg-primary text-white shadow-[0_4px_12px_rgba(183,0,17,0.25)]'
                        : 'bg-surface-container text-on-surface-variant'
                    }
                  `}
                >
                  {isDone ? <Check className="w-5 h-5" /> : step.number}
                </div>

                <div className="hidden md:block">
                  <div
                    className={`text-sm font-bold ${
                      isActive || isDone
                        ? 'text-on-surface'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    {step.desc}
                  </div>
                </div>
              </div>

              {!isLast && (
                <div className="hidden lg:block flex-1 h-px bg-outline-variant/40 mx-2" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}