// components/shared/command-palette/command-palette.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, CornerDownLeft } from 'lucide-react'
import { MENU_BY_ROLE, type Role, type MenuItem } from './command-data'

type Props = {
  isOpen: boolean
  onClose: () => void
  role: Role
}

// Fuzzy match sederhana
function matchesQuery(item: MenuItem, query: string): boolean {
  if (!query) return true

  const q = query.toLowerCase().trim()
  const haystack = [
    item.label,
    item.description || '',
    item.group,
    ...(item.keywords || []),
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(q)
}

// Highlight match
function highlightMatch(text: string, query: string) {
  if (!query) return <>{text}</>

  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-amber-200/70 text-on-surface rounded-[3px] px-0.5">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  )
}

export function CommandPalette({ isOpen, onClose, role }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const menuItems = MENU_BY_ROLE[role] || []

  const filteredItems = useMemo(
    () => menuItems.filter((item) => matchesQuery(item, query)),
    [menuItems, query]
  )

  // Group items — preserve order
  const groupedItems = useMemo(() => {
    const groups: { name: string; items: MenuItem[] }[] = []
    const seen = new Map<string, number>()

    filteredItems.forEach((item) => {
      if (!seen.has(item.group)) {
        seen.set(item.group, groups.length)
        groups.push({ name: item.group, items: [] })
      }
      groups[seen.get(item.group)!].items.push(item)
    })

    return groups
  }, [filteredItems])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  // Scroll active item ke view
  useEffect(() => {
    if (!isOpen || !listRef.current) return
    const activeEl = listRef.current.querySelector(
      `[data-index="${activeIndex}"]`
    ) as HTMLElement
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeIndex, isOpen])

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % filteredItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => (i - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = filteredItems[activeIndex]
        if (item) {
          router.push(item.href)
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, filteredItems, activeIndex, router, onClose])

  if (!isOpen) return null

  let globalIndex = -1

  return (
    <div
      className="fixed inset-0 z-[100] bg-inverse-surface/40 backdrop-blur-sm flex items-start justify-center p-4 pt-[12vh]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-[0_24px_48px_-12px_rgba(15,15,16,0.25)] ring-1 ring-outline-variant/30 overflow-hidden flex flex-col max-h-[76vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/30 shrink-0">
          <Search className="w-5 h-5 text-on-surface-variant shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari halaman..."
            className="flex-1 bg-transparent border-0 text-[15px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
              aria-label="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-[10px] font-mono font-bold text-on-surface-variant/80 ring-1 ring-outline-variant/30 shrink-0">
              ESC
            </kbd>
          )}
        </div>

        {/* List */}
        <div ref={listRef} className="flex-1 overflow-y-auto py-2">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-on-surface-variant/60" />
              </div>
              <p className="text-sm font-semibold text-on-surface mb-1">
                Tidak ada halaman yang cocok
              </p>
              <p className="text-xs text-on-surface-variant">
                Coba kata kunci lain atau navigasi manual
              </p>
            </div>
          ) : (
            groupedItems.map((group) => (
              <div key={group.name} className="px-2 mb-1 last:mb-0">
                {/* Group label */}
                <div className="px-3 pt-3 pb-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] font-bold text-on-surface-variant/60">
                    {group.name}
                  </span>
                </div>

                {/* Items */}
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    globalIndex++
                    const isActive = globalIndex === activeIndex
                    const Icon = item.icon

                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          data-index={globalIndex}
                          onClick={() => {
                            router.push(item.href)
                            onClose()
                          }}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                            isActive
                              ? 'bg-primary/5 ring-1 ring-primary/15'
                              : 'hover:bg-surface-container-low/60'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? 'bg-primary/10 text-primary'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-semibold truncate transition-colors ${
                                isActive ? 'text-primary' : 'text-on-surface'
                              }`}
                            >
                              {highlightMatch(item.label, query)}
                            </p>
                            {item.description && (
                              <p className="text-[11px] text-on-surface-variant/80 truncate mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {isActive && (
                            <div className="hidden sm:flex items-center gap-1 shrink-0 px-2 py-1 rounded-md bg-primary text-white">
                              <CornerDownLeft className="w-3 h-3" />
                              <span className="text-[10px] font-mono font-bold">
                                Enter
                              </span>
                            </div>
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-outline-variant/30 bg-surface-container-low/40 shrink-0">
          <div className="flex items-center gap-4 text-[11px] text-on-surface-variant/80 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-mono font-bold ring-1 ring-outline-variant/30">
                ↑↓
              </kbd>
              navigasi
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-mono font-bold ring-1 ring-outline-variant/30">
                ⏎
              </kbd>
              pilih
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-mono font-bold ring-1 ring-outline-variant/30">
                esc
              </kbd>
              tutup
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/60 font-mono font-bold">
            <span>VOCAZ</span>
            <span className="w-1 h-1 rounded-full bg-on-surface-variant/30" />
            <span>v0.1</span>
          </div>
        </div>
      </div>
    </div>
  )
}