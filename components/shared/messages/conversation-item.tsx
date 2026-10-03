// components/shared/messages/conversation-item.tsx
'use client'

import { BadgeCheck } from 'lucide-react'
import type { ConversationItem as ConversationItemType } from '@/lib/queries/messages'

type Props = {
  conversation: ConversationItemType
  isActive: boolean
  onClick: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: Props) {
  const { otherUser, lastMessage, unreadCount } = conversation

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-start gap-3 p-3 text-left transition-colors
        ${isActive ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-surface-container/50 border-l-2 border-transparent'}
      `}
    >
      {/* Avatar */}
      {otherUser.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={otherUser.avatarUrl}
          alt={otherUser.fullName}
          className="w-11 h-11 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-bold text-xs shrink-0">
          {getInitials(otherUser.fullName)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <h4
            className={`text-sm truncate ${
              unreadCount > 0 ? 'font-black text-on-surface' : 'font-semibold text-on-surface'
            }`}
          >
            {otherUser.fullName}
          </h4>
          {otherUser.isVerified && (
            <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
          )}
        </div>

        <p className="text-[11px] text-on-surface-variant truncate mb-1">
          {otherUser.companyName ?? otherUser.headline ?? otherUser.role}
        </p>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-xs truncate flex-1 ${
              unreadCount > 0
                ? 'font-semibold text-on-surface'
                : 'text-on-surface-variant'
            }`}
          >
            {lastMessage ? (
              <>
                {lastMessage.isOwn && (
                  <span className="text-on-surface-variant/70">Kamu: </span>
                )}
                {lastMessage.body || '📎 Lampiran'}
              </>
            ) : (
              <span className="italic text-on-surface-variant/60">
                Belum ada pesan
              </span>
            )}
          </p>

          {unreadCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>

        <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
          {conversation.lastMessageAtRelative}
        </p>
      </div>
    </button>
  )
}