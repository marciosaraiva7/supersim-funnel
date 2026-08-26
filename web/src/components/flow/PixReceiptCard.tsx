import { Check } from 'lucide-react'
import { SuperSimLogo } from '@/components/brand/SuperSimLogo'
import { formatCurrency } from '@/lib/utils'

interface PixReceiptCardProps {
  amount: number
  nome: string
  cpf: string
  pixKey: string
  bankName: string
  installments: number
  monthlyPayment: number
}

export function PixReceiptCard({
  amount,
  nome,
  cpf,
  pixKey,
  bankName,
  installments,
  monthlyPayment,
}: PixReceiptCardProps) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('pt-BR')
  const timeStr = now.toLocaleTimeString('pt-BR')
  const txId = `E${Date.now().toString().slice(5)}`

  return (
    <div className="mx-1 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border bg-[#F9FAFB] px-4 py-3 text-center">
        <SuperSimLogo height={22} className="mx-auto mb-2" />
        <p className="text-sm font-bold text-text">Comprovante PIX</p>
        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
          <Check className="size-3" strokeWidth={3} />
          Concluído
        </span>
      </div>
      <div className="border-b border-border px-4 py-4 text-center">
        <p className="text-[11px] font-semibold uppercase text-text-light">Valor</p>
        <p className="text-2xl font-extrabold text-primary-dark">{formatCurrency(amount)}</p>
      </div>
      <div className="space-y-2.5 px-4 py-3 text-xs">
        <ReceiptRow label="De" value="SuperSim Soluções Financeiras S.A. CNPJ 02.038.232/0001-64" />
        <ReceiptRow label="Para" value={`${nome}\nCPF ${cpf}`} />
        <ReceiptRow label="Chave PIX" value={pixKey} />
        <ReceiptRow label="Banco Destino" value={bankName} />
        <ReceiptRow
          label="Parcelas"
          value={`${installments}x de ${formatCurrency(monthlyPayment)}`}
        />
        <ReceiptRow label="Data/Hora" value={`${dateStr} ${timeStr}`} />
        <ReceiptRow label="ID Transação" value={txId} />
      </div>
      <p className="border-t border-border px-4 py-2 text-center text-[10px] text-text-light">
        Transação realizada via PIX
      </p>
    </div>
  )
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="shrink-0 font-semibold text-text-light">{label}</span>
      <span className="whitespace-pre-line text-right font-medium text-text">{value}</span>
    </div>
  )
}
