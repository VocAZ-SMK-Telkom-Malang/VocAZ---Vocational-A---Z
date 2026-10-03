// components/shared/messages/messages-empty.tsx
'use client'

import { MessageSquare, Compass } from 'lucide-react'
import Link from 'next/link'

export function MessagesEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5">
        <MessageSquare className="w-9 h-9 text-primary" />
      </div>
      <h2 className="text-lg font-black text-on-surface mb-2">
        Pilih Percakapan
      </h2>
      <p className="text-sm text-on-surface-variant mb-6 max-w-sm">
        Pilih percakapan dari daftar di samping, atau mulai chat baru dengan
        recruiter atau talenta lainnya.
      </p>
      <Link
        href="/student/talents"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
      >
        <Compass className="w-4 h-4" />
        Jelajahi Talent
      </Link>
    </div>
  )
}