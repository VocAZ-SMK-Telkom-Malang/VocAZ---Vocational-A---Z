// app/company/messages/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import {
  getConversations,
  findOrCreateConversation,
} from '@/lib/queries/messages'
import { MessagesClient } from '@/components/shared/messages/messages-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Pesan — VocAZ',
}

type Props = {
  searchParams: Promise<{ c?: string; to?: string }>
}

export default async function CompanyMessagesPage({ searchParams }: Props) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: { id: true },
  })

  if (!user) redirect('/onboarding')

  const sp = await searchParams
  let activeConversationId = sp.c ?? null

  // ✅ AUTO-CREATE kalau ada ?to=userId
  if (!activeConversationId && sp.to) {
    try {
      activeConversationId = await findOrCreateConversation(
        user.id,
        sp.to,
        'application'
      )
    } catch (err) {
      console.error('[Messages] Auto-create failed:', err)
    }
  }

  const conversations = await getConversations(user.id)

  return (
    <div className="max-w-[1400px] mx-auto">
      <MessagesClient
        conversations={conversations}
        activeConversationId={activeConversationId}
        viewerRole="company"
      />
    </div>
  )
}