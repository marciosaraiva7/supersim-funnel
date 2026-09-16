import { Navigate, Route, Routes } from 'react-router-dom'
import { AnalisePage } from '@/features/analise/AnalisePage'
import { ObjetivoPage } from '@/features/caps/ObjetivoPage'
import { ConfirmacaoPage } from '@/features/confirmacao/ConfirmacaoPage'
import { CartaoPage } from '@/features/cartao/CartaoPage'
import { ContaPage } from '@/features/conta/ContaPage'
import { CriandoPage } from '@/features/criando/CriandoPage'
import { FacialPage } from '@/features/facial/FacialPage'
import { InicioPage } from '@/features/inicio/InicioPage'
import { OfertasPage } from '@/features/ofertas/OfertasPage'
import { PropostaPage } from '@/features/proposta/PropostaPage'
import { VencimentoPage } from '@/features/vencimento/VencimentoPage'
import { VerificacaoPage } from '@/features/verificacao/VerificacaoPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/caps" replace />} />
      <Route path="/caps" element={<ObjetivoPage />} />
      <Route path="/inicio" element={<InicioPage />} />
      <Route path="/verificacao" element={<VerificacaoPage />} />
      <Route path="/ofertas" element={<OfertasPage />} />
      <Route path="/proposta" element={<PropostaPage />} />
      <Route path="/analise" element={<AnalisePage />} />
      <Route path="/facial" element={<FacialPage />} />
      <Route path="/vencimento" element={<VencimentoPage />} />
      <Route path="/confirmacao" element={<ConfirmacaoPage />} />
      <Route path="/criando" element={<CriandoPage />} />
      <Route path="/conta" element={<ContaPage />} />
      <Route path="/cartao" element={<CartaoPage />} />
      <Route path="/concluido" element={<Navigate to="/criando" replace />} />
    </Routes>
  )
}
