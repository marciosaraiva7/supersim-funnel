import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Clock, ArrowRight } from 'lucide-react'
import { OfertasHeader } from '@/components/brand/OfertasHeader'
import { TrustFooter } from '@/components/brand/TrustFooter'
import { SocialProofToast } from '@/components/flow/SocialProofToast'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { buildUrlWithUtms } from '@/lib/utm'

export function PropostaPage() {
  const navigate = useNavigate()
  useUtmCapture()
  const { nome, cpf, ofertasData, acceptProposta } = useFlow()

  useEffect(() => {
    if (!cpf || !ofertasData.cpfSituation) navigate('/ofertas')
  }, [cpf, ofertasData.cpfSituation, navigate])

  function handleContinue() {
    acceptProposta()
    navigate(buildUrlWithUtms('/analise'))
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg-app pt-[72px] text-text">
      <OfertasHeader nome={nome} cpf={cpf} />

      <div className="mx-auto w-full max-w-[420px] flex-1 px-5 pb-8">
        <div className="rounded-[18px] border border-border bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <img
                src="/assets/attendant.png"
                alt="Ingrid Torres"
                className="size-28 rounded-full border-4 border-primary-light object-cover shadow-lg"
              />
              <div className="absolute -right-1 top-0 flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white shadow-md">
                <Trophy className="size-3" />
                TOP 1
              </div>
            </div>
            <h2 className="text-xl font-bold">Ingrid Torres</h2>
            <p className="text-sm text-text-light">Top 1 Atendente 2026</p>
          </div>

          <div className="mb-6 text-center">
            <h3 className="mb-4 text-lg font-bold leading-snug">
              Fale com nossa especialista Top 1 e finalize em menos de 2 minutos!
            </h3>
            <div className="mb-4 inline-flex animate-pulse items-center gap-2 rounded-full bg-primary-subtle px-4 py-2 text-sm font-semibold text-primary-dark">
              <Clock className="size-4" />
              Apenas 4 perguntas
            </div>
            <p className="text-sm text-text-light">
              Processo rápido, seguro e sem complicação.
            </p>
          </div>

          <div className="mb-6 rounded-xl bg-[#F3F4F6] px-4 py-4">
            <ul className="space-y-2 text-left text-sm text-text-mid">
              <li>• Crédito sujeito a análise e aprovação</li>
              <li>• Autorizo consulta ao SCR do Banco Central</li>
              <li>• Dados 100% protegidos e confidenciais</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dark px-4 py-4 text-base font-semibold text-white shadow-[0_4px_15px_rgba(251,150,55,0.3)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Prosseguir com Ingrid Torres
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      <TrustFooter />
      <SocialProofToast />
    </div>
  )
}
