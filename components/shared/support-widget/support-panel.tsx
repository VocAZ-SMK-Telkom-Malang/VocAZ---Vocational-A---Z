// components/shared/support-widget/support-panel.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, ShieldCheck } from 'lucide-react'
import { SupportMessage } from './support-message'
import { SupportOptions } from './support-options'
import { SUPPORT_CONFIG } from './config'

export function SupportPanel() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [avatarError, setAvatarError] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState<string>(SUPPORT_CONFIG.avatarUrl)

  function handleAvatarError() {
    if (avatarSrc !== SUPPORT_CONFIG.avatarFallback) {
      setAvatarSrc(SUPPORT_CONFIG.avatarFallback)
    } else {
      setAvatarError(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="
        fixed bottom-24 right-6 z-[60]
        w-[calc(100vw-3rem)] max-w-[380px]
        max-h-[calc(100vh-8rem)]
        bg-surface-container-lowest rounded-3xl
        border border-outline-variant/30
        shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)]
        flex flex-col overflow-hidden
        origin-bottom-right
      "
    >
      {/* ============================================ */}
      {/* HEADER — clean, 1 nama aja */}
      {/* ============================================ */}
      <div className="relative shrink-0 px-5 py-4 bg-gradient-to-br from-primary via-primary-container to-[#B70011] text-white">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative flex items-center gap-3">
          {/* Avatar */}
          <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white ring-2 ring-white/30 shrink-0 p-1.5">
            {!avatarError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={SUPPORT_CONFIG.name}
                onError={handleAvatarError}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/20">
                <span className="text-white font-black text-base">
                  {SUPPORT_CONFIG.initial}
                </span>
              </div>
            )}

            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-primary" />
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black truncate">
                {SUPPORT_CONFIG.name}
              </h3>
              <ShieldCheck className="w-3.5 h-3.5 text-white/80 shrink-0" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-white/85 truncate">
                Online · Biasanya membalas dalam beberapa menit
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* BODY */}
      {/* ============================================ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Greeting — TANPA nama & subtitle (udah di header) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start gap-3"
        >
          {/* Avatar mini */}
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white shrink-0 ring-2 ring-white shadow-sm p-1">
            {!avatarError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={SUPPORT_CONFIG.name}
                onError={handleAvatarError}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white font-black text-sm">
                  {SUPPORT_CONFIG.initial}
                </span>
              </div>
            )}
          </div>

          {/* Bubble */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl rounded-tl-sm bg-surface-container-low/70 border border-outline-variant/20 px-3.5 py-2.5">
              <p className="text-xs sm:text-[13px] text-on-surface leading-relaxed">
                {SUPPORT_CONFIG.greeting}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Channels */}
        <SupportOptions />

        {/* FAQ */}
        <div className="pt-2 border-t border-outline-variant/20">
          <div className="flex items-center gap-1.5 px-1 mb-2">
            <HelpCircle className="w-3 h-3 text-on-surface-variant/60" />
            <p className="text-[10px] font-mono uppercase tracking-wider font-bold text-on-surface-variant/60">
              Pertanyaan Umum
            </p>
          </div>

          <div className="space-y-1.5">
            {SUPPORT_CONFIG.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.3 + idx * 0.05,
                  }}
                  className="rounded-xl bg-surface-container-low/40 border border-outline-variant/20 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-2 p-3 text-left hover:bg-surface-container-low/60 transition-colors"
                  >
                    <span className="text-xs font-bold text-on-surface">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-on-surface-variant shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-1">
                          <p className="text-[11px] text-on-surface-variant leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <div className="shrink-0 px-4 py-3 border-t border-outline-variant/20 bg-surface-container-low/40">
        <p className="text-[10px] text-on-surface-variant/70 text-center leading-relaxed">
          {SUPPORT_CONFIG.followUp}
        </p>
      </div>
    </motion.div>
  )
}