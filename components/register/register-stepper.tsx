import { Check } from 'lucide-react'
import type { Step } from '@/lib/register/steps'

type Props = {
  steps: Step[]
  currentStep: number
}

export function RegisterStepper({ steps, currentStep }: Props) {
  return (
    <div className="w-full">
      <ol className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number
          const isActive = currentStep === step.number
          const isLast = index === steps.length - 1

          return (
            <li
              key={step.key}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary text-white'
                      : isActive
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`font-display text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive || isCompleted
                      ? 'text-primary'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-3 transition-colors duration-300 ${
                    currentStep > step.number
                      ? 'bg-primary'
                      : 'bg-surface-container'
                  }`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}