import { useCallback, useEffect, useState } from 'react'
import { fetchTacPixCopiaCola } from '@/lib/tac-pix-api'

export function useTacPixCode(amount: number) {
  const [copiaCola, setCopiaCola] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const charge = await fetchTacPixCopiaCola(amount)
      setCopiaCola(charge.copiaCola)
    } catch {
      setError('Não foi possível gerar o código PIX. Tente novamente.')
      setCopiaCola('')
    } finally {
      setLoading(false)
    }
  }, [amount])

  useEffect(() => {
    load()
  }, [load])

  async function copy() {
    if (!copiaCola) return
    try {
      await navigator.clipboard.writeText(copiaCola)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setError('Não foi possível copiar. Selecione o código manualmente.')
    }
  }

  return { copiaCola, loading, error, copied, copy, reload: load }
}
