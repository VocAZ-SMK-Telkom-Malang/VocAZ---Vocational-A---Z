// components/student/showcase/showcase-empty.tsx
import Link from 'next/link'
import { Video, Upload } from 'lucide-react'

export function ShowcaseEmpty() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container mx-auto flex items-center justify-center mb-4">
        <Video className="w-8 h-8 text-on-surface-variant" />
      </div>
      <h3 className="font-display text-lg font-bold text-on-surface mb-2">
        Belum ada video showcase
      </h3>
      <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
        Upload video dari HP atau paste link YouTube, TikTok, Google Drive, atau
        Instagram Reels untuk menunjukkan skill kamu ke recruiter.
      </p>
      <Link
        href="/student/showcase/my/new"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 hover:-translate-y-0.5 transition-all"
      >
        <Upload className="w-4 h-4" />
        Upload Video Pertama
      </Link>
    </div>
  )
}