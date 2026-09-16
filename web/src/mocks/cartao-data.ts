export const MIN_DEPOSIT = 129
export const DELIVERY_DAYS = 7
export const TAC_AMOUNT = 89
export const TAC_REFUND_AFTER_INSTALLMENTS = 3
export const TAC_RELEASE_MAX_HOURS = 2

/** Simula confirmação bancária no protótipo. Substituir pela API real. */
export const TAC_MOCK_RELEASE_MS_MIN = 15_000
export const TAC_MOCK_RELEASE_MS_MAX = 30_000

export function isTacPending(tacSubmittedAt: string | null, tacPaid: boolean) {
  return !!tacSubmittedAt && !tacPaid
}

export const TAC_PIX_KEY = '02.038.232/0001-64'
export const TAC_BANK = 'SuperSim Soluções Financeiras S.A.'

/** Aviso legal — cobrança única da TAC na abertura de crédito. */
export const TAC_SINGLE_CHARGE_NOTICE =
  'A Taxa de Abertura de Crédito (TAC) é cobrada apenas uma vez, exclusivamente na abertura do crédito para a utilização do empréstimo. É proibido por lei cobrar a TAC mais de uma vez.'

export type DeliveryStatus = 'producao' | 'transito' | 'entregue'

export function canUnlock(amount: number) {
  return amount >= MIN_DEPOSIT
}

export function deliveryEta(paidAt: string | null) {
  if (!paidAt) return null
  const eta = new Date(paidAt)
  eta.setDate(eta.getDate() + DELIVERY_DAYS)
  return eta
}

export function isCardDelivered(paidAt: string | null, now = new Date()) {
  const eta = deliveryEta(paidAt)
  if (!eta) return false
  return now >= eta
}

export function isVirtualCardActive(
  dataComplete: boolean,
  depositPaidAt: string | null,
  depositReleased: boolean,
  now = new Date(),
) {
  if (!dataComplete) return false
  return depositReleased || isCardDelivered(depositPaidAt, now)
}

export function getDeliveryStatus(
  paidAt: string | null,
  depositReleased: boolean,
  now = new Date(),
): DeliveryStatus {
  if (!paidAt) return 'producao'
  if (depositReleased || isCardDelivered(paidAt, now)) return 'entregue'
  const paid = new Date(paidAt)
  const transitStart = new Date(paid)
  transitStart.setDate(transitStart.getDate() + 2)
  if (now >= transitStart) return 'transito'
  return 'producao'
}

export function getDeliveryStatusLabel(status: DeliveryStatus) {
  switch (status) {
    case 'producao':
      return 'Em produção'
    case 'transito':
      return 'Em trânsito'
    case 'entregue':
      return 'Entregue'
  }
}

export function calcAvailableBalance(
  loanAmount: number,
  depositPaid: boolean,
  depositAmount: number,
  depositReleased: boolean,
  withdrawnAmount = 0,
) {
  const gross =
    !depositPaid || depositReleased ? loanAmount : Math.max(0, loanAmount - depositAmount)
  return Math.max(0, gross - withdrawnAmount)
}

function luhnCheckDigit(partial15: string) {
  const digits = partial15.split('').map(Number)
  let sum = 0
  let double = true
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i]
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return (10 - (sum % 10)) % 10
}

export function isValidVisaCardNumber(number: string) {
  const digits = number.replace(/\s/g, '')
  if (!/^4\d{15}$/.test(digits)) return false
  const check = luhnCheckDigit(digits.slice(0, 15))
  return check === Number(digits[15])
}

/** Gera número Visa: 16 dígitos, prefixo 4, válido pelo algoritmo de Luhn. */
export function generateCardNumber(seed: string) {
  const raw = seed.replace(/\D/g, '')
  let body = '4'
  for (let i = 0; i < 14; i++) {
    body += raw[i % raw.length] || String((i * 7 + 3) % 10)
  }
  body = body.slice(0, 15)
  const full = body + luhnCheckDigit(body)
  return `${full.slice(0, 4)} ${full.slice(4, 8)} ${full.slice(8, 12)} ${full.slice(12, 16)}`
}

export function generateCardExpiry() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = String((now.getFullYear() + 5) % 100).padStart(2, '0')
  return `${month}/${year}`
}

export function generateCardCvv(seed: string) {
  const digits = seed.replace(/\D/g, '')
  const sum = digits.split('').reduce((acc, d) => acc + Number(d), 0)
  return String((sum * 7 + 123) % 900 + 100)
}

export function formatCardNumber(number: string, masked: boolean) {
  if (masked) {
    const last4 = number.replace(/\s/g, '').slice(-4)
    return `•••• •••• •••• ${last4}`
  }
  return number
}
