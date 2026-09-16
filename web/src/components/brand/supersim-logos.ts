/**
 * Catálogo de logos SuperSim disponíveis no app.
 * @see https://www.supersim.com.br
 */
export const SUPERSIM_LOGOS = {
  /** Logo compacto para fundos claros (SVG). */
  default: {
    src: '/assets/supersim-logo.svg',
    alt: 'SuperSim',
    source: 'local',
  },
  /** Logo para fundos laranja (SVG). */
  onOrange: {
    src: '/assets/supersim-logo-on-orange.svg',
    alt: 'SuperSim — crédito pra vida real',
    source: 'local',
  },
  /** Logo completo colorido (PNG). */
  full: {
    src: '/assets/supersim-logo-full.png',
    alt: 'SuperSim',
    source: 'local',
  },
  /** Logo em escala de cinza (PNG). */
  grayscale: {
    src: '/assets/supersim-logo-grayscale.png',
    alt: 'SuperSim',
    source: 'https://www.supersim.com.br/image/logo-supersim-grayscale.png',
  },
} as const

export type SuperSimLogoVariant = keyof typeof SUPERSIM_LOGOS

export function getSuperSimLogo(variant: SuperSimLogoVariant = 'default') {
  return SUPERSIM_LOGOS[variant]
}
