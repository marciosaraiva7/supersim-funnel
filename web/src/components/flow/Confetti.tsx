import { useEffect, useState } from 'react'

const COLORS = ['#FB9637', '#E8850A', '#111827', '#FFD700', '#4ECDC4']

export function Confetti() {
  const [pieces, setPieces] = useState<
    { id: number; left: number; color: string; duration: number }[]
  >([])

  useEffect(() => {
    const next = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: Math.random() * 2 + 2,
    }))
    setPieces(next)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 size-2 rounded-sm opacity-90"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s ease-in forwards`,
            animationDelay: `${p.id * 50}ms`,
          }}
        />
      ))}
    </div>
  )
}
