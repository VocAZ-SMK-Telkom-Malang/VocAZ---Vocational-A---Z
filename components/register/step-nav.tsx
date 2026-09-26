'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

type Props = {
  prevHref?: string
  nextLabel?: string
  prevLabel?: string
  onNext?: () => void
  onSubmit?: boolean
  isPending?: boolean
  submitLabel?: string
  submitLoadingLabel?: string
  nextDisabled?: boolean
}

export function StepNav({
  prevHref,
  nextLabel = 'Lanjutkan',
  prevLabel = 'Kembali',
  onNext,
  onSubmit,
  isPending,
  submitLabel = 'Simpan & Lanjutkan',
  submitLoadingLabel = 'Menyimpan...',
  nextDisabled,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3 pt-6 mt-8 border-t border-outline-variant/30">
      {prevHref ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full ring-1 ring-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{prevLabel}</span>
        </Link>
      ) : (
        <div />
      )}

      {onSubmit ? (
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold px-6 py-2.5 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{submitLoadingLabel}</span>
            </>
          ) : (
            <>
              <span>{submitLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold px-6 py-2.5 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
        >
          <span>{nextLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}