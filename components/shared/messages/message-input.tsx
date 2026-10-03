// components/shared/messages/message-input.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { sendMessageAction } from '@/app/actions/messages'

type Props = {
  conversationId: string
  onSent?: () => void
  disabled?: boolean
}

export function MessageInput({ conversationId, onSent, disabled }: Props) {
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [body])

  async function handleSend() {
    const trimmed = body.trim()
    if (!trimmed || sending) return

    setSending(true)
    setError(null)

    try {
      const res = await sendMessageAction({
        conversationId,
        body: trimmed,
      })

      if (!res.ok) {
        setError(res.error ?? 'Gagal kirim')
        return
      }

      setBody('')
      if (onSent) onSent()

      // Focus balik
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 50)
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan')
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-outline-variant/30 p-3 bg-surface-container-lowest">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan... (Enter untuk kirim, Shift+Enter untuk baris baru)"
          disabled={disabled || sending}
          rows={1}
          maxLength={5000}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm resize-none transition disabled:opacity-60"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!body.trim() || sending || disabled}
          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          aria-label="Kirim"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-[11px] text-error mt-1 px-1">{error}</p>
      )}
    </div>
  )
}