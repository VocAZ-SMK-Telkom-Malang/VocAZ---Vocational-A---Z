'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Menunggu Review' },
  { value: 'resolved', label: 'Diselesaikan' },
  { value: 'dismissed', label: 'Diabaikan' },
  { value: 'all', label: 'Semua Status' },
]

const TYPE_OPTIONS = [
  { value: 'all', label: 'Semua Konten' },
  { value: 'showcase_video', label: 'Video Showcase' },
  { value: 'portfolio', label: 'Portofolio' },
  { value: 'profile', label: 'Profil' },
  { value: 'company', label: 'Perusahaan' },
  { value: 'job', label: 'Lowongan' },
]

export function ReportsFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [status, setStatus] = useState(searchParams.get('status') || 'pending')
  const [contentType, setContentType] = useState(
    searchParams.get('contentType') || 'all'
  )

  function updateURL(overrides: {
    status?: string
    contentType?: string
  }) {
    const params = new URLSearchParams(searchParams.toString())

    const newStatus = overrides.status ?? status
    const newType = overrides.contentType ?? contentType

    if (newStatus && newStatus !== 'pending') params.set('status', newStatus)
    else params.delete('status')

    if (newType && newType !== 'all') params.set('contentType', newType)
    else params.delete('contentType')

    router.push(`${pathname}?${params.toString()}`)
  }

  function handleStatusChange(value: string) {
    setStatus(value)
    updateURL({ status: value })
  }

  function handleTypeChange(value: string) {
    setContentType(value)
    updateURL({ contentType: value })
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="flex-1 px-3 py-2.5 rounded-lg border border-outline-variant/50 bg-white text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 cursor-pointer"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={contentType}
        onChange={(e) => handleTypeChange(e.target.value)}
        className="flex-1 px-3 py-2.5 rounded-lg border border-outline-variant/50 bg-white text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 cursor-pointer"
      >
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}