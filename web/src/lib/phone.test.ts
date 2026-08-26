import { describe, expect, it } from 'vitest'
import { formatPhone, isValidEmail, isValidPhone } from '@/lib/phone'

describe('phone', () => {
  it('formatPhone formata celular 11 dígitos', () => {
    expect(formatPhone('11999998888')).toBe('(11) 99999-8888')
  })

  it('isValidPhone exige ao menos 10 dígitos', () => {
    expect(isValidPhone('1199999888')).toBe(true)
    expect(isValidPhone('123')).toBe(false)
  })

  it('isValidEmail valida formato básico', () => {
    expect(isValidEmail('maria@email.com')).toBe(true)
    expect(isValidEmail('invalido')).toBe(false)
  })
})
