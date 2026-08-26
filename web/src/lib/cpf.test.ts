import { describe, expect, it } from 'vitest'
import { isValidCpf, maskCpf } from '@/lib/cpf'

describe('cpf', () => {
  it('maskCpf mascarar dígitos centrais', () => {
    expect(maskCpf('12345678901')).toBe('123.***.***-01')
  })

  it('isValidCpf rejeita sequência repetida', () => {
    expect(isValidCpf('111.111.111-11')).toBe(false)
  })

  it('isValidCpf aceita CPF válido conhecido', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true)
  })

  it('isValidCpf rejeita dígito verificador inválido', () => {
    expect(isValidCpf('123.456.789-00')).toBe(false)
  })
})
