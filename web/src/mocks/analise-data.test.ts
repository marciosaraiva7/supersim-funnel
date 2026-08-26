import { describe, expect, it } from 'vitest'
import { calcInstallmentValue } from '@/mocks/analise-data'

describe('calcInstallmentValue', () => {
  it('calcula parcela positiva para empréstimo padrão', () => {
    const monthly = calcInstallmentValue(10000, 12)
    expect(monthly).toBeGreaterThan(800)
    expect(monthly).toBeLessThan(1200)
  })

  it('aumenta parcela com prazo maior', () => {
    const shortTerm = calcInstallmentValue(10000, 12)
    const longTerm = calcInstallmentValue(10000, 48)
    expect(longTerm).toBeLessThan(shortTerm)
  })
})
