// components/shared/support-widget/support-message.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  avatarUrl: string
  avatarFallback?: string
  initial?: string
  name: string
  subtitle?: string
  message: string
  delay?: number
}

export function SupportMessage({
  avatarUrl,
  avatarFallback,
  initial = 'V',
  name,
  subtitle,
  message,
  delay = 0,
}: Props) {
  const [imgSrc, setImgSrc] = useState(avatarUrl)
  const [imgError, setImgError] = useState(false)

  function handleError() {
    if (imgSrc !== avatarFallback && avatarFallback) {
      setImgSrc(avatarFallback)
    } else {
      setImgError(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-3"
    >
      {/* Avatar */}
      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white shrink-0 ring-2 ring-white shadow-sm p-1">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={name}
            onError={handleError}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white font-black text-sm">{initial}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs font-bold text-on-surface truncate">
            {name}
          </span>
          {subtitle && (
            <span className="text-[10px] text-on-surface-variant/70 truncate">
              · {subtitle}
            </span>
          )}
        </div>

        <div className="rounded-2xl rounded-tl-sm bg-surface-container-low/70 border border-outline-variant/20 px-3.5 py-2.5">
          <p className="text-xs sm:text-[13px] text-on-surface leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  )
}