// app/api/messages/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getConversationById } from '@/lib/queries/messages'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ conversation: null }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json({ conversation: null })
  }

  const { id } = await params
  const conversation = await getConversationById(id, user.id)

  return NextResponse.json({ conversation })
}