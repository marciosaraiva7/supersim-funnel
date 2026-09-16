import { SUPERSIM_LOGOS } from '@/components/brand/supersim-logos'
import { AD_BANNERS } from '@/mocks/ad-banners'

/** Imagens estáticas servidas em /public/assets. */
export const APP_ASSET_IMAGES = [
  ...Object.values(SUPERSIM_LOGOS).map((logo) => logo.src),
  '/assets/caps-illustration.png',
  '/assets/attendant.png',
  '/assets/supericon.png',
  ...AD_BANNERS.map((banner) => banner.image),
] as const

export type AppAssetImage = (typeof APP_ASSET_IMAGES)[number]
