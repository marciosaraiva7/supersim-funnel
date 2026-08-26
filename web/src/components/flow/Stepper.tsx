import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StepperProps {
  currentStep: 1 | 2 | 3 | 4
}

const STEPS = [
  { id: 1, label: 'CPF' },
  { id: 2, label: 'Identidade' },
  { id: 3, label: 'Nascimento' },
  { id: 4, label: 'Pronto', isFinal: true },
] as const

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-start justify-between px-1">
      {STEPS.map((step, index) => {
        const isDone = step.id < currentStep
        const isActive = step.id === currentStep
        const isLast = index === STEPS.length - 1

        return (
          <div key={step.id} className="flex flex-1 items-start">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors',
                  isDone || isActive
                    ? 'bg-primary text-white'
                    : 'border-2 border-border bg-white text-text-light',
                )}
              >
                {'isFinal' in step && step.isFinal ? (
                  <Check className="size-3.5" strokeWidth={2.5} />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  'text-[11px] font-bold',
                  isDone || isActive ? 'text-primary' : 'text-text-light',
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'mx-1 mt-4 h-0.5 flex-1',
                  step.id < currentStep ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
