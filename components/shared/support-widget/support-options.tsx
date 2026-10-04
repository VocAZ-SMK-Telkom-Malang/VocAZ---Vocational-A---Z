// components/shared/support-widget/support-options.tsx
'use client'

import { motion } from 'framer-motion'
import {
  MessageCircle,
  Mail,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { SUPPORT_CONFIG } from './config'

const ICONS: Record<string, any> = {
  MessageCircle,
  Mail,
}

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    ring: 'ring-emerald-200',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    ring: 'ring-blue-200',
  },
}

export function SupportOptions() {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-mono uppercase tracking-wider font-bold text-on-surface-variant/60 px-1">
        Kanal Komunikasi
      </p>

      {SUPPORT_CONFIG.channels.map((channel, idx) => {
        const Icon = ICONS[channel.icon] ?? MessageCircle
        const colors = COLOR_MAP[channel.color] ?? COLOR_MAP.blue
        const href =
          channel.id === 'whatsapp'
            ? channel.href(SUPPORT_CONFIG.whatsapp)
            : channel.href(SUPPORT_CONFIG.email)

        return (
          <motion.a
            key={channel.id}
            href={href}
            target={channel.external ? '_blank' : undefined}
            rel={channel.external ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.15 + idx * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              group flex items-center gap-3 p-3 rounded-xl
              bg-white border border-outline-variant/30
              hover:border-primary/30 hover:shadow-[0_4px_16px_-6px_rgba(183,0,17,0.15)]
              transition-all
            "
          >
            <div
              className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.ring} ring-1 flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-5 h-5 ${colors.text}`} strokeWidth={2.5} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-on-surface truncate">
                {channel.label}
              </div>
              <div className="text-[11px] text-on-surface-variant truncate">
                {channel.description}
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-on-surface-variant/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </motion.a>
        )
      })}
    </div>
  )
}