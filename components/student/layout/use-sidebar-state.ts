// components/student/layout/use-sidebar-state.ts
'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'student-sidebar-collapsed'

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load dari localStorage
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'true') setCollapsed(true)
    } catch {
      // ignore
    }
  }, [])

  // Persist ke localStorage
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed))
    } catch {
      // ignore
    }
  }, [collapsed, mounted])

  return {
    collapsed,
    setCollapsed,
    toggle: () => setCollapsed((v) => !v),
  }
}