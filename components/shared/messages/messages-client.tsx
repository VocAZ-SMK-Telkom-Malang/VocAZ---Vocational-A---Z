// components/shared/messages/messages-client.tsx
'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MessageSquare, X } from 'lucide-react'
import { ConversationItem } from './conversation-item'
import { ChatRoom } from './chat-room'
import { markConversationAsReadAction } from '@/app/actions/messages'
import type {
  ConversationItem as ConversationItemType,
  ConversationDetail,
} from '@/lib/queries/messages'

type Props = {
  conversations: ConversationItemType[]
  activeConversationId?: string | null
  viewerRole: 'student' | 'company'
}

export function MessagesClient({
  conversations,
  activeConversationId: initialActiveId,
  viewerRole,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState('')
  const [activeId, setActiveId] = useState<string | null>(
    initialActiveId ?? null
  )
  const [activeConversation, setActiveConversation] =
    useState<ConversationDetail | null>(null)
  const [loadingChat, setLoadingChat] = useState(false)
  const [showListMobile, setShowListMobile] = useState(!initialActiveId)

  // Filter by search
  const filtered = conversations.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.otherUser.fullName.toLowerCase().includes(q) ||
      (c.otherUser.headline?.toLowerCase() ?? '').includes(q) ||
      (c.otherUser.companyName?.toLowerCase() ?? '').includes(q)
    )
  })

  // Load conversation saat activeId berubah
  useEffect(() => {
    if (!activeId) {
      setActiveConversation(null)
      return
    }

    let cancelled = false
    setLoadingChat(true)

    fetch(`/api/messages/${activeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setActiveConversation(data.conversation ?? null)

        // Mark as read
        markConversationAsReadAction(activeId).then(() => {
          router.refresh()
        })
      })
      .catch((err) => {
        console.error('[Messages] Load failed:', err)
      })
      .finally(() => {
        if (!cancelled) setLoadingChat(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeId, router])

  // Sync active dari URL
  useEffect(() => {
    const c = searchParams.get('c')
    if (c && c !== activeId) {
      setActiveId(c)
      setShowListMobile(false)
    }
  }, [searchParams, activeId])

  function handleSelectConversation(id: string) {
    setActiveId(id)
    setShowListMobile(false)
    router.push(`?c=${id}`, { scroll: false })
  }

  function handleBack() {
    setShowListMobile(true)
    setActiveId(null)
    router.push('.', { scroll: false })
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          w-full md:w-[340px] shrink-0 border-r border-outline-variant/30 flex flex-col
          ${showListMobile ? 'flex' : 'hidden md:flex'}
        `}
      >
        {/* Header */}
        <div className="p-3 border-b border-outline-variant/30 shrink-0">
          <h2 className="text-base font-black text-on-surface mb-2">
            Pesan
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari percakapan..."
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
              <p className="text-sm text-on-surface-variant">
                {search
                  ? 'Tidak ada percakapan cocok'
                  : 'Belum ada percakapan'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {filtered.map((c) => (
                <ConversationItem
                  key={c.id}
                  conversation={c}
                  isActive={c.id === activeId}
                  onClick={() => handleSelectConversation(c.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div
        className={`
          flex-1 flex flex-col min-w-0
          ${showListMobile ? 'hidden md:flex' : 'flex'}
        `}
      >
        <ChatRoom
          conversation={activeConversation}
          viewerRole={viewerRole}
          loading={loadingChat}
          onBack={handleBack}
          showBackButton
          onMessageSent={() => router.refresh()}
        />
      </div>
    </div>
  )
}