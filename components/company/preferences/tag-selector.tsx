// components/company/preferences/tag-selector.tsx
'use client'

import { useState, useMemo } from 'react'
import { Search, X, Plus, Check } from 'lucide-react'

type Option = {
  value: string
  label: string
  category?: string | null
}

type Props = {
  label: string
  description?: string
  placeholder?: string
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  max?: number
  grouped?: boolean
}

export function TagSelector({
  label,
  description,
  placeholder = 'Cari...',
  options,
  selected,
  onChange,
  max = 50,
  grouped = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return options
    const q = query.toLowerCase()
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.category?.toLowerCase() ?? '').includes(q)
    )
  }, [options, query])

  const groupedOptions = useMemo(() => {
    if (!grouped) return { '': filtered }
    const groups: Record<string, Option[]> = {}
    filtered.forEach((o) => {
      const key = o.category ?? 'Lainnya'
      if (!groups[key]) groups[key] = []
      groups[key].push(o)
    })
    return groups
  }, [filtered, grouped])

  const selectedOptions = options.filter((o) => selected.includes(o.value))

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      if (selected.length >= max) return
      onChange([...selected, value])
    }
  }

  function remove(value: string) {
    onChange(selected.filter((v) => v !== value))
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-2">
        {label}
      </label>
      {description && (
        <p className="text-[11px] text-on-surface-variant mb-2">{description}</p>
      )}

      {/* Selected chips */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selectedOptions.map((o) => (
            <span
              key={o.value}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold"
            >
              {o.label}
              <button
                type="button"
                onClick={() => remove(o.value)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent hover:border-primary/30 focus:border-primary/30 focus:outline-none text-sm text-left flex items-center justify-between transition-colors"
      >
        <span className="text-on-surface-variant">
          {selected.length === 0
            ? `Pilih ${label.toLowerCase()}...`
            : `${selected.length} dipilih`}
        </span>
        <Plus className="w-4 h-4 text-primary" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="mt-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-outline-variant/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                autoFocus
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm transition"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-[300px] overflow-y-auto">
            {Object.keys(groupedOptions).length === 0 ||
            Object.values(groupedOptions).every((arr) => arr.length === 0) ? (
              <div className="p-6 text-center text-sm text-on-surface-variant">
                Tidak ada opsi cocok
              </div>
            ) : (
              Object.entries(groupedOptions).map(([group, items]) => (
                <div key={group}>
                  {grouped && group && (
                    <div className="px-3 py-2 bg-surface-container-low/50 sticky top-0">
                      <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                        {group}
                      </span>
                    </div>
                  )}
                  {items.map((o) => {
                    const isSelected = selected.includes(o.value)
                    const isDisabled =
                      !isSelected && selected.length >= max
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => toggle(o.value)}
                        disabled={isDisabled}
                        className={`
                          w-full flex items-center justify-between px-3 py-2.5 text-left text-sm transition-colors
                          ${
                            isSelected
                              ? 'bg-primary/5 text-primary font-semibold'
                              : isDisabled
                              ? 'text-on-surface-variant/40 cursor-not-allowed'
                              : 'text-on-surface hover:bg-surface-container'
                          }
                        `}
                      >
                        <span className="truncate">{o.label}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-outline-variant/30 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              {selected.length} / {max} dipilih
            </span>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                setQuery('')
              }}
              className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  )
}