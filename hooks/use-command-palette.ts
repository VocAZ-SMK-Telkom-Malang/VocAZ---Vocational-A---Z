// hooks/use-command-palette.ts
'use client'

import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'command-palette-open'

export function useCommandPalette() {
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => setOpen((v) => !v), [])
  const close = useCallback(() => setOpen(false), [])
  const openPalette = useCallback(() => setOpen(true), [])

  // Keyboard shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Cmd+K (Mac) atau Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggle()
      }

      // Cmd+/ sebagai alternatif
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        toggle()
      }

      // Escape tutup
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        close()
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, toggle, close])

  return {
    open,
    setOpen,
    toggle,
    close,
    openPalette,
  }
}