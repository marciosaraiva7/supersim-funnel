import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { ProgressBar } from '@/components/flow/ProgressBar'
import { GoalOptionCard } from '@/components/flow/GoalOptionCard'
import { TrustFooter } from '@/components/brand/TrustFooter'
import { SocialProofToast } from '@/components/flow/SocialProofToast'
import { OBJECTIVES } from '@/mocks/flow-data'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { buildUrlWithUtms } from '@/lib/utm'
import { cn } from '@/lib/utils'

export function ObjetivoPage() {
  const navigate = useNavigate()
  useUtmCapture()
  const { objective, setObjective } = useFlow()
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Preparando sua simulação...')

  function handleContinue() {
    if (!objective) return
    setLoadingText(
      objective === 'pessoal'
        ? 'Preparando sua simulação pessoal...'
        : 'Preparando sua simulação empresarial...',
    )
    setLoading(true)
    setTimeout(() => navigate(buildUrlWithUtms('/inicio')), 850)
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-bg-caps text-ink">
      <ProgressBar value={78} animated />

      <div className="flex flex-1 flex-col px-6">
        <div className="relative flex animate-fade-up justify-center pb-[26px] pt-11">
          <div className="absolute right-[2%] top-[38%] size-[92px] animate-spin-slow rounded-full border-[14px] border-orange-soft bg-[conic-gradient(from_0deg,var(--color-orange-soft),#fff,var(--color-orange-soft))]" />
          <img
            src="/assets/caps-illustration.png"
            alt="Pessoas usando smartphone"
            className="relative z-10 w-full max-w-[340px]"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            draggable={false}
          />
        </div>

        <h1
          className="animate-fade-up mb-[22px] text-[26px] font-bold leading-tight tracking-[-0.3px]"
          style={{ animationDelay: '80ms' }}
        >
          Qual o seu objetivo?
        </h1>

        <div
          className="mb-[18px] flex flex-col gap-3.5"
          role="radiogroup"
          aria-label="Qual o seu objetivo?"
        >
          {OBJECTIVES.map((opt, i) => (
            <GoalOptionCard
              key={opt.id}
              emoji={opt.emoji}
              label={opt.label}
              selected={objective === opt.id}
              onSelect={() => setObjective(opt.id)}
              delay={140 + i * 60}
            />
          ))}
        </div>

        <div className="min-h-6 flex-1" />

        <div className="pb-7 pt-1.5">
          <button
            type="button"
            disabled={!objective}
            onClick={handleContinue}
            aria-disabled={!objective}
            className={cn(
              'block w-full rounded-2xl py-[18px] text-center text-[17px] font-bold tracking-[0.2px] transition-all',
              objective
                ? 'cursor-pointer bg-gradient-to-br from-orange to-orange-deep text-white shadow-[0_14px_28px_-12px_rgba(240,99,10,0.6)] active:scale-[0.98]'
                : 'cursor-not-allowed bg-line text-muted',
            )}
          >
            Continuar
          </button>
          <div className="flex items-center justify-center gap-1.5 pb-[18px] pt-3 text-[11.5px] text-ink-soft">
            <Check className="size-3 text-success" strokeWidth={2.4} />
            Consulta 100% segura e gratuita
          </div>
        </div>

        <TrustFooter variant="compact" />
      </div>

      <SocialProofToast />

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[rgba(28,27,26,0.92)]"
            role="dialog"
            aria-label="Carregando simulação"
          >
            <div className="size-[38px] animate-spin rounded-full border-[3px] border-orange/25 border-t-orange" />
            <p className="text-[15px] font-bold text-white">{loadingText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
