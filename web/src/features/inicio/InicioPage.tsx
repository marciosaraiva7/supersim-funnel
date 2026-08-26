import { useNavigate } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  ClipboardCheck,
  DollarSign,
  Lock,
  Shield,
  Zap,
} from 'lucide-react'
import { SuperSimLogo } from '@/components/brand/SuperSimLogo'
import { TrustFooter } from '@/components/brand/TrustFooter'
import { LoanSimulator } from '@/components/flow/LoanSimulator'
import { SocialProofToast } from '@/components/flow/SocialProofToast'
import { BENEFITS, TESTIMONIALS } from '@/mocks/flow-data'
import { useFlow } from '@/context/FlowContext'
import { useBackRedirect } from '@/hooks/useBackRedirect'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { buildUrlWithUtms } from '@/lib/utm'

const benefitIcons = {
  zap: Zap,
  currency: DollarSign,
  shield: Shield,
  clipboard: ClipboardCheck,
}

export function InicioPage() {
  const navigate = useNavigate()
  useUtmCapture()
  useBackRedirect('/caps')
  const { loanAmount, setLoanAmount, startVerification } = useFlow()

  function goToVerification() {
    startVerification()
    navigate(buildUrlWithUtms('/verificacao'))
  }

  function scrollToSimulator() {
    document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-dvh bg-bg-app text-text">
      <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0_1px_0_#E5E7EB]">
        <div className="mx-auto flex max-w-[500px] items-center justify-between px-5 py-3.5">
          <SuperSimLogo height={24} />
          <button
            type="button"
            onClick={scrollToSimulator}
            className="rounded-full bg-gradient-to-br from-primary to-primary-dark px-[22px] py-2.5 text-sm font-bold text-white shadow-[0_3px_12px_rgba(251,150,55,0.35)] transition-transform hover:scale-105"
          >
            Simular
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#78350F] via-[#92400E] via-30% to-[#D97706] px-6 pb-40 pt-[120px]">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute left-[10%] top-[20%] text-4xl text-white/30">$</div>
          <div className="absolute right-[15%] top-[35%] text-3xl text-white/20">$</div>
        </div>
        <div className="relative z-10 mx-auto max-w-[500px] text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
            <Check className="size-4" />
            Crédito Pré-Aprovado
          </div>
          <h1 className="mb-3 text-[28px] font-extrabold leading-tight tracking-tight">
            Crédito Pessoal
            <br />
            na Sua Conta
          </h1>
          <p className="mb-6 text-[15px] text-white/90">
            Dinheiro rápido, sem burocracia e com as melhores taxas
          </p>
          <div>
            <span className="text-sm text-white/80">Limite de até</span>
            <div className="text-[42px] font-extrabold leading-none text-[#FCD34D]">
              <span className="text-2xl">R$</span>30.000
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-bg-app to-transparent" />
      </section>

      <div className="relative z-10 -mt-28 mx-auto max-w-[500px] px-4 pb-8">
        <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="p-5">
            <div className="mb-5 text-center">
              <h2 className="text-xl font-bold">Vantagens Exclusivas</h2>
              <p className="text-sm text-text-light">
                Por que milhares escolhem a SuperSim
              </p>
            </div>

            <div className="mb-6 flex flex-col gap-3">
              {BENEFITS.map((benefit) => {
                const Icon = benefitIcons[benefit.icon as keyof typeof benefitIcons]
                return (
                  <div
                    key={benefit.title}
                    className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-text">{benefit.title}</p>
                      <p className="text-sm text-text-light">{benefit.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <LoanSimulator value={loanAmount} onChange={setLoanAmount} />

            <button
              type="button"
              onClick={goToVerification}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-dark py-4 text-base font-bold text-white shadow-[0_4px_15px_rgba(251,150,55,0.3)] active:scale-[0.98]"
            >
              <ChevronRight className="size-5" />
              Solicitar Agora
            </button>
          </div>

          <div className="border-t border-border-light px-5 py-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-text-light">
              <span className="flex items-center gap-1">
                <Lock className="size-3.5" />
                Dados protegidos
              </span>
              <span className="flex items-center gap-1">
                <Shield className="size-3.5" />
                Banco Central
              </span>
              <span className="flex items-center gap-1">
                <Check className="size-3.5" />
                +500 mil clientes
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[500px] px-4 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: '500K+', label: 'Clientes' },
            { num: '24h', label: 'Aprovação' },
            { num: '120x', label: 'Parcelas' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <p className="text-xl font-extrabold text-primary">{stat.num}</p>
              <p className="text-xs font-semibold uppercase text-text-light">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[500px] px-4 pb-8">
        <h3 className="mb-4 text-center text-lg font-bold">
          O que dizem nossos clientes
        </h3>
        <div className="flex flex-col gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border-l-4 border-primary bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-2 flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mb-3 text-sm leading-relaxed text-text-mid">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-text-light">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TrustFooter />
      <SocialProofToast />
    </div>
  )
}
