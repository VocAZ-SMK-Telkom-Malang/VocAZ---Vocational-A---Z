// components/shared/messages/chat-room.tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, BadgeCheck, Loader2, MessageSquare, ArrowUpRight } from 'lucide-react'
import { MessageBubble } from './message-bubble'
import { MessageInput } from './message-input'
import type { ConversationDetail } from '@/lib/queries/messages'

type Props = {
  conversation: ConversationDetail | null
  viewerRole: 'student' | 'company'   // ← TAMBAH
  loading?: boolean
  onBack?: () => void
  showBackButton?: boolean
  onMessageSent?: () => void
}

function getProfileUrl(
  viewerRole: 'student' | 'company',
  otherUser: {
    role: string
    studentProfileId: string | null
    companySlug: string | null
  }
): string {
  // Kalau other user adalah student
  if (otherUser.studentProfileId) {
    if (viewerRole === 'company') {
      return `/company/talent/${otherUser.studentProfileId}`
    }
    return `/student/talents/${otherUser.studentProfileId}`
  }

  // Kalau other user adalah company
  if (otherUser.companySlug) {
    return `/perusahaan/${otherUser.companySlug}`
  }

  // Fallback
  return '#'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function ChatRoom({
  conversation,
  viewerRole,
  loading,
  onBack,
  showBackButton,
  onMessageSent,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto scroll ke bawah saat conversation berubah
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation?.id, conversation?.messages.length])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-on-surface-variant/40" />
        </div>
        <h3 className="text-base font-bold text-on-surface mb-1">
          Pilih Percakapan
        </h3>
        <p className="text-sm text-on-surface-variant max-w-xs">
          Pilih percakapan dari daftar di samping, atau mulai percakapan baru
          dengan recruiter/kandidat.
        </p>
      </div>
    )
  }

  const { otherUser, messages } = conversation

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 md:p-4 border-b border-outline-variant/30 bg-surface-container-lowest shrink-0">
        {showBackButton && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="md:hidden w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {otherUser.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={otherUser.avatarUrl}
            alt={otherUser.fullName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-bold text-sm shrink-0">
            {getInitials(otherUser.fullName)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-bold text-on-surface truncate">
              {otherUser.fullName}
            </h3>
            {otherUser.isVerified && (
              <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
            )}
          </div>
          <p className="text-[11px] text-on-surface-variant truncate">
            {otherUser.companyName ?? otherUser.headline ?? otherUser.role}
          </p>
        </div>

        {/* Action: view profile */}
        <Link
            href={getProfileUrl(viewerRole, otherUser)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high text-xs font-bold transition-colors shrink-0"
            >
            Profil
            <ArrowUpRight className="w-3 h-3" />
            </Link>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 bg-surface-container-low/30 space-y-1"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-on-surface-variant text-center max-w-xs">
              Belum ada pesan. Mulai percakapan dengan salam.
            </p>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            <div className="h-4" />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput
        conversationId={conversation.id}
        onSent={onMessageSent}
      />
    </div>
  )
}
