import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SOCIAL_PROOF_NAMES } from '@/mocks/flow-data'

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomAmount() {
  const amount = Math.floor(Math.random() * 41) * 50 + 3000
  return `R$ ${amount.toLocaleString('pt-BR')}`
}

export function SocialProofToast() {
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState({
    name: 'Mariana Oliveira',
    city: 'Florianópolis',
    amount: 'R$ 4.550',
  })

  const refreshContent = useCallback(() => {
    setContent({
      name: `${pick(SOCIAL_PROOF_NAMES.firstNames)} ${pick(SOCIAL_PROOF_NAMES.lastNames)}`,
      city: pick(SOCIAL_PROOF_NAMES.cities),
      amount: randomAmount(),
    })
  }, [])

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>
    let nextTimer: ReturnType<typeof setTimeout>

    function showToast() {
      refreshContent()
      setVisible(true)
      hideTimer = setTimeout(() => setVisible(false), 5000)
      nextTimer = setTimeout(showToast, 10000 + Math.random() * 10000)
    }

    const initialTimer = setTimeout(showToast, 8000)

    return () => {
      clearTimeout(initialTimer)
      clearTimeout(hideTimer)
      clearTimeout(nextTimer)
    }
  }, [refreshContent])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: '120%', opacity: 0, scale: 0.92 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: '120%', opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="fixed right-2.5 top-[max(42px,calc(env(safe-area-inset-top)+80px))] z-[999] flex max-w-[240px] items-center gap-2 rounded-xl border border-black/5 bg-white/97 p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl"
          role="status"
          aria-live="polite"
        >
          <img
            src="/assets/supericon.png"
            alt=""
            className="size-[30px] rounded-full object-cover"
          />
          <p className="text-xs leading-snug text-[#444]">
            <strong className="text-[#111]">{content.name}</strong> de{' '}
            {content.city} conseguiu{' '}
            <strong className="text-[#111]">{content.amount}</strong>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
