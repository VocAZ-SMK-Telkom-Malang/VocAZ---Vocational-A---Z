// components/shared/support-widget/support-widget.tsx
'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SupportBubble } from './support-bubble'
import { SupportPanel } from './support-panel'

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false)

  // ESC to close
  useEffect(() => {
    if (!isOpen) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  return (
    <>
      <AnimatePresence>
        {isOpen && <SupportPanel key="panel" />}
      </AnimatePresence>

      <SupportBubble isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
    </>
  )
}