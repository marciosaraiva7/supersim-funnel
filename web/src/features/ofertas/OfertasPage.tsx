import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Check,
  DollarSign,
  Lock,
  X,
} from 'lucide-react'
import { OfertasHeader } from '@/components/brand/OfertasHeader'
import { TrustFooter } from '@/components/brand/TrustFooter'
import { SocialProofToast } from '@/components/flow/SocialProofToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  CPF_SITUATIONS,
  EDUCATION_LEVELS,
  INCOME_OPTIONS,
  LOAN_PURPOSES,
  OCCUPATIONS,
} from '@/mocks/ofertas-data'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { buildUrlWithUtms } from '@/lib/utm'
import { cn } from '@/lib/utils'

export function OfertasPage() {
  const navigate = useNavigate()
  useUtmCapture()
  const {
    nome,
    cpf,
    ofertasStep,
    ofertasData,
    setOfertasStep,
    updateOfertasData,
  } = useFlow()

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!cpf) navigate('/verificacao')
  }, [cpf, navigate])

  const progress = (ofertasStep / 5) * 100

  function nextStep() {
    setError(null)

    if (ofertasStep === 1 && !ofertasData.loanPurpose) {
      setError('Por favor, selecione uma finalidade')
      return
    }
    if (ofertasStep === 2 && !ofertasData.occupation) {
      setError('Por favor, selecione sua ocupação')
      return
    }
    if (ofertasStep === 3) {
      const day = parseInt(ofertasData.paymentDay, 10)
      if (!ofertasData.monthlyIncome || !day || day < 1 || day > 31) {
        setError('Por favor, preencha a renda e um dia válido (1 a 31)')
        return
      }
    }
    if (ofertasStep === 4 && !ofertasData.education) {
      setError('Por favor, selecione sua escolaridade')
      return
    }
    if (ofertasStep === 5 && !ofertasData.cpfSituation) {
      setError('Por favor, selecione uma opção')
      return
    }

    if (ofertasStep < 5) {
      setOfertasStep((ofertasStep + 1) as 1 | 2 | 3 | 4 | 5)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      setTimeout(() => {
        navigate(buildUrlWithUtms('/proposta'))
      }, 1500)
    }, 800)
  }

  function prevStep() {
    if (ofertasStep > 1) {
      setOfertasStep((ofertasStep - 1) as 1 | 2 | 3 | 4 | 5)
      setError(null)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg-app pt-[72px] text-text">
      <OfertasHeader nome={nome} cpf={cpf} />

      <div className="mx-auto w-full max-w-[420px] flex-1 px-5 pb-8">
        <div className="rounded-[18px] border border-border bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="mb-2.5 h-[5px] overflow-hidden rounded-[10px] bg-[#F3F4F6]">
            <div
              className="h-full rounded-[10px] bg-primary transition-all duration-500"
              style={{ width: success ? '100%' : `${progress}%` }}
            />
          </div>
          <p className="mb-[18px] text-center text-[13px] font-medium text-text-light">
            {ofertasStep} de 5
          </p>

          <AnimatePresence mode="wait">
            {ofertasStep === 1 && (
              <StepPanel key="1">
                <StepHeader
                  title="Finalidade do Empréstimo"
                  subtitle="Para que você precisa do empréstimo?"
                />
                <div className="grid grid-cols-2 gap-3">
                  {LOAN_PURPOSES.map((item) => {
                    const Icon = item.icon
                    const selected = ofertasData.loanPurpose === item.value
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          updateOfertasData({ loanPurpose: item.value })
                          setError(null)
                        }}
                        className={cn(
                          'flex flex-col items-center gap-2.5 rounded-[14px] border-2 px-3 py-5 text-center transition-all',
                          selected
                            ? 'border-primary bg-primary-subtle shadow-[0_0_0_3px_rgba(251,150,55,0.12)]'
                            : 'border-border bg-white hover:border-primary hover:bg-primary-subtle',
                        )}
                      >
                        <Icon className="size-7 text-primary-dark" strokeWidth={1.5} />
                        <span
                          className={cn(
                            'text-[13.5px] font-semibold leading-snug',
                            selected ? 'text-primary-dark' : 'text-text-mid',
                          )}
                        >
                          {item.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </StepPanel>
            )}

            {ofertasStep === 2 && (
              <StepPanel key="2">
                <StepHeader title="Ocupação" subtitle="Informe sua ocupação" />
                <p className="mb-1 pl-0.5 text-[13px] font-semibold uppercase tracking-wide text-text-mid">
                  Sua ocupação
                </p>
                <div className="flex flex-col gap-2.5">
                  {OCCUPATIONS.map((item) => {
                    const Icon = item.icon
                    const selected = ofertasData.occupation === item.value
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          updateOfertasData({ occupation: item.value })
                          setError(null)
                        }}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all',
                          selected
                            ? 'border-primary bg-primary-subtle shadow-[0_0_0_3px_rgba(251,150,55,0.12)]'
                            : 'border-border bg-white hover:border-primary hover:bg-primary-subtle',
                        )}
                      >
                        <Icon
                          className={cn(
                            'size-5 shrink-0',
                            selected ? 'text-primary-dark' : 'text-text-light',
                          )}
                          strokeWidth={1.8}
                        />
                        <span
                          className={cn(
                            'text-[15px]',
                            selected ? 'font-semibold text-primary-dark' : 'font-medium text-text-mid',
                          )}
                        >
                          {item.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </StepPanel>
            )}

            {ofertasStep === 3 && (
              <StepPanel key="3">
                <StepHeader
                  title="Renda e Dia de Recebimento"
                  subtitle="Informe sua renda mensal e dia de recebimento"
                />
                <InputSection
                  icon={DollarSign}
                  title="Renda mensal"
                  subtitle="Informe sua renda líquida (valor que recebe)"
                >
                  <select
                    value={ofertasData.monthlyIncome}
                    onChange={(e) => {
                      updateOfertasData({ monthlyIncome: e.target.value })
                      setError(null)
                    }}
                    className="w-full appearance-none rounded-xl border-2 border-border bg-white px-4 py-3.5 text-[15px] text-text-mid outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(251,150,55,0.12)]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 14px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                    }}
                  >
                    <option value="">Selecione sua renda</option>
                    {INCOME_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </InputSection>
                <InputSection
                  icon={Calendar}
                  title="Dia de recebimento"
                  subtitle="Que dia do mês você costuma receber?"
                >
                  <Input
                    inputMode="numeric"
                    maxLength={2}
                    placeholder="Ex: 5, 10, 15, 25..."
                    value={ofertasData.paymentDay}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 2)
                      updateOfertasData({ paymentDay: val })
                      setError(null)
                    }}
                    className="h-auto py-3.5 text-base"
                  />
                </InputSection>
              </StepPanel>
            )}

            {ofertasStep === 4 && (
              <StepPanel key="4">
                <StepHeader title="Escolaridade" subtitle="Informe seu nível de escolaridade" />
                <p className="mb-1 pl-0.5 text-[13px] font-semibold uppercase tracking-wide text-text-mid">
                  Sua escolaridade
                </p>
                <div className="flex flex-col gap-2.5">
                  {EDUCATION_LEVELS.map((item) => {
                    const Icon = item.icon
                    const selected = ofertasData.education === item.value
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          updateOfertasData({ education: item.value })
                          setError(null)
                        }}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all',
                          selected
                            ? 'border-primary bg-primary-subtle shadow-[0_0_0_3px_rgba(251,150,55,0.12)]'
                            : 'border-border bg-white hover:border-primary hover:bg-primary-subtle',
                        )}
                      >
                        <Icon
                          className={cn(
                            'size-5 shrink-0',
                            selected ? 'text-primary-dark' : 'text-text-light',
                          )}
                        />
                        <span
                          className={cn(
                            'text-[15px]',
                            selected ? 'font-semibold text-primary-dark' : 'font-medium text-text-mid',
                          )}
                        >
                          {item.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </StepPanel>
            )}

            {ofertasStep === 5 && (
              <StepPanel key="5">
                <StepHeader title="Situação do CPF" subtitle="Seu nome está negativado?" />
                <div className="flex flex-col gap-3">
                  {CPF_SITUATIONS.map((item) => {
                    const selected = ofertasData.cpfSituation === item.value
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          updateOfertasData({ cpfSituation: item.value })
                          setError(null)
                        }}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                          selected
                            ? 'border-primary bg-primary-subtle shadow-[0_0_0_3px_rgba(251,150,55,0.12)]'
                            : 'border-border bg-white hover:border-primary',
                        )}
                      >
                        <div
                          className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-full',
                            item.tone === 'danger' ? 'bg-red-100' : 'bg-primary-light',
                          )}
                        >
                          {item.tone === 'danger' ? (
                            <X className="size-5 text-red-500" />
                          ) : (
                            <Check className="size-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-[14.5px] font-semibold text-text">{item.title}</h4>
                          <p className="text-[12.5px] text-text-light">{item.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-1.5 rounded-xl bg-[#F3F4F6] px-4 py-3.5 text-center text-[13px] leading-relaxed text-text-light">
                  Não se preocupe! Trabalhamos com pessoas em qualquer situação de crédito
                </p>
              </StepPanel>
            )}
          </AnimatePresence>

          {error && (
            <p className="mt-3 animate-[shake_0.4s_ease] rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-center text-[13px] font-medium text-red-600">
              {error}
            </p>
          )}

          {success && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-primary-subtle px-4 py-4 text-[14px] font-medium text-primary-dark">
              <Check className="size-[18px] text-primary" />
              Informações validadas! Redirecionando...
            </div>
          )}

          {!success && (
            <div className="mt-[22px] flex gap-2.5">
              {ofertasStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border-2 border-border bg-white px-5 py-3.5 text-[14.5px] font-semibold text-text-mid transition-all hover:bg-[#F3F4F6]"
                >
                  <ArrowLeft className="size-4" />
                  Voltar
                </button>
              )}
              <Button
                type="button"
                onClick={nextStep}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  'Continuar'
                )}
              </Button>
            </div>
          )}

          <div className="mt-[18px] flex items-start gap-2 rounded-[10px] border border-green-200 bg-primary-subtle px-3.5 py-2.5">
            <Lock className="mt-0.5 size-4 shrink-0 text-primary-dark" />
            <span className="text-xs font-medium leading-snug text-primary-dark">
              Suas informações são utilizadas apenas para análise de crédito.
            </span>
          </div>
        </div>
      </div>

      <TrustFooter />
      <SocialProofToast />
    </div>
  )
}

function StepPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  )
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 text-center">
      <h1 className="mb-1.5 text-[1.35rem] font-bold tracking-[-0.3px] text-text">{title}</h1>
      <p className="text-sm text-text-light">{subtitle}</p>
    </div>
  )
}

function InputSection({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-6">
      <div className="mb-2.5 flex items-center gap-3">
        <div className="flex size-[42px] shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary-dark">
          <Icon className="size-[22px]" strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-text">{title}</h3>
          <p className="text-[12.5px] text-text-light">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
