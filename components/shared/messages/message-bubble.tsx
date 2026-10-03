// components/shared/messages/message-bubble.tsx
'use client'

import { Check, CheckCheck } from 'lucide-react'

type MessageItem = {
  id: string
  body: string
  senderId?: string
  isOwn: boolean
  isRead: boolean
  createdAt: string
  createdAtRelative?: string  // ✅ OPTIONAL
  attachmentUrl?: string | null  // ✅ OPTIONAL
}

type Props = {
  message: MessageItem
}

export function MessageBubble({ message }: Props) {
  return (
    <div
      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
          message.isOwn
            ? 'bg-primary text-white rounded-br-md'
            : 'bg-surface-container text-on-surface rounded-bl-md'
        }`}
      >
        {message.attachmentUrl && (
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-bold underline mb-1 block ${
              message.isOwn ? 'text-white/90' : 'text-primary'
            }`}
          >
            📎 Lampiran
          </a>
        )}

        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {message.body}
        </p>

        <div
          className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
            message.isOwn ? 'text-white/70' : 'text-on-surface-variant/70'
          }`}
        >
          <span>
            {message.createdAtRelative ??
              new Date(message.createdAt).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
          </span>
          {message.isOwn && (
            <span>
              {message.isRead ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}