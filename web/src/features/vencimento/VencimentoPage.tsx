import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, FileText } from 'lucide-react'
import { OfertasHeader } from '@/components/brand/OfertasHeader'
import { TrustFooter } from '@/components/brand/TrustFooter'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { displayName } from '@/lib/cpf'
import { buildUrlWithUtms } from '@/lib/utm'

const DUE_DATES = [5, 10, 15, 25, 30]

export function VencimentoPage() {
  const navigate = useNavigate()
  useUtmCapture()
  const { nome, cpf, facialVerified, setDueDate } = useFlow()
  const [section, setSection] = useState<'terms' | 'dates'>('terms')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!cpf || !facialVerified) navigate('/facial')
  }, [cpf, facialVerified, navigate])

  function selectDate(day: number) {
    setDueDate(day)
    setLoading(true)
    setTimeout(() => {
      navigate(buildUrlWithUtms('/confirmacao'))
    }, 1500)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg-app pt-[72px] text-text">
      <OfertasHeader nome={nome} cpf={cpf} />

      <div className="mx-auto w-full max-w-[420px] flex-1 px-5 pb-8">
        {section === 'terms' ? (
          <div className="rounded-[18px] border border-border bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <h1 className="mb-2 text-xl font-bold">Condições do Empréstimo</h1>
            <p className="mb-6 text-sm text-text-light">Leia atentamente antes de prosseguir</p>

            <div className="mb-4 flex gap-3 rounded-xl border border-border bg-[#F9FAFB] p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary-dark">
                <FileText className="size-5" />
              </div>
              <p className="text-sm leading-relaxed text-text-mid">
                Se houver atraso no pagamento das parcelas, serão aplicados juros de{' '}
                <span className="font-semibold text-primary-dark">0,49% ao mês</span>.
              </p>
            </div>

            <div className="mb-6 flex gap-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#D97706]">
                <AlertTriangle className="size-5" />
              </div>
              <p className="text-sm leading-relaxed text-text-mid">
                <span className="font-semibold text-primary-dark">Importante:</span> O pagamento em
                dia evita juros e mantém seu crédito saudável.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSection('dates')}
              className="w-full rounded-xl bg-gradient-to-br from-primary to-primary-dark px-4 py-4 text-base font-semibold text-white shadow-[0_4px_15px_rgba(251,150,55,0.3)]"
            >
              Li e Concordo
            </button>
          </div>
        ) : (
          <div className="rounded-[18px] border border-border bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <h1 className="mb-2 text-xl font-bold">
              Ótimo, <span className="text-primary-dark">{displayName(nome)}</span>!
            </h1>
            <p className="mb-6 text-sm text-text-light">
              Agora escolha o melhor dia para o vencimento das suas parcelas
            </p>

            <div className="space-y-3">
              {DUE_DATES.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDate(day)}
                  className="flex w-full items-center gap-4 rounded-xl border-2 border-border bg-white px-4 py-4 text-left transition hover:border-primary hover:bg-primary-subtle"
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary-subtle text-lg font-bold text-primary-dark">
                    {String(day).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-text-mid">
                    <strong className="text-text">Dia {String(day).padStart(2, '0')}</strong>
                    <br />
                    Todo mês
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <TrustFooter />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-xl">
            <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="font-semibold text-text">Processando sua escolha...</p>
          </div>
        </div>
      )}
    </div>
  )
}
