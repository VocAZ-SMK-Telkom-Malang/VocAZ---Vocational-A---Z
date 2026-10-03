// components/shared/notifications/notification-item.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Bell,
  Trash2,
  Circle,
  Loader2,
} from 'lucide-react'
import {
  markNotificationAsRead,
  deleteNotification,
} from '@/app/actions/notifications'
import type { NotificationItem } from '@/lib/queries/notifications'

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  message: MessageSquare,
  application_update: Briefcase,
  verification: ShieldCheck,
  opportunity: Sparkles,
  system: Bell,
}

const TYPE_COLOR: Record<string, string> = {
  message: 'bg-blue-50 text-blue-700',
  application_update: 'bg-primary/10 text-primary',
  verification: 'bg-emerald-50 text-emerald-700',
  opportunity: 'bg-amber-50 text-amber-700',
  system: 'bg-surface-container text-on-surface-variant',
}

type Props = {
  notification: NotificationItem
  compact?: boolean
  onAfterAction?: () => void
}

export function NotificationItem({
  notification,
  compact = false,
  onAfterAction,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const Icon = TYPE_ICON[notification.type] ?? Bell
  const iconColor = TYPE_COLOR[notification.type] ?? TYPE_COLOR.system

  async function handleClick() {
    if (!notification.isRead) {
      setLoading(true)
      try {
        const res = await markNotificationAsRead(notification.id)
        // ✅ FIX: pakai res.ok (bukan res.success)
        if (!res.ok) {
          console.error('[NotifItem] Mark read failed:', res.error)
        }
      } catch (err) {
        console.error('[NotifItem] Error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (onAfterAction) onAfterAction()

    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    } else {
      router.refresh()
    }
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    setLoading(true)
    try {
      const res = await deleteNotification(notification.id)
      if (!res.ok) {
        console.error('[NotifItem] Delete failed:', res.error)
      }
    } catch (err) {
      console.error('[NotifItem] Error:', err)
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`
        w-full text-left flex items-start gap-3 transition-colors group
        ${compact ? 'p-3' : 'p-4'}
        ${notification.isRead ? 'bg-transparent' : 'bg-primary/[0.03]'}
        hover:bg-surface-container
        disabled:opacity-60
      `}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          {!notification.isRead && (
            <Circle className="w-2 h-2 fill-primary text-primary shrink-0 mt-1.5" />
          )}
          <div className="flex-1 min-w-0">
            {notification.title && (
              <h4
                className={`text-sm text-on-surface line-clamp-1 ${
                  notification.isRead ? 'font-medium' : 'font-bold'
                }`}
              >
                {notification.title}
              </h4>
            )}
            {notification.body && (
              <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                {notification.body}
              </p>
            )}
            <span className="text-[10px] text-on-surface-variant mt-1 block">
              {notification.createdAtRelative}
            </span>
          </div>

          {/* Delete button */}
          {!compact && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-on-surface-variant hover:text-error hover:bg-error/5 transition-all shrink-0"
              aria-label="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </button>
  )
}