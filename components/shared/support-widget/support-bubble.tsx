// components/shared/support-widget/support-bubble.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import Image from 'next/image'

type Props = {
  isOpen: boolean
  onClick: () => void
}

export function SupportBubble({ isOpen, onClick }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? 'Tutup Help Center' : 'Buka Help Center'}
      className="
        fixed bottom-6 right-6 z-[60]
        w-14 h-14 sm:w-16 sm:h-16
        rounded-full
        bg-gradient-to-br from-primary to-primary-container
        shadow-[0_8px_30px_-4px_rgba(183,0,17,0.4)]
        hover:shadow-[0_12px_40px_-4px_rgba(183,0,17,0.55)]
        flex items-center justify-center
        transition-shadow
        group
      "
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse ring — hanya muncul kalau closed */}
      {!isOpen && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/40"
            animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.6,
            }}
          />
        </>
      )}

      {/* Icon content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle
                className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                strokeWidth={2.5}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}