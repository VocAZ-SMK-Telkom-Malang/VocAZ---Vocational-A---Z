// components/company/saved/save-talent-button.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark, Loader2 } from 'lucide-react'
import { toggleSaveTalentAction } from '@/app/company/saved/actions'

type Props = {
  studentId: string
  initialSaved?: boolean
  source?: 'talent_match' | 'showcase' | 'applicant' | 'manual'
  variant?: 'icon' | 'button'
  size?: 'sm' | 'md' | 'lg'
}

export function SaveTalentButton({
  studentId,
  initialSaved = false,
  source = 'manual',
  variant = 'icon',
  size = 'md',
}: Props) {
  const router = useRouter()
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  async function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()

    setLoading(true)
    // Optimistic
    const prev = saved
    setSaved(!saved)

    try {
      const res = await toggleSaveTalentAction({ studentId, source })
      if (!res.ok) {
        setSaved(prev)
        alert(res.error ?? 'Gagal')
        return
      }
      setSaved(res.saved ?? false)
      router.refresh()
    } catch (err) {
      console.error(err)
      setSaved(prev)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size]

  const iconSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size]

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={`
          inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors
          ${
            saved
              ? 'bg-primary/10 text-primary'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }
          disabled:opacity-60
        `}
      >
        {loading ? (
          <Loader2 className={iconSize + ' animate-spin'} />
        ) : (
          <Bookmark className={`${iconSize} ${saved ? 'fill-current' : ''}`} />
        )}
        {saved ? 'Disimpan' : 'Simpan'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`
        ${sizeClasses} rounded-full flex items-center justify-center transition-all
        ${
          saved
            ? 'bg-primary text-white shadow-md'
            : 'bg-surface-container/80 backdrop-blur-sm text-on-surface-variant hover:bg-surface-container-high'
        }
        disabled:opacity-60
      `}
      aria-label={saved ? 'Hapus dari simpanan' : 'Simpan kandidat'}
      title={saved ? 'Hapus dari simpanan' : 'Simpan kandidat'}
    >
      {loading ? (
        <Loader2 className={`${iconSize} animate-spin`} />
      ) : (
        <Bookmark className={`${iconSize} ${saved ? 'fill-current' : ''}`} />
      )}
    </button>
  )
}