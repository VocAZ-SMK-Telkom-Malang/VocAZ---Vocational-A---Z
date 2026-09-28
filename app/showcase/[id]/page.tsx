// app/showcase/[id]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { getPublicShowcaseById } from '@/lib/showcase-public'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ShowcaseDetailPage({ params }: Props) {
  const { id } = await params
  const reel = await getPublicShowcaseById(id)

  if (!reel) notFound()

  // Redirect ke /showcase (featured viewer akan auto-load)
  // Atau bisa render custom detail page — untuk sekarang redirect
  redirect(`/showcase`)
}