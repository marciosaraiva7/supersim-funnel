import { useEffect, useState } from 'react'
import { Check, Loader2, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { TAC_REFUND_AFTER_INSTALLMENTS } from '@/mocks/cartao-data'
import { TacLegalNotice } from './TacPixPayment'
import { cn } from '@/lib/utils'

const STEPS = [
  'Analisando status',
  'Analisando saldo de crédito',
  'Iniciando transferência',
  'Análise de TAC',
] as const

/** Delays cumulativos variáveis (~1,2–2,8s por etapa) para parecer análise real. */
function buildStepDelays() {
  const stepDurations = [
    1200 + Math.random() * 900,
    1500 + Math.random() * 1100,
    1800 + Math.random() * 1200,
  ]
  let elapsed = 0
  return stepDurations.map((duration) => {
    elapsed += duration
    return elapsed
  })
}

interface SaqueProcessingScreenProps {
  amount: number
  tacPaid: boolean
  onPayTac: () => void
  onAlreadyPaid: () => void
}

export function SaqueProcessingScreen({
  amount,
  tacPaid,
  onPayTac,
  onAlreadyPaid,
}: SaqueProcessingScreenProps) {
  const [completedSteps, setCompletedSteps] = useState(0)

  useEffect(() => {
    const timers = buildStepDelays().map((delay, index) =>
      setTimeout(() => {
        setCompletedSteps(index + 1)
      }, delay),
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const stuckOnTac = completedSteps >= 3
  const tacPending = stuckOnTac && !tacPaid
  const stillProcessing = completedSteps < 3

  useEffect(() => {
    if (stuckOnTac && tacPaid) {
      onAlreadyPaid()
    }
  }, [stuckOnTac, tacPaid, onAlreadyPaid])

  return (
    <div className="fixed inset-0 z-[65] flex flex-col bg-white">
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col px-6 pb-8 pt-16">
        <div className="mb-8 flex justify-center">
          {stillProcessing ? (
            <Loader2 className="size-12 animate-spin text-primary" />
          ) : tacPending ? (
            <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <X className="size-7" strokeWidth={2.5} />
            </div>
          ) : (
            <Loader2 className="size-12 animate-spin text-primary" />
          )}
        </div>

        <p className="mb-1 text-center text-sm text-text-light">
          {tacPending ? 'Transferência pendente' : 'Transferindo'}
        </p>
        <p className="mb-10 text-center text-2xl font-extrabold text-text">
          {formatCurrency(amount)}
        </p>

        <ul className="space-y-4">
          {STEPS.map((label, index) => {
            const isDone = index < completedSteps && index < 3
            const isRunning = index === completedSteps && stillProcessing
            const isTacPending = index === 3 && tacPending
            const isTacWaiting = index === 3 && !stuckOnTac
            const isWaiting = !isDone && !isRunning && !isTacPending

            return (
              <li
                key={label}
                className={cn(
                  'flex items-center gap-3 text-sm transition-all duration-300',
                  isWaiting && 'opacity-30',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300',
                    isDone && 'bg-green-100 text-green-600',
                    isRunning && 'bg-primary-subtle text-primary',
                    isTacPending && 'bg-red-100 text-red-600',
                    isWaiting && 'bg-[#F3F4F6] text-text-light',
                    isTacWaiting && 'bg-[#F3F4F6] text-text-light',
                  )}
                >
                  {isDone ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : isRunning ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : isTacPending ? (
                    <X className="size-4" strokeWidth={3} />
                  ) : (
                    <span className="size-2 rounded-full bg-current opacity-40" />
                  )}
                </span>
                <span
                  className={cn(
                    'font-medium transition-colors duration-300',
                    isDone && 'text-text-mid',
                    isRunning && 'font-semibold text-text',
                    isTacPending && 'font-semibold text-red-600',
                    isWaiting && 'text-text-light',
                    isTacWaiting && 'text-text-light',
                  )}
                >
                  {label}
                  {isTacPending && (
                    <span className="ml-1.5 text-xs font-normal text-red-500">— não pago</span>
                  )}
                </span>
              </li>
            )
          })}
        </ul>

        {tacPending && (
          <div className="mt-auto space-y-3 pt-10">
            <TacLegalNotice />
            <p className="text-center text-sm text-text-mid">
              Pague a Taxa de Abertura de Crédito (TAC) via PIX Copia e Cola, usando uma conta de{' '}
              <strong>outro banco ou instituição financeira</strong>. Reembolso disponível após a{' '}
              {TAC_REFUND_AFTER_INSTALLMENTS}ª parcela do empréstimo.
            </p>
            <button
              type="button"
              onClick={onPayTac}
              className="w-full rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white"
            >
              Gerar PIX Copia e Cola
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
