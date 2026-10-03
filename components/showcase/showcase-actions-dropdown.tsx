// components/shared/showcase/showcase-actions-dropdown.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import {
  MoreVertical,
  UserPlus,
  MessageSquare,
  Bookmark,
  Share2,
  Eye,
  Send,
  CheckCircle2,
} from 'lucide-react'

export type ShowcaseAction = {
  id: string
  label: string
  icon: 'invite' | 'chat' | 'save' | 'share' | 'view' | 'applied' | 'invited'
  onClick: () => void
  variant?: 'default' | 'primary' | 'danger' | 'disabled'
  disabled?: boolean
}

type Props = {
  actions: ShowcaseAction[]
}

const ICONS = {
  invite: UserPlus,
  chat: MessageSquare,
  save: Bookmark,
  share: Share2,
  view: Eye,
  applied: CheckCircle2,
  invited: Send,
}

export function ShowcaseActionsDropdown({ actions }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  if (actions.length === 0) return null

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setOpen((v) => !v)
        }}
        className="w-8 h-8 rounded-full bg-surface-container/80 backdrop-blur-sm hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-52 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xl overflow-hidden z-30"
          onClick={(e) => e.stopPropagation()}
        >
          {actions.map((a) => {
            const Icon = ICONS[a.icon]
            const isDanger = a.variant === 'danger'
            const isDisabled = a.disabled || a.variant === 'disabled'

            return (
              <button
                key={a.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  if (isDisabled) return
                  setOpen(false)
                  a.onClick()
                }}
                disabled={isDisabled}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-left transition-colors
                  ${
                    isDisabled
                      ? 'text-on-surface-variant/50 cursor-not-allowed'
                      : isDanger
                      ? 'text-error hover:bg-error/5'
                      : 'text-on-surface hover:bg-surface-container'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{a.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}