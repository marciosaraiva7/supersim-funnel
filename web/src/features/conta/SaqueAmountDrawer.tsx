import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Delete, X } from 'lucide-react'
import { formatCurrency, formatCurrencyCents } from '@/lib/utils'
import { cn } from '@/lib/utils'

const KEYPAD: { digit: string; letters?: string }[][] = [
  [
    { digit: '1' },
    { digit: '2', letters: 'ABC' },
    { digit: '3', letters: 'DEF' },
  ],
  [
    { digit: '4', letters: 'GHI' },
    { digit: '5', letters: 'JKL' },
    { digit: '6', letters: 'MNO' },
  ],
  [
    { digit: '7', letters: 'PQRS' },
    { digit: '8', letters: 'TUV' },
    { digit: '9', letters: 'WXYZ' },
  ],
]

interface SaqueAmountDrawerProps {
  open: boolean
  availableBalance: number
  cents: number
  onCentsChange: (cents: number) => void
  onClose: () => void
  onConfirm: () => void
}

export function SaqueAmountDrawer({
  open,
  availableBalance,
  cents,
  onCentsChange,
  onClose,
  onConfirm,
}: SaqueAmountDrawerProps) {
  const maxCents = availableBalance * 100
  const canConfirm = cents > 0 && cents <= maxCents

  function appendDigit(digit: string) {
    const next = Number(`${cents}${digit}`)
    if (next > maxCents) return
    onCentsChange(next)
  }

  function backspace() {
    onCentsChange(Math.floor(cents / 10))
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center">
          <motion.button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Valor da transferência"
            className="relative flex max-h-[92dvh] w-full max-w-[420px] flex-col rounded-t-3xl bg-white shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="flex items-center justify-between px-5 pt-5">
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex size-10 items-center justify-center rounded-full text-text-mid"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="flex-1 px-6 pb-4 pt-2">
              <h2 className="mb-2 text-2xl font-bold leading-tight text-text">
                Qual é o valor da transferência?
              </h2>
              <p className="mb-8 text-sm text-text-light">
                Saldo disponível em conta{' '}
                <span className="font-semibold text-text-mid">{formatCurrency(availableBalance)}</span>
              </p>

              <div className="mb-6 border-b border-border pb-3">
                <p className="text-4xl font-bold tracking-tight text-text">
                  {formatCurrencyCents(cents)}
                </p>
                {availableBalance > 0 && (
                  <button
                    type="button"
                    onClick={() => onCentsChange(maxCents)}
                    className="mt-2 text-sm font-semibold text-primary active:opacity-70"
                  >
                    Sacar tudo
                  </button>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!canConfirm}
                  onClick={onConfirm}
                  aria-label="Continuar"
                  className={cn(
                    'flex size-14 items-center justify-center rounded-full transition-colors',
                    canConfirm
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-[#E5E7EB] text-[#9CA3AF]',
                  )}
                >
                  <ArrowRight className="size-6" />
                </button>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] bg-[#F3F4F6] px-2 pb-[env(safe-area-inset-bottom)] pt-2">
              {KEYPAD.map((row, rowIndex) => (
                <div key={rowIndex} className="mb-2 grid grid-cols-3 gap-2">
                  {row.map((key) => (
                    <button
                      key={key.digit}
                      type="button"
                      onClick={() => appendDigit(key.digit)}
                      className="flex h-14 flex-col items-center justify-center rounded-xl bg-white text-xl font-medium text-text shadow-sm active:bg-[#F9FAFB]"
                    >
                      <span>{key.digit}</span>
                      {key.letters && (
                        <span className="text-[10px] font-semibold tracking-widest text-text-light">
                          {key.letters}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2">
                <div aria-hidden className="h-14" />
                <button
                  type="button"
                  onClick={() => appendDigit('0')}
                  className="flex h-14 items-center justify-center rounded-xl bg-white text-xl font-medium text-text shadow-sm active:bg-[#F9FAFB]"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={backspace}
                  aria-label="Apagar"
                  className="flex h-14 items-center justify-center rounded-xl bg-white text-text shadow-sm active:bg-[#F9FAFB]"
                >
                  <Delete className="size-6" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
