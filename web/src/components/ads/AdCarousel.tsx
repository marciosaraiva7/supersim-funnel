import { useCallback, useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { AdBanner } from '@/mocks/ad-banners'
import { cn } from '@/lib/utils'

const AUTOPLAY_MS = 5000

interface AdCarouselProps {
  banners: AdBanner[]
  className?: string
  onBannerClick?: (banner: AdBanner) => void
}

function AdSlide({
  banner,
  isActive,
  zoomIn,
  onClick,
}: {
  banner: AdBanner
  isActive: boolean
  zoomIn: boolean
  onClick?: () => void
}) {
  const fit = banner.objectFit ?? 'cover'

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full shrink-0 overflow-hidden text-left"
      aria-label={`${banner.title}. ${banner.description}`}
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[2/1]"
        style={{
          backgroundColor: banner.backgroundColor ?? '#F4F5F7',
          ['--ad-carousel-zoom-ms' as string]: `${AUTOPLAY_MS}ms`,
        }}
      >
        <img
          key={isActive ? `zoom-${banner.id}` : banner.id}
          src={banner.image}
          alt=""
          aria-hidden
          draggable={false}
          className={cn(
            'size-full will-change-transform',
            fit === 'contain' ? 'object-contain p-1' : 'object-cover',
            isActive && (zoomIn ? 'ad-carousel-zoom-in' : 'ad-carousel-zoom-out'),
          )}
          style={{ objectPosition: banner.objectPosition ?? 'center' }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />

        <div className="absolute inset-x-0 bottom-0 p-4 pt-10">
          <p className="mb-1 text-base font-bold leading-tight text-white">{banner.title}</p>
          <p className="text-xs leading-relaxed text-white/90">{banner.description}</p>
          {onClick && (
            <span className="mt-2 inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#FFE566] transition-transform group-active:translate-x-0.5">
              Saiba mais
              <ChevronRight className="size-3.5" />
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export function AdCarousel({ banners, className, onBannerClick }: AdCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const count = banners.length

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return
      setActiveIndex(((index % count) + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (count <= 1) return
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [count])

  if (count === 0) return null

  return (
    <div className={cn('mb-4', className)}>
      <div className="relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <AdSlide
              key={banner.id}
              banner={banner}
              isActive={index === activeIndex}
              zoomIn={index % 2 === 0}
              onClick={onBannerClick ? () => onBannerClick(banner) : undefined}
            />
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-2.5 flex items-center justify-center gap-1.5">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              aria-label={`${banner.title} — slide ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => goTo(index)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                index === activeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-[#D1D5DB]',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
