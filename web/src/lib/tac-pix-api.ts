import { TAC_BANK, TAC_PIX_KEY } from '@/mocks/cartao-data'

export interface TacPixCharge {
  copiaCola: string
  amount: number
  beneficiary: string
  pixKey: string
}

/**
 * Gera payload PIX Copia e Cola (mock).
 * Substituir por chamada à API real quando disponível.
 */
export async function fetchTacPixCopiaCola(amount: number): Promise<TacPixCharge> {
  await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 600))

  return {
    copiaCola: buildMockPixCopiaCola(amount),
    amount,
    beneficiary: TAC_BANK,
    pixKey: TAC_PIX_KEY,
  }
}

function buildMockPixCopiaCola(amount: number): string {
  const value = amount.toFixed(2)
  const txId = `TAC${Date.now().toString(36).toUpperCase().slice(-8)}`
  const cnpj = TAC_PIX_KEY.replace(/\D/g, '')

  return [
    '000201',
    '2658',
    '0014',
    'br.gov.bcb.pix',
    `0136${cnpj}${'0'.repeat(22 - cnpj.length)}`,
    '52040000',
    '5303986',
    `54${String(value.length).padStart(2, '0')}${value}`,
    '5802BR',
    '5925SuperSim Solucoes Finance',
    '6009SAO PAULO',
    `62${String(7 + txId.length).padStart(2, '0')}0503${txId}`,
    '6304A1B2',
  ].join('')
}
