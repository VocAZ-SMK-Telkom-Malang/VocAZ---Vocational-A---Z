// components/shared/notifications/notifications-page.tsx
'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCheck, Trash2, Inbox, Loader2 } from 'lucide-react'
import { NotificationItem } from './notification-item'
import {
  markAllNotificationsAsRead,
  clearReadNotifications,
} from '@/app/actions/notifications'
import type { NotificationItem as NotificationItemType } from '@/lib/queries/notifications'

type Props = {
  notifications: NotificationItemType[]
  unreadCount: number
  totalCount: number
}

type TabKey = 'all' | 'unread'

export function NotificationsPage({
  notifications,
  unreadCount,
  totalCount,
}: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<TabKey>('all')
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (tab === 'unread') return notifications.filter((n) => !n.isRead)
    return notifications
  }, [notifications, tab])

  async function handleMarkAllRead() {
    if (unreadCount === 0) return
    setLoading('mark-all')
    try {
      const res = await markAllNotificationsAsRead()
      // ✅ FIX: pakai res.ok
      if (!res.ok) {
        console.error('[NotifPage] Mark all failed:', res.error)
      }
    } catch (err) {
      console.error('[NotifPage] Error:', err)
    } finally {
      setLoading(null)
      router.refresh()
    }
  }

  async function handleClearRead() {
    if (!confirm('Hapus semua notifikasi yang sudah dibaca?')) return
    setLoading('clear-read')
    try {
      const res = await clearReadNotifications()
      // ✅ FIX: pakai res.ok
      if (!res.ok) {
        console.error('[NotifPage] Clear read failed:', res.error)
      }
    } catch (err) {
      console.error('[NotifPage] Error:', err)
    } finally {
      setLoading(null)
      router.refresh()
    }
  }

  return (
    <div className="max-w-[900px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
            Notifikasi
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {unreadCount > 0
              ? `${unreadCount} notifikasi belum dibaca`
              : 'Semua notifikasi sudah dibaca'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={loading === 'mark-all'}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container text-xs font-bold disabled:opacity-50 transition-colors"
            >
              {loading === 'mark-all' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
              Tandai Semua Dibaca
            </button>
          )}
          {totalCount > unreadCount && (
            <button
              type="button"
              onClick={handleClearRead}
              disabled={loading === 'clear-read'}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant hover:bg-error/5 hover:text-error hover:border-error/40 text-xs font-bold disabled:opacity-50 transition-colors"
            >
              {loading === 'clear-read' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              Hapus yang Dibaca
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setTab('all')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
            tab === 'all'
              ? 'bg-primary text-white'
              : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container'
          }`}
        >
          Semua
          <span
            className={`px-1.5 rounded-md font-mono text-[10px] ${
              tab === 'all'
                ? 'bg-white/20'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('unread')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
            tab === 'unread'
              ? 'bg-primary text-white'
              : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container'
          }`}
        >
          Belum Dibaca
          <span
            className={`px-1.5 rounded-md font-mono text-[10px] ${
              tab === 'unread'
                ? 'bg-white/20'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {unreadCount}
          </span>
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-16 text-center">
          <Inbox className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-on-surface mb-1">
            {tab === 'unread'
              ? 'Tidak ada notifikasi belum dibaca'
              : 'Belum ada notifikasi'}
          </h3>
          <p className="text-sm text-on-surface-variant">
            {tab === 'unread'
              ? 'Semua notifikasi sudah kamu baca.'
              : 'Notifikasi akan muncul di sini saat ada update.'}
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/20">
          {filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onAfterAction={() => router.refresh()}
            />
          ))}
        </div>
      )}
    </div>
  )
}