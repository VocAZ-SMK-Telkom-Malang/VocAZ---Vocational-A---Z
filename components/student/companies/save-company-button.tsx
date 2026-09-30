// components/student/companies/save-company-button.tsx
'use client'

import { Bookmark, Loader2 } from 'lucide-react'
import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toggleSaveCompany } from '@/lib/student/actions'

type Props = {
  companyId: string
  initialSaved: boolean
}

export function SaveCompanyButton({ companyId, initialSaved }: Props) {
  const router = useRouter()
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setSaved(initialSaved)
  }, [initialSaved])

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (isPending) return

    console.log('🔵 [SaveCompanyButton] CLICKED! companyId:', companyId)

    startTransition(async () => {
      try {
        const result = await toggleSaveCompany(companyId)
        console.log('🔵 [SaveCompanyButton] result:', JSON.stringify(result))

        if (result.ok) {
          setSaved(result.data.saved)
          router.refresh()
        } else {
          alert('Gagal menyimpan: ' + (result.error || 'Unknown'))
        }
      } catch (err) {
        console.error('❌ [SaveCompanyButton] error:', err)
        alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'))
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`p-1.5 rounded-lg transition-colors shrink-0 disabled:opacity-60 ${
        saved
          ? 'text-primary bg-primary/10'
          : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
      }`}
      aria-label={saved ? 'Hapus dari tersimpan' : 'Simpan perusahaan'}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      )}
    </button>
  )
}