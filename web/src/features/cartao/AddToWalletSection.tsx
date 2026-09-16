import { useState, type ReactNode } from 'react'
import { CheckCircle2, Smartphone } from 'lucide-react'
import { useFlow } from '@/context/FlowContext'
import { useWalletPlatform } from '@/hooks/useWalletPlatform'
import { isCardDelivered } from '@/mocks/cartao-data'
import { cn } from '@/lib/utils'

type WalletType = 'apple' | 'google'

interface AddToWalletSectionProps {
  className?: string
}

export function AddToWalletSection({ className }: AddToWalletSectionProps) {
  const platform = useWalletPlatform()
  const { cartaoData, addToWallet } = useFlow()
  const [loading, setLoading] = useState<WalletType | null>(null)
  const [error, setError] = useState('')

  const delivered = isCardDelivered(cartaoData.depositPaidAt)

  async function handleAdd(type: WalletType) {
    if (!delivered) {
      setError('Aguarde a entrega do cartão físico para adicionar à carteira digital.')
      return
    }

    const alreadyAdded = type === 'apple' ? cartaoData.applePayAdded : cartaoData.googlePayAdded
    if (alreadyAdded) return

    setError('')
    setLoading(type)
    await new Promise((r) => setTimeout(r, 1200))
    addToWallet(type)
    setLoading(null)
  }

  const showApple = platform === 'ios'
  const showGoogle = platform === 'android'
  const hasWalletButton = showApple || showGoogle

  return (
    <div className={cn('rounded-2xl border border-border bg-white p-5 shadow-sm', className)}>
      <div className="mb-3 flex items-center gap-2">
        <Smartphone className="size-5 text-primary" />
        <p className="font-bold text-text">Carteira digital</p>
      </div>

      <p className="mb-4 text-sm text-text-mid">
        {delivered
          ? 'Seu cartão físico foi entregue. Adicione-o à carteira do seu celular para pagar por aproximação.'
          : 'Após a entrega do cartão físico, você poderá adicioná-lo à carteira digital do seu celular.'}
      </p>

      {hasWalletButton ? (
        <div className="space-y-3">
          {showApple && (
            <AppleWalletButton
              added={cartaoData.applePayAdded}
              enabled={delivered}
              loading={loading === 'apple'}
              onClick={() => handleAdd('apple')}
            />
          )}
          {showGoogle && (
            <GoogleWalletButton
              added={cartaoData.googlePayAdded}
              enabled={delivered}
              loading={loading === 'google'}
              onClick={() => handleAdd('google')}
            />
          )}
        </div>
      ) : (
        <p className="rounded-xl bg-[#F9FAFB] px-4 py-3 text-sm text-text-mid">
          Abra esta página no seu iPhone para Apple Wallet ou no Android para Google Wallet.
        </p>
      )}

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </div>
  )
}

function WalletBadgeButton({
  added,
  addedLabel,
  ariaLabel,
  enabled,
  loading,
  loadingLabel,
  onClick,
  icon,
  line1,
  line2,
}: {
  added: boolean
  addedLabel: string
  ariaLabel: string
  enabled: boolean
  loading: boolean
  loadingLabel: string
  onClick: () => void
  icon: ReactNode
  line1: string
  line2: string
}) {
  if (added) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3.5 text-sm font-semibold text-green-700">
        <CheckCircle2 className="size-5" />
        {addedLabel}
      </div>
    )
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={!enabled}
      className={cn(
        'flex h-[52px] w-full items-center gap-3 rounded-[10px] border border-[#A6A6A6] bg-black px-4 text-left text-white transition-opacity',
        (!enabled || loading) && 'cursor-not-allowed opacity-45',
      )}
    >
      {loading ? (
        <span className="w-full text-center text-sm font-semibold">{loadingLabel}</span>
      ) : (
        <>
          <span className="shrink-0">{icon}</span>
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] font-normal tracking-wide">{line1}</span>
            <span className="text-[15px] font-semibold tracking-tight">{line2}</span>
          </span>
        </>
      )}
    </button>
  )
}

function AppleWalletButton({
  added,
  enabled,
  loading,
  onClick,
}: {
  added: boolean
  enabled: boolean
  loading: boolean
  onClick: () => void
}) {
  return (
    <WalletBadgeButton
      added={added}
      addedLabel="Adicionado à Carteira da Apple"
      ariaLabel="Adicionar à Carteira da Apple"
      enabled={enabled}
      loading={loading}
      loadingLabel="Adicionando..."
      onClick={onClick}
      line1="Adicionar à"
      line2="Carteira da Apple"
      icon={<AppleWalletIcon />}
    />
  )
}

function GoogleWalletButton({
  added,
  enabled,
  loading,
  onClick,
}: {
  added: boolean
  enabled: boolean
  loading: boolean
  onClick: () => void
}) {
  return (
    <WalletBadgeButton
      added={added}
      addedLabel="Adicionado à Carteira do Google"
      ariaLabel="Adicionar à Carteira do Google"
      enabled={enabled}
      loading={loading}
      loadingLabel="Adicionando..."
      onClick={onClick}
      line1="Adicionar à"
      line2="Google Wallet"
      icon={<GoogleWalletIcon />}
    />
  )
}

function AppleWalletIcon() {
  return (
    <svg width="38" height="30" viewBox="0 0 38 30" fill="none" aria-hidden>
      <path
        d="M5 9C5 6.79086 6.79086 5 9 5H29C31.2091 5 33 6.79086 33 9V23C33 25.2091 31.2091 27 29 27H9C6.79086 27 5 25.2091 5 23V9Z"
        fill="#D1D1D6"
      />
      <path
        d="M9 7H29C30.1046 7 31 7.89543 31 9V11H7V9C7 7.89543 7.89543 7 9 7Z"
        fill="#007AFF"
      />
      <path d="M7 12H31V14H7V12Z" fill="#FFD60A" />
      <path d="M7 15H31V17H7V15Z" fill="#34C759" />
      <path
        d="M7 18H31V23C31 24.1046 30.1046 25 29 25H9C7.89543 25 7 24.1046 7 23V18Z"
        fill="#FF3B30"
      />
      <path
        d="M3 11C3 9.34315 4.34315 8 6 8H32C33.6569 8 35 9.34315 35 11V23C35 24.6569 33.6569 26 32 26H6C4.34315 26 3 24.6569 3 23V11Z"
        fill="#F5F5F7"
      />
      <path
        d="M6 10H32C33.1046 10 34 10.8954 34 12V22C34 23.1046 33.1046 24 32 24H6C4.89543 24 4 23.1046 4 22V12C4 10.8954 4.89543 10 6 10Z"
        fill="#E5E5EA"
      />
    </svg>
  )
}

function GoogleWalletIcon() {
  return (
    <svg width="38" height="30" viewBox="0 0 38 30" fill="none" aria-hidden>
      <path
        d="M8 8H30C32.2091 8 34 9.79086 34 12V22C34 24.2091 32.2091 26 30 26H8C5.79086 26 4 24.2091 4 22V12C4 9.79086 5.79086 8 8 8Z"
        fill="#4285F4"
      />
      <path
        d="M6 10H32C33.6569 10 35 11.3431 35 13V15H3V13C3 11.3431 4.34315 10 6 10Z"
        fill="#EA4335"
      />
      <path d="M3 16H35V18H3V16Z" fill="#FBBC04" />
      <path
        d="M3 19H35V21C35 22.6569 33.6569 24 32 24H6C4.34315 24 3 22.6569 3 21V19Z"
        fill="#34A853"
      />
    </svg>
  )
}
