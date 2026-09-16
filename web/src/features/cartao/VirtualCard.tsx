import { useState } from 'react'
import { Eye, EyeOff, Lock, RotateCw } from 'lucide-react'
import { SuperSimLogo } from '@/components/brand/SuperSimLogo'
import { VisaLogo } from '@/components/brand/VisaLogo'
import { formatCardNumber, MIN_DEPOSIT } from '@/mocks/cartao-data'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface VirtualCardProps {
  holderName: string
  cardNumber: string
  cardExpiry: string
  cardCvv: string
  locked?: boolean
  lockMessage?: string
  className?: string
}

export function VirtualCard({
  holderName,
  cardNumber,
  cardExpiry,
  cardCvv,
  locked = false,
  lockMessage = `Depósito mínimo de ${formatCurrency(MIN_DEPOSIT)}`,
  className,
}: VirtualCardProps) {
  const [revealed, setRevealed] = useState(false)
  const [flipped, setFlipped] = useState(false)

  const displayNumber = formatCardNumber(cardNumber || '4000 0000 0000 0000', !revealed || locked)
  const displayExpiry = revealed && !locked ? cardExpiry : '••/••'
  const displayCvv = revealed && !locked ? cardCvv : '•••'

  return (
    <div className={cn('space-y-3', className)}>
      <div className="perspective-[1000px]">
        <div
          className={cn(
            'relative aspect-[1.586/1] w-full transition-transform duration-500 [transform-style:preserve-3d]',
            flipped && '[transform:rotateY(180deg)]',
          )}
        >
          {/* Frente — bandeira Visa */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1F71] via-[#1434CB] to-[#0F2D7A] p-5 text-white shadow-xl [backface-visibility:hidden]">
            <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-6 size-28 rounded-full bg-[#F7B600]/20 blur-xl" />

            {locked && (
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 rounded-b-2xl bg-black/70 px-4 py-2.5 backdrop-blur-sm">
                <Lock className="size-4 shrink-0 text-white/90" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/95">Cartão bloqueado</p>
                  <p className="truncate text-[10px] text-white/70">{lockMessage}</p>
                </div>
              </div>
            )}

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <SuperSimLogo height={22} variant="onOrange" />
                  <VisaLogo height={34} variant="white" />
                </div>
                <div className="mt-4 w-fit rounded-md bg-gradient-to-br from-[#FFD700] to-[#F7B600] px-3 py-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-0.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="size-2 rounded-sm bg-black/25" />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 font-mono text-lg tracking-[0.18em] sm:text-xl">{displayNumber}</p>
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-white/60">Titular</p>
                    <p className="truncate text-sm font-semibold uppercase">
                      {holderName || 'SEU NOME AQUI'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/60">Validade</p>
                    <p className="font-mono text-sm font-semibold">{displayExpiry}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verso */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1F71] to-[#0F2D7A] p-5 text-white shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex justify-end">
              <VisaLogo height={34} variant="white" className="opacity-90" />
            </div>
            <div className="mt-3 h-10 bg-black/50" />
            <div className="px-0 pt-6">
              <div className="mb-4 h-9 rounded bg-white/90" />
              <div className="flex items-center justify-end gap-2">
                <span className="text-[10px] uppercase text-white/50">CVV</span>
                <span className="rounded bg-white/10 px-3 py-1 font-mono text-sm font-bold text-white">
                  {displayCvv}
                </span>
              </div>
              <p className="mt-6 text-[10px] text-white/40">
                SuperSim Soluções Financeiras S.A. — Uso exclusivo do titular.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {!locked && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-sm font-semibold text-text-mid"
          >
            {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {revealed ? 'Ocultar dados' : 'Mostrar dados'}
          </button>
        )}
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-sm font-semibold text-text-mid',
            locked ? 'w-full' : 'flex-1',
          )}
        >
          <RotateCw className="size-4" />
          {flipped ? 'Ver frente' : 'Ver verso'}
        </button>
      </div>
    </div>
  )
}
