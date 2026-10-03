// components/shared/messages/chat-window.tsx
'use client'

import { useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { ChatHeader } from './chat-header'
import { ChatInput } from './chat-input'
import { MessageBubble } from './message-bubble'
import { markConversationAsReadAction } from '@/app/actions/messages'

type Props = {
  conversation: {
    id: string
    contextType: string | null
    subject: string | null
    otherUser: {
      id: string
      fullName: string
      avatarUrl: string | null
      role: string
      headline: string | null
      companyName: string | null
      companyVerified: boolean
    }
    messages: {
      id: string
      body: string
      senderId: string
      isOwn: boolean
      isRead: boolean
      createdAt: string
    }[]
  }
  onCloseMobile?: () => void
}

export function ChatWindow({ conversation, onCloseMobile }: Props) {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()

  // Auto-scroll ke bawah tiap ada message baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [conversation.messages.length, conversation.id])

  // Mark as read saat buka
  useEffect(() => {
    startTransition(async () => {
      await markConversationAsReadAction(conversation.id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id])

  function handleSent() {
    router.refresh()
  }

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5]">
      {/* Header */}
      <ChatHeader
        otherUser={conversation.otherUser}
        onCloseMobile={onCloseMobile}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-on-surface-variant/60" />
            </div>
            <p className="text-sm font-bold text-on-surface mb-1">
              Belum ada pesan
            </p>
            <p className="text-xs text-on-surface-variant">
              Kirim pesan pertama ke {conversation.otherUser.fullName}
            </p>
          </div>
        ) : (
          <>
            {conversation.messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput conversationId={conversation.id} onSent={handleSent} />
    </div>
  )
}