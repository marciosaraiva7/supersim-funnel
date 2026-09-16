import { useMemo } from 'react'

export type WalletPlatform = 'ios' | 'android' | 'other'

export function detectWalletPlatform(): WalletPlatform {
  if (typeof navigator === 'undefined') return 'other'

  const ua = navigator.userAgent
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  if (isIOS) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'other'
}

export function useWalletPlatform() {
  return useMemo(() => detectWalletPlatform(), [])
}
