import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { SuperSimLogo } from '@/components/brand/SuperSimLogo'
import { TrustFooter } from '@/components/brand/TrustFooter'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { displayName } from '@/lib/cpf'
import { formatCurrency } from '@/lib/utils'

export function ConcluidoPage() {
  const navigate = useNavigate()
  useUtmCapture()
  const { nome, cpf, loanAmount, analiseData, contactComplete } = useFlow()

  useEffect(() => {
    if (!cpf || !contactComplete) navigate('/confirmacao')
  }, [cpf, contactComplete, navigate])

  return (
    <div className="flex min-h-dvh flex-col bg-bg-app text-text">
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center justify-center px-5 py-10 text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="size-10" />
        </div>
        <SuperSimLogo height={32} className="mb-4" />
        <h1 className="mb-2 text-2xl font-bold">Cadastro concluído!</h1>
        <p className="mb-6 text-sm leading-relaxed text-text-light">
          {displayName(nome)}, sua solicitação foi registrada com sucesso. Em breve você receberá
          as instruções por e-mail e SMS.
        </p>
        <div className="mb-8 w-full rounded-[18px] border border-border bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-text-light">Resumo</p>
          <p className="mt-2 text-2xl font-extrabold text-primary-dark">
            {formatCurrency(loanAmount)}
          </p>
          <p className="mt-1 text-sm text-text-mid">
            {analiseData.selectedInstallments}x de{' '}
            {formatCurrency(analiseData.selectedMonthlyPayment)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/caps')}
          className="w-full rounded-xl bg-gradient-to-br from-primary to-primary-dark px-4 py-4 text-base font-semibold text-white"
        >
          Voltar ao início
        </button>
      </div>
      <TrustFooter />
    </div>
  )
}
