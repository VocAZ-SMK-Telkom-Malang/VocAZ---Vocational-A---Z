// components/shared/messages/chat-input.tsx
'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { sendMessageAction } from '@/app/actions/messages'

type Props = {
  conversationId: string
  onSent?: () => void
}

export function ChatInput({ conversationId, onSent }: Props) {
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [body])

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()

    const trimmed = body.trim()
    if (!trimmed || isPending) return

    startTransition(async () => {
      const result = await sendMessageAction({
        conversationId,
        body: trimmed,
      })

      if (result.ok) {
        setBody('')
        onSent?.()
        // Focus kembali
        setTimeout(() => textareaRef.current?.focus(), 50)
      } else {
        alert(result.error || 'Gagal kirim pesan')
      }
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 px-4 py-3 border-t border-outline-variant/30 bg-surface-container-lowest shrink-0"
    >
      <div className="flex-1 flex items-end gap-2 px-3 py-2 rounded-2xl bg-surface-container border border-outline-variant/30 focus-within:border-primary/50 transition-colors">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan..."
          rows={1}
          className="flex-1 bg-transparent border-0 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none resize-none max-h-[120px] py-1"
        />
      </div>

      <button
        type="submit"
        disabled={!body.trim() || isPending}
        className="p-3 rounded-2xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
        aria-label="Kirim"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </form>
  )
}