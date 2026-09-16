import { cn } from '@/lib/utils'
import { getSuperSimLogo, type SuperSimLogoVariant } from './supersim-logos'

export type { SuperSimLogoVariant }

interface SuperSimLogoProps {
  className?: string
  height?: number
  /** Variante do catálogo de logos. `onOrange` usa SVG inline com tagline opcional. */
  variant?: SuperSimLogoVariant
  /** Exibe a tagline "crédito pra vida real" (apenas variant `onOrange`). */
  showTagline?: boolean
}

const FONT = "'Baloo 2', cursive"

export function SuperSimLogo({
  className,
  height = 28,
  variant = 'default',
  showTagline = false,
}: SuperSimLogoProps) {
  if (variant === 'onOrange') {
    const scale = height / (showTagline ? 72 : 48)
    const width = (showTagline ? 280 : 200) * scale

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={showTagline ? '0 0 280 72' : '0 0 200 48'}
        width={width}
        height={height}
        role="img"
        aria-label={getSuperSimLogo('onOrange').alt}
        className={cn('shrink-0', className)}
      >
        <text
          x={showTagline ? 4 : 3}
          y={showTagline ? 46 : 38}
          fontFamily={FONT}
          fontSize={showTagline ? 44 : 36}
          fontWeight={800}
          fontStyle="italic"
          fill="#0B2D6B"
        >
          $uper Sim
        </text>
        <text
          x={showTagline ? 0 : 0}
          y={showTagline ? 42 : 34}
          fontFamily={FONT}
          fontSize={showTagline ? 44 : 36}
          fontWeight={800}
          fontStyle="italic"
          fill="#F9D024"
        >
          $uper
        </text>
        <text
          x={showTagline ? 138 : 112}
          y={showTagline ? 42 : 34}
          fontFamily={FONT}
          fontSize={showTagline ? 44 : 36}
          fontWeight={800}
          fontStyle="italic"
          fill="#FFFFFF"
        >
          Sim
        </text>
        {showTagline && (
          <text
            x={2}
            y={66}
            fontFamily={FONT}
            fontSize={15}
            fontWeight={600}
            fontStyle="italic"
            fill="#0B2D6B"
          >
            crédito pra vida real
          </text>
        )}
      </svg>
    )
  }

  const logo = getSuperSimLogo(variant)

  return (
    <img
      src={logo.src}
      alt={logo.alt}
      className={cn('w-auto', className)}
      style={{ height }}
    />
  )
}
