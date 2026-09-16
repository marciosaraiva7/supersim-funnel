import { APP_ASSET_IMAGES } from '@/lib/app-assets'

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

/** Precarrega imagens estáticas no cache do navegador. */
export function preloadAppImages(): Promise<void> {
  const uniqueSources = [...new Set(APP_ASSET_IMAGES)]
  return Promise.all(uniqueSources.map(preloadImage)).then(() => undefined)
}
