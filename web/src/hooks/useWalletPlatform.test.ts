import { describe, expect, it, vi, afterEach } from 'vitest'
import { detectWalletPlatform } from '@/hooks/useWalletPlatform'

describe('detectWalletPlatform', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('detecta iPhone como ios', () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      platform: 'iPhone',
      maxTouchPoints: 5,
    })
    expect(detectWalletPlatform()).toBe('ios')
  })

  it('detecta Android como android', () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)',
      platform: 'Linux armv8l',
      maxTouchPoints: 5,
    })
    expect(detectWalletPlatform()).toBe('android')
  })

  it('detecta desktop como other', () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      platform: 'MacIntel',
      maxTouchPoints: 0,
    })
    expect(detectWalletPlatform()).toBe('other')
  })
})
