import { useEffect } from 'react'
import { captureUtmsFromUrl } from '@/lib/utm'

export function useUtmCapture() {
  useEffect(() => {
    captureUtmsFromUrl()
  }, [])
}
