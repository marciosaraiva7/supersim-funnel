import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  Home,
  QrCode,
  User,
  Wallet,
  ArrowDownToLine,
  CheckCircle2,
} from 'lucide-react'
import { SuperSimLogo } from '@/components/brand/SuperSimLogo'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { displayName, maskCpf } from '@/lib/cpf'
import { formatPhone } from '@/lib/phone'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

type Tab = 'home' | 'saque' | 'dados'
type SaqueStep = 'form' | 'confirm' | 'success'

export function ContaPage() {
  const navigate = useNavigate()
  useUtmCapture()
  const {
    cpf,
    nome,
    email,
    phone,
    loanAmount,
    analiseData,
    dueDate,
    contactComplete,
    completeSaque,
    resetFlow,
  } = useFlow()

  const [tab, setTab] = useState<Tab>('home')
  const [saqueStep, setSaqueStep] = useState<SaqueStep>('form')
  const [hideBalance, setHideBalance] = useState(false)
  const [showPush, setShowPush] = useState(true)
  const [showNotifs, setShowNotifs] = useState(false)

  useEffect(() => {
    if (!cpf || !contactComplete) navigate('/criando')
  }, [cpf, contactComplete, navigate])

  const monthly = analiseData.selectedMonthlyPayment
  const nextDue = new Date()
  nextDue.setMonth(nextDue.getMonth() + 1)
  nextDue.setDate(dueDate ?? 10)

  function goHome() {
    setTab('home')
    setSaqueStep('form')
  }

  function confirmSaque() {
    setSaqueStep('success')
    completeSaque()
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#F4F5F7] text-text">
      {showPush && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-[380px] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-gradient-to-br from-primary to-primary-dark px-5 py-6 text-white">
              <SuperSimLogo height={24} className="mb-3 brightness-0 invert" />
              <p className="text-lg font-bold">Conta ativada!</p>
              <p className="text-sm text-white/80">
                {formatCurrency(loanAmount)} disponível para saque
              </p>
            </div>
            <div className="p-5">
              <p className="mb-4 text-sm text-text-mid">
                Olá, {displayName(nome)}! Seu empréstimo foi aprovado e o valor já está na sua conta
                digital SuperSim.
              </p>
              <button
                type="button"
                onClick={() => setShowPush(false)}
                className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white"
              >
                Acessar minha conta
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotifs && (
        <div className="fixed inset-0 z-[55] bg-black/40" onClick={() => setShowNotifs(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-[380px] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <button type="button" onClick={() => setShowNotifs(false)} className="text-sm font-semibold text-primary">
                Voltar
              </button>
              <h2 className="text-lg font-bold">Notificações</h2>
            </div>
            <div className="space-y-3 p-4">
              <NotifItem
                title="Saque pendente!"
                text="Você tem um valor disponível para saque imediato via PIX."
                time="agora"
                onClick={() => {
                  setShowNotifs(false)
                  setTab('saque')
                }}
              />
              <NotifItem
                title="Empréstimo aprovado"
                text={`${formatCurrency(loanAmount)} liberados na sua conta.`}
                time="há 2 min"
              />
              <NotifItem title="Conta criada" text="Sua conta digital SuperSim está ativa." time="há 5 min" />
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-border bg-white px-4 py-3.5">
        <div className="mx-auto flex max-w-[420px] items-center justify-between">
          <SuperSimLogo height={28} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Notificações"
              onClick={() => setShowNotifs(true)}
              className="relative flex size-10 items-center justify-center rounded-full bg-[#F3F4F6] text-text-mid"
            >
              <Bell className="size-[18px]" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
            </button>
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-primary/30 bg-primary-subtle text-primary-dark">
              <User className="size-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[420px] flex-1 px-4 pb-24 pt-4">
        {tab === 'home' && saqueStep === 'success' && (
          <SuccessView amount={loanAmount} onHome={goHome} />
        )}

        {tab === 'home' && saqueStep !== 'success' && (
          <>
            <div className="mb-4 rounded-2xl bg-gradient-to-br from-[#1F2937] to-[#111827] p-5 text-white">
              <p className="text-sm text-white/70">Olá,</p>
              <p className="text-xl font-bold" id="heroNm">
                {displayName(nome)}
              </p>
            </div>

            <div className="mb-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-text-light">Saldo disponível</span>
                <button
                  type="button"
                  aria-label="Ocultar saldo"
                  onClick={() => setHideBalance((v) => !v)}
                  className="text-text-light"
                >
                  {hideBalance ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              <p className={cn('text-3xl font-extrabold text-text', hideBalance && 'blur-sm select-none')}>
                {formatCurrency(loanAmount)}
              </p>
              <p className="mt-1 text-xs text-green-600">Seu saldo rende 102% do CDI todos os dias.</p>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2">
              {[
                { icon: ArrowDownToLine, label: 'Sacar', action: () => setTab('saque') },
                { icon: QrCode, label: 'PIX', action: () => setTab('saque') },
                { icon: CreditCard, label: 'Cartão', action: () => {} },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white py-4 shadow-sm"
                >
                  <item.icon className="size-6 text-primary" />
                  <span className="text-xs font-semibold text-text-mid">{item.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setTab('saque')}
              className="mb-4 flex w-full items-start gap-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-left"
            >
              <Wallet className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-bold text-text">Saque pendente!</p>
                <p className="text-xs text-text-mid">
                  Você tem um valor disponível para saque imediato via PIX.
                </p>
              </div>
            </button>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="mb-1 text-xs font-bold uppercase text-text-light">Empréstimo ativo</p>
              <p className="text-2xl font-extrabold text-primary-dark">{formatCurrency(loanAmount)}</p>
              <p className="mt-2 text-sm text-text-mid">
                {analiseData.selectedInstallments}x de {formatCurrency(monthly)}
              </p>
              <p className="mt-3 text-xs text-text-light">
                Próximo vencimento:{' '}
                <strong>
                  {nextDue.toLocaleDateString('pt-BR')} - {formatCurrency(monthly)}
                </strong>
              </p>
              <button
                type="button"
                onClick={() => setTab('saque')}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white"
              >
                Sacar
                <ArrowDownToLine className="size-4" />
              </button>
            </div>
          </>
        )}

        {tab === 'saque' && saqueStep === 'form' && (
          <SaqueForm
            amount={loanAmount}
            pixKey={analiseData.pixKey}
            bankName={analiseData.bankName}
            onConfirm={() => setSaqueStep('confirm')}
            onBack={goHome}
          />
        )}

        {tab === 'saque' && saqueStep === 'confirm' && (
          <SaqueConfirm
            amount={loanAmount}
            nome={nome}
            cpf={cpf}
            pixKey={analiseData.pixKey}
            bankName={analiseData.bankName}
            onConfirm={confirmSaque}
            onEdit={() => setSaqueStep('form')}
            onBack={goHome}
          />
        )}

        {tab === 'saque' && saqueStep === 'success' && (
          <SuccessView amount={loanAmount} onHome={goHome} />
        )}

        {tab === 'dados' && (
          <DadosView
            nome={nome}
            cpf={cpf}
            email={email}
            phone={phone}
            pixKey={analiseData.pixKey}
            bankName={analiseData.bankName}
            onReset={() => {
              resetFlow()
              navigate('/caps')
            }}
          />
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-[420px]">
          {(
            [
              { id: 'home' as const, icon: Home, label: 'Home' },
              { id: 'saque' as const, icon: ArrowDownToLine, label: 'Saque' },
              { id: 'dados' as const, icon: User, label: 'Dados' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id)
                if (item.id !== 'saque') setSaqueStep('form')
              }}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-semibold',
                tab === item.id ? 'text-primary' : 'text-text-light',
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

function NotifItem({
  title,
  text,
  time,
  onClick,
}: {
  title: string
  text: string
  time: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-border bg-[#F9FAFB] p-4 text-left"
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-bold text-text">{title}</span>
        <span className="text-[11px] text-text-light">{time}</span>
      </div>
      <p className="text-xs text-text-mid">{text}</p>
    </button>
  )
}

function SaqueForm({
  amount,
  pixKey,
  bankName,
  onConfirm,
  onBack,
}: {
  amount: number
  pixKey: string
  bankName: string
  onConfirm: () => void
  onBack: () => void
}) {
  return (
    <div>
      <PageHeader title="Saque" onBack={onBack} />
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <p className="mb-1 text-sm text-text-light">Valor disponível</p>
        <p className="mb-6 text-3xl font-extrabold text-primary-dark">{formatCurrency(amount)}</p>
        <p className="mb-4 text-sm text-text-mid">
          Para liberar, efetue primeiro o seu saque para a chave PIX cadastrada.
        </p>
        <div className="mb-4 space-y-3 rounded-xl bg-[#F9FAFB] p-4 text-sm">
          <div>
            <span className="text-text-light">Chave PIX</span>
            <p className="font-semibold">{pixKey || '—'}</p>
          </div>
          <div>
            <span className="text-text-light">Banco destino</span>
            <p className="font-semibold">{bankName || '—'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white"
        >
          Sacar {formatCurrency(amount)}
        </button>
      </div>
    </div>
  )
}

function SaqueConfirm({
  amount,
  nome,
  cpf,
  pixKey,
  bankName,
  onConfirm,
  onEdit,
  onBack,
}: {
  amount: number
  nome: string
  cpf: string
  pixKey: string
  bankName: string
  onConfirm: () => void
  onEdit: () => void
  onBack: () => void
}) {
  return (
    <div>
      <PageHeader title="Confirmar" onBack={onBack} />
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm text-text-mid">
          Verifique todos os dados antes de confirmar. Transferências PIX são processadas
          imediatamente.
        </p>
        <div className="mb-6 space-y-3 text-sm">
          <ConfirmRow label="Valor" value={formatCurrency(amount)} />
          <ConfirmRow label="Para" value={`${nome}\nCPF ${cpf}`} />
          <ConfirmRow label="Chave PIX" value={pixKey} />
          <ConfirmRow label="Banco" value={bankName} />
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="mb-3 w-full rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white"
        >
          Confirmar Transferência
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-mid"
        >
          Editar Dados
        </button>
      </div>
    </div>
  )
}

function SuccessView({ amount, onHome }: { amount: number; onHome: () => void }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircle2 className="size-10" />
      </div>
      <h2 className="mb-2 text-xl font-bold">Transferência enviada!</h2>
      <p className="mb-2 text-sm text-text-mid">
        {formatCurrency(amount)} enviados via PIX com sucesso.
      </p>
      <p className="mb-8 text-xs text-text-light">O comprovante será enviado por e-mail.</p>
      <button
        type="button"
        onClick={onHome}
        className="w-full max-w-xs rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white"
      >
        Voltar ao início
      </button>
    </div>
  )
}

function DadosView({
  nome,
  cpf,
  email,
  phone,
  pixKey,
  bankName,
  onReset,
}: {
  nome: string
  cpf: string
  email: string
  phone: string
  pixKey: string
  bankName: string
  onReset: () => void
}) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Meus Dados</h2>
      <div className="space-y-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
        <DataRow label="Nome" value={nome} />
        <DataRow label="CPF" value={maskCpf(cpf)} />
        <DataRow label="E-mail" value={email} />
        <DataRow label="Telefone" value={phone ? formatPhone(phone) : '—'} />
        <DataRow label="Chave PIX" value={pixKey} />
        <DataRow label="Banco" value={bankName} />
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-light"
      >
        Reiniciar simulação
      </button>
    </div>
  )
}

function PageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-primary">
        Voltar
      </button>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  )
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2 last:border-0">
      <span className="text-text-light">{label}</span>
      <span className="whitespace-pre-line text-right font-semibold">{value}</span>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-text-light">{label}</p>
      <p className="text-sm font-semibold text-text">{value || '—'}</p>
    </div>
  )
}
