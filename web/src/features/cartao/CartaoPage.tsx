import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  Shield,
  Truck,
} from 'lucide-react'
import { SuperSimLogo } from '@/components/brand/SuperSimLogo'
import { Input } from '@/components/ui/input'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { displayName } from '@/lib/cpf'
import { buildUrlWithUtms } from '@/lib/utm'
import { formatCurrency } from '@/lib/utils'
import {
  calcAvailableBalance,
  canUnlock,
  deliveryEta,
  getDeliveryStatus,
  getDeliveryStatusLabel,
  isVirtualCardActive,
  MIN_DEPOSIT,
} from '@/mocks/cartao-data'
import { AddToWalletSection } from './AddToWalletSection'
import { VirtualCard } from './VirtualCard'

type Step = 'locked' | 'deposit' | 'depositConfirm' | 'data' | 'card'

export function CartaoPage() {
  const navigate = useNavigate()
  useUtmCapture()

  const {
    cpf,
    nome,
    loanAmount,
    withdrawnAmount,
    contactComplete,
    cartaoData,
    updateCartaoData,
    payCardDeposit,
    completeCardData,
    releaseDepositIfDelivered,
  } = useFlow()

  const [step, setStep] = useState<Step>('locked')
  const [depositInput, setDepositInput] = useState(String(cartaoData.depositAmount || MIN_DEPOSIT))
  const [depositError, setDepositError] = useState('')

  useEffect(() => {
    if (!cpf || !contactComplete) navigate('/criando')
  }, [cpf, contactComplete, navigate])

  useEffect(() => {
    releaseDepositIfDelivered()
  }, [releaseDepositIfDelivered])

  useEffect(() => {
    if (cartaoData.dataComplete) {
      setStep('card')
    } else if (cartaoData.depositPaid) {
      setStep('data')
    } else {
      setStep('locked')
    }
  }, [cartaoData.depositPaid, cartaoData.dataComplete])

  const availableBalance = calcAvailableBalance(
    loanAmount,
    cartaoData.depositPaid,
    cartaoData.depositAmount,
    cartaoData.depositReleased,
    withdrawnAmount,
  )

  const depositAmount = Number(depositInput.replace(/\D/g, '')) || 0

  const deliveryStatus = getDeliveryStatus(
    cartaoData.depositPaidAt,
    cartaoData.depositReleased,
  )
  const eta = deliveryEta(cartaoData.depositPaidAt)

  const virtualCardActive = isVirtualCardActive(
    cartaoData.dataComplete,
    cartaoData.depositPaidAt,
    cartaoData.depositReleased,
  )

  const cardLockMessage = !cartaoData.depositPaid
    ? `Depósito mínimo de ${formatCurrency(MIN_DEPOSIT)}`
    : !cartaoData.dataComplete
      ? 'Complete os dados de entrega'
      : 'Disponível após entrega do cartão físico'

  const holderName = useMemo(
    () => cartaoData.holderName || displayName(nome).toUpperCase(),
    [cartaoData.holderName, nome],
  )

  function goConta() {
    navigate(buildUrlWithUtms('/conta'))
  }

  function handleDepositContinue() {
    if (!canUnlock(depositAmount)) {
      setDepositError(`Depósito mínimo de ${formatCurrency(MIN_DEPOSIT)}`)
      return
    }
    if (depositAmount > availableBalance) {
      setDepositError('Saldo insuficiente na conta')
      return
    }
    setDepositError('')
    updateCartaoData({ depositAmount })
    setStep('depositConfirm')
  }

  function confirmDeposit() {
    payCardDeposit(depositAmount)
    updateCartaoData({
      holderName: displayName(nome).toUpperCase(),
    })
    setStep('data')
  }

  function handleDataSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { zip, address, number, neighborhood, city, state } = cartaoData
    if (!zip || !address || !number || !neighborhood || !city || !state) return
    completeCardData()
    setStep('card')
  }

  const isDataValid =
    cartaoData.zip.length >= 8 &&
    cartaoData.address.trim() &&
    cartaoData.number.trim() &&
    cartaoData.neighborhood.trim() &&
    cartaoData.city.trim() &&
    cartaoData.state.trim().length >= 2

  return (
    <div className="flex min-h-dvh flex-col bg-[#F4F5F7] text-text">
      <header className="sticky top-0 z-40 border-b border-border bg-white px-4 py-3.5">
        <div className="mx-auto flex max-w-[420px] items-center gap-3">
          <button type="button" onClick={goConta} className="text-sm font-semibold text-primary">
            Voltar
          </button>
          <SuperSimLogo height={28} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[420px] flex-1 px-4 py-5 pb-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <CreditCard className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Cartão SuperSim</h1>
            <p className="text-sm text-text-mid">Crédito pré-aprovado na sua conta</p>
          </div>
        </div>

        <VirtualCard
          holderName={holderName}
          cardNumber={cartaoData.cardNumber}
          cardExpiry={cartaoData.cardExpiry}
          cardCvv={cartaoData.cardCvv}
          locked={!virtualCardActive}
          lockMessage={cardLockMessage}
          className="mb-5"
        />

        {step === 'locked' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start gap-3">
                <Shield className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold text-text">Desbloqueie seu cartão</p>
                  <p className="mt-1 text-sm text-text-mid">
                    Faça um depósito mínimo de {formatCurrency(MIN_DEPOSIT)} para solicitar seu
                    cartão. O cartão virtual será ativado após a entrega do cartão físico.
                  </p>
                </div>
              </div>
              <p className="rounded-xl bg-[#FFFBEB] px-4 py-3 text-xs text-text-mid">
                Por segurança, os {formatCurrency(MIN_DEPOSIT)} ficam guardados na sua conta até a
                entrega do cartão físico (até 7 dias úteis).
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('deposit')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white"
            >
              Desbloquear com {formatCurrency(MIN_DEPOSIT)}
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}

        {step === 'deposit' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="mb-1 text-sm text-text-light">Saldo disponível</p>
              <p className="mb-4 text-2xl font-extrabold text-primary-dark">
                {formatCurrency(availableBalance)}
              </p>

              <label htmlFor="depositAmount" className="mb-2 block text-sm font-semibold text-text">
                Valor do depósito
              </label>
              <Input
                id="depositAmount"
                inputMode="numeric"
                value={depositInput}
                onChange={(e) => {
                  setDepositInput(e.target.value.replace(/\D/g, ''))
                  setDepositError('')
                }}
                placeholder={String(MIN_DEPOSIT)}
                className="mb-2 text-lg font-bold"
              />
              <p className="text-xs text-text-light">
                Mínimo: {formatCurrency(MIN_DEPOSIT)} · Máximo: {formatCurrency(availableBalance)}
              </p>
              {depositError && <p className="mt-2 text-sm text-danger">{depositError}</p>}
            </div>

            <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-sm text-text-mid">
              O valor depositado será retido como caução e devolvido ao saldo após a entrega do
              cartão físico.
            </div>

            <button
              type="button"
              onClick={handleDepositContinue}
              className="w-full rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white"
            >
              Continuar
            </button>
            <button
              type="button"
              onClick={() => setStep('locked')}
              className="w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-mid"
            >
              Voltar
            </button>
          </div>
        )}

        {step === 'depositConfirm' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="mb-4 text-sm text-text-mid">Confirme o depósito de caução:</p>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-text-light">Valor</dt>
                  <dd className="font-bold text-primary-dark">{formatCurrency(depositAmount)}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-text-light">Retenção</dt>
                  <dd className="text-right font-semibold">Até entrega do cartão</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-light">Prazo de entrega</dt>
                  <dd className="font-semibold">Até 7 dias</dd>
                </div>
              </dl>
            </div>

            <button
              type="button"
              onClick={confirmDeposit}
              className="w-full rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white"
            >
              Confirmar depósito
            </button>
            <button
              type="button"
              onClick={() => setStep('deposit')}
              className="w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-mid"
            >
              Editar valor
            </button>
          </div>
        )}

        {step === 'data' && (
          <form onSubmit={handleDataSubmit} className="space-y-4">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                <p className="font-bold text-text">Dados para entrega</p>
              </div>

              <div className="space-y-3">
                <Field label="Nome no cartão">
                  <Input
                    value={cartaoData.holderName || displayName(nome).toUpperCase()}
                    onChange={(e) => updateCartaoData({ holderName: e.target.value.toUpperCase() })}
                    maxLength={26}
                  />
                </Field>
                <Field label="CEP">
                  <Input
                    inputMode="numeric"
                    value={cartaoData.zip}
                    onChange={(e) =>
                      updateCartaoData({ zip: e.target.value.replace(/\D/g, '').slice(0, 8) })
                    }
                    placeholder="00000000"
                  />
                </Field>
                <Field label="Endereço">
                  <Input
                    value={cartaoData.address}
                    onChange={(e) => updateCartaoData({ address: e.target.value })}
                    placeholder="Rua, avenida..."
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Número">
                    <Input
                      value={cartaoData.number}
                      onChange={(e) => updateCartaoData({ number: e.target.value })}
                    />
                  </Field>
                  <Field label="Complemento">
                    <Input
                      value={cartaoData.complement}
                      onChange={(e) => updateCartaoData({ complement: e.target.value })}
                      placeholder="Apto, bloco..."
                    />
                  </Field>
                </div>
                <Field label="Bairro">
                  <Input
                    value={cartaoData.neighborhood}
                    onChange={(e) => updateCartaoData({ neighborhood: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Cidade" className="col-span-2">
                    <Input
                      value={cartaoData.city}
                      onChange={(e) => updateCartaoData({ city: e.target.value })}
                    />
                  </Field>
                  <Field label="UF">
                    <Input
                      value={cartaoData.state}
                      onChange={(e) =>
                        updateCartaoData({ state: e.target.value.toUpperCase().slice(0, 2) })
                      }
                      maxLength={2}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isDataValid}
              className="w-full rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white disabled:opacity-50"
            >
              Confirmar solicitação
            </button>
          </form>
        )}

        {step === 'card' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2
                  className={virtualCardActive ? 'size-5 text-green-600' : 'size-5 text-primary'}
                />
                <p className="font-bold text-text">
                  {virtualCardActive ? 'Cartão virtual ativo' : 'Solicitação confirmada'}
                </p>
              </div>
              <p className="text-sm text-text-mid">
                {virtualCardActive
                  ? 'Use os dados acima para compras online e pagamentos por aproximação.'
                  : 'Seu cartão físico será enviado para o endereço cadastrado. O cartão virtual será ativado automaticamente após a entrega.'}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Truck className="size-5 text-primary" />
                <p className="font-bold text-text">Entrega do cartão físico</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-light">Status</span>
                  <span className="font-semibold text-primary">
                    {getDeliveryStatusLabel(deliveryStatus)}
                  </span>
                </div>
                {eta && (
                  <div className="flex justify-between">
                    <span className="text-text-light">Previsão</span>
                    <span className="font-semibold">{eta.toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-light">Caução retida</span>
                  <span className="font-semibold">
                    {cartaoData.depositReleased
                      ? 'Liberada'
                      : formatCurrency(cartaoData.depositAmount)}
                  </span>
                </div>
              </div>
              {!cartaoData.depositReleased && (
                <p className="mt-3 rounded-xl bg-[#FFFBEB] px-3 py-2 text-xs text-text-mid">
                  {formatCurrency(cartaoData.depositAmount)} permanecem guardados até a confirmação
                  da entrega.
                </p>
              )}
            </div>

            <AddToWalletSection />

            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm text-sm">
              <p className="mb-1 font-bold text-text">Endereço de entrega</p>
              <p className="text-text-mid">
                {cartaoData.address}, {cartaoData.number}
                {cartaoData.complement ? ` — ${cartaoData.complement}` : ''}
                <br />
                {cartaoData.neighborhood} — {cartaoData.city}/{cartaoData.state}
                <br />
                CEP {cartaoData.zip.replace(/(\d{5})(\d{3})/, '$1-$2')}
              </p>
            </div>

            <button
              type="button"
              onClick={goConta}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white"
            >
              Ir para o saque
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-semibold uppercase text-text-light">{label}</span>
      {children}
    </label>
  )
}
