import { describe, expect, it } from 'vitest'
import {
  calcAvailableBalance,
  canUnlock,
  deliveryEta,
  generateCardNumber,
  getDeliveryStatus,
  isCardDelivered,
  isValidVisaCardNumber,
  isVirtualCardActive,
  MIN_DEPOSIT,
} from '@/mocks/cartao-data'

describe('cartao-data', () => {
  it('exige depósito mínimo de R$ 129', () => {
    expect(canUnlock(128)).toBe(false)
    expect(canUnlock(MIN_DEPOSIT)).toBe(true)
    expect(canUnlock(150)).toBe(true)
  })

  it('calcula saldo líquido descontando caução retida', () => {
    expect(calcAvailableBalance(10000, false, 129, false)).toBe(10000)
    expect(calcAvailableBalance(10000, true, 129, false)).toBe(9871)
    expect(calcAvailableBalance(10000, true, 129, true)).toBe(10000)
  })

  it('desconta valor já sacado do saldo disponível', () => {
    expect(calcAvailableBalance(10000, false, 129, false, 500)).toBe(9500)
    expect(calcAvailableBalance(9871, true, 129, false, 9871)).toBe(0)
  })

  it('prevê entrega em 7 dias', () => {
    const paidAt = '2026-01-01T12:00:00.000Z'
    const eta = deliveryEta(paidAt)
    expect(eta?.getDate()).toBe(8)
    expect(eta?.getMonth()).toBe(0)
  })

  it('libera cartão após 7 dias', () => {
    const paidAt = '2026-01-01T12:00:00.000Z'
    const before = new Date('2026-01-07T12:00:00.000Z')
    const after = new Date('2026-01-09T12:00:00.000Z')
    expect(isCardDelivered(paidAt, before)).toBe(false)
    expect(isCardDelivered(paidAt, after)).toBe(true)
  })

  it('só ativa cartão virtual após entrega', () => {
    const paidAt = '2026-01-01T12:00:00.000Z'
    const beforeDelivery = new Date('2026-01-05T12:00:00.000Z')
    const afterDelivery = new Date('2026-01-09T12:00:00.000Z')

    expect(isVirtualCardActive(true, paidAt, false, beforeDelivery)).toBe(false)
    expect(isVirtualCardActive(true, paidAt, false, afterDelivery)).toBe(true)
    expect(isVirtualCardActive(false, paidAt, false, afterDelivery)).toBe(false)
    expect(isVirtualCardActive(true, paidAt, true, beforeDelivery)).toBe(true)
  })

  it('gera número Visa com 16 dígitos, prefixo 4 e Luhn válido', () => {
    const number = generateCardNumber('12345678901')
    expect(number.replace(/\s/g, '')).toMatch(/^4\d{15}$/)
    expect(isValidVisaCardNumber(number)).toBe(true)
  })

  it('retorna status de entrega coerente', () => {
    const paidAt = '2026-01-01T12:00:00.000Z'
    expect(getDeliveryStatus(paidAt, false, new Date('2026-01-02T12:00:00.000Z'))).toBe('producao')
    expect(getDeliveryStatus(paidAt, false, new Date('2026-01-04T12:00:00.000Z'))).toBe('transito')
    expect(getDeliveryStatus(paidAt, true, new Date('2026-01-02T12:00:00.000Z'))).toBe('entregue')
  })
})
