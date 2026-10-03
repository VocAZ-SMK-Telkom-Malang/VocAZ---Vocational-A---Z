// components/shared/messages/conversation-list.tsx
'use client'

import { useState, useMemo } from 'react'
import { Search, X, Inbox } from 'lucide-react'
import type { ConversationItem as Conversation } from '@/lib/queries/messages'
import { ConversationItem } from './conversation-item'

type Props = {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
}: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return conversations
    const q = query.toLowerCase().trim()
    return conversations.filter((c) => {
      return (
        c.otherUser.fullName.toLowerCase().includes(q) ||
        (c.otherUser.companyName ?? '').toLowerCase().includes(q) ||
        (c.otherUser.headline ?? '').toLowerCase().includes(q)
      )
    })
  }, [conversations, query])

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest">
      {/* Search */}
      <div className="p-3 border-b border-outline-variant/30 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari percakapan..."
            className="flex-1 bg-transparent border-0 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors shrink-0"
              aria-label="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6 text-on-surface-variant/60" />
            </div>
            <p className="text-sm font-bold text-on-surface mb-1">
              {query ? 'Tidak ada percakapan' : 'Belum ada percakapan'}
            </p>
            <p className="text-xs text-on-surface-variant">
              {query
                ? 'Coba kata kunci lain'
                : 'Mulai chat dengan recruiter atau talenta lain'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeId}
                onClick={() => onSelect(conv.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}