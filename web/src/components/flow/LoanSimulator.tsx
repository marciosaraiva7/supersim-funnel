import { Slider } from '@/components/ui/slider'
import { LOAN } from '@/mocks/flow-data'
import { calculateInstallment, formatCurrency } from '@/lib/utils'

interface LoanSimulatorProps {
  value: number
  onChange: (value: number) => void
}

export function LoanSimulator({ value, onChange }: LoanSimulatorProps) {
  const installment = calculateInstallment(value)

  return (
    <div id="simulador" className="rounded-[18px] bg-primary-subtle p-5">
      <div className="mb-4 text-center">
        <p className="text-sm font-semibold text-[#92400E]">Simule seu empréstimo</p>
        <p className="text-3xl font-extrabold text-[#78350F]">
          {formatCurrency(value)}
        </p>
      </div>
      <div className="mb-2 px-1">
        <Slider
          min={LOAN.min}
          max={LOAN.max}
          step={500}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
        />
        <div className="mt-2 flex justify-between text-xs font-semibold text-text-light">
          <span>R$ 1.000</span>
          <span>R$ 30.000</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white px-3 py-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wide text-text-light">
            Parcelas
          </p>
          <p className="text-sm font-bold text-text">
            {LOAN.installments}x {formatCurrency(installment)}
          </p>
        </div>
        <div className="rounded-xl bg-white px-3 py-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wide text-text-light">
            Taxa
          </p>
          <p className="text-sm font-bold text-primary">{LOAN.rateLabel}</p>
        </div>
      </div>
    </div>
  )
}
