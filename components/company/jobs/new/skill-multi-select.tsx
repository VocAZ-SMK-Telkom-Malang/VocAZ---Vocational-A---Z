// components/company/jobs/new/skill-multi-select.tsx
'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, X, Check } from 'lucide-react'

type Skill = {
  id: string
  name: string
  category: string | null
}

type Props = {
  skills: Skill[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  max?: number
}

export function SkillMultiSelect({
  skills,
  selectedIds,
  onChange,
  max = 20,
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Group skills by category
  const grouped = useMemo(() => {
    const filtered = query
      ? skills.filter((s) =>
          s.name.toLowerCase().includes(query.toLowerCase())
        )
      : skills

    return filtered.reduce<Record<string, Skill[]>>((acc, skill) => {
      const cat = skill.category ?? 'Lainnya'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(skill)
      return acc
    }, {})
  }, [skills, query])

  const selectedSkills = useMemo(
    () => skills.filter((s) => selectedIds.includes(s.id)),
    [skills, selectedIds]
  )

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id))
    } else {
      if (selectedIds.length >= max) return
      onChange([...selectedIds, id])
    }
  }

  const remove = (id: string) => {
    onChange(selectedIds.filter((i) => i !== id))
  }

  // Click outside close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      {/* Selected chips */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selectedSkills.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold"
            >
              {s.name}
              <button
                type="button"
                onClick={() => remove(s.id)}
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
        className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-left text-on-surface transition flex items-center justify-between"
      >
        <span className="text-on-surface-variant">
          {selectedIds.length === 0
            ? 'Pilih skill yang dibutuhkan...'
            : `${selectedIds.length} skill dipilih`}
        </span>
        <Search className="w-4 h-4 text-on-surface-variant" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xl max-h-[400px] overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-outline-variant/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari skill..."
                autoFocus
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition"
              />
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {Object.keys(grouped).length === 0 ? (
              <div className="py-8 text-center text-sm text-on-surface-variant">
                Tidak ada skill yang cocok
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div className="px-3 py-2 bg-surface-container-low/50 sticky top-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                      {category}
                    </span>
                  </div>
                  {items.map((skill) => {
                    const isSelected = selectedIds.includes(skill.id)
                    const isDisabled =
                      !isSelected && selectedIds.length >= max
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => toggle(skill.id)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors
                          ${
                            isSelected
                              ? 'bg-primary/5 text-primary font-semibold'
                              : isDisabled
                              ? 'text-on-surface-variant/40 cursor-not-allowed'
                              : 'text-on-surface hover:bg-surface-container'
                          }
                        `}
                      >
                        <span>{skill.name}</span>
                        {isSelected && <Check className="w-4 h-4" />}
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
              {selectedIds.length} / {max} dipilih
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
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