// app/student/messages/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
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
  searchParams: Promise<{ c?: string; to?: string; company?: string }>
}

export default async function StudentMessagesPage({ searchParams }: Props) {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: { id: true, role: true },
  })

  if (!user) redirect('/onboarding')
  if (user.role !== 'student') redirect('/company/messages')

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

  // ✅ Handle ?company=slug → cari owner company
  if (!activeConversationId && sp.company) {
    try {
      const company = await prisma.company.findUnique({
        where: { slug: sp.company },
        select: {
          ownerUserId: true,
          members: {
            where: { role: 'owner' },
            take: 1,
            select: { userId: true },
          },
        },
      })

      const ownerUserId =
        company?.ownerUserId ?? company?.members[0]?.userId

      if (ownerUserId) {
        activeConversationId = await findOrCreateConversation(
          user.id,
          ownerUserId,
          'general'
        )
      }
    } catch (err) {
      console.error('[Messages] Find company owner failed:', err)
    }
  }

  const conversations = await getConversations(user.id)

  return (
    <div className="max-w-[1400px] mx-auto">
      <MessagesClient
        conversations={conversations}
        activeConversationId={activeConversationId}
        viewerRole="student"
      />
    </div>
  )
}