// app/certification/verifications/[id]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { getCertContext } from '@/lib/queries/cert-context'
import { getVerificationDetail } from '@/lib/queries/cert-verifications'
import { VerificationDetailClient } from './detail-client'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const ctx = await getCertContext()
  if (!ctx) return { title: 'Review — VocAZ Verifier' }

  const detail = await getVerificationDetail(ctx.institutionId, id)
  return {
    title: detail
      ? `Review: ${detail.certificate.title} — VocAZ`
      : 'Review — VocAZ Verifier',
  }
}

export default async function VerificationDetailPage({ params }: Props) {
  const ctx = await getCertContext()
  if (!ctx) redirect('/auth/sign-in')

  const { id } = await params

  const detail = await getVerificationDetail(ctx.institutionId, id)
  if (!detail) notFound()

  return <VerificationDetailClient detail={detail} />
}