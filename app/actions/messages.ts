// app/actions/messages.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

// ============================================
// HELPER
// ============================================

async function requireUser() {
  const session = await getServerSession()
  if (!session?.user?.id) return { error: 'Unauthorized' as const }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: { id: true, role: true, fullName: true },
  })

  if (!user) return { error: 'User tidak ditemukan' as const }

  return { user }
}

// ============================================
// SEND MESSAGE
// ============================================

const sendSchema = z.object({
  conversationId: z.string().uuid(),
  body: z.string().min(1).max(5000),
})

export async function sendMessageAction(input: unknown) {
  const ctx = await requireUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = sendSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Pesan tidak valid' }
  }

  const { conversationId, body } = parsed.data

  // Verify user adalah participant
  const participant = await prisma.conversationParticipant.findFirst({
    where: { conversationId, userId: ctx.user.id },
    select: { id: true },
  })

  if (!participant) {
    return { ok: false, error: 'Tidak berhak' }
  }

  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: ctx.user.id,
        body,
        isRead: false,
      },
      select: { id: true },
    })

    // Update lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    })

    // Notif ke participant lain
    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: {
        conversationId,
        userId: { not: ctx.user.id },
      },
      select: { userId: true },
    })

    if (otherParticipants.length > 0) {
      try {
        await prisma.notification.createMany({
          data: otherParticipants.map((p) => ({
            userId: p.userId,
            type: 'message' as const,
            title: 'Pesan Baru',
            body: `${ctx.user.fullName ?? 'User'}: ${body.slice(0, 80)}${body.length > 80 ? '...' : ''}`,
            actionUrl: `/messages/${conversationId}`,
          })),
        })
      } catch (notifErr) {
        console.error('[Notif] Failed:', notifErr)
      }
    }

    revalidatePath('/student/messages')
    revalidatePath('/company/messages')
    revalidatePath(`/student/messages/${conversationId}`)
    revalidatePath(`/company/messages/${conversationId}`)
    revalidatePath('/student/notifications')
    revalidatePath('/company/notifications')

    return { ok: true, messageId: message.id }
  } catch (err: any) {
    console.error('[sendMessage] Error:', err?.message)
    return { ok: false, error: 'Gagal mengirim pesan' }
  }
}

// ============================================
// MARK CONVERSATION AS READ
// ============================================

export async function markConversationAsReadAction(conversationId: string) {
  const ctx = await requireUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  try {
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: ctx.user.id },
        isRead: false,
      },
      data: { isRead: true },
    })

    // Update lastReadAt
    await prisma.conversationParticipant.updateMany({
      where: { conversationId, userId: ctx.user.id },
      data: { lastReadAt: new Date() },
    })

    revalidatePath('/student/messages')
    revalidatePath('/company/messages')

    return { ok: true }
  } catch (err: any) {
    console.error('[markRead] Error:', err?.message)
    return { ok: false, error: 'Gagal mark read' }
  }
}

// ============================================
// START CONVERSATION
// ============================================

const startSchema = z.object({
  otherUserId: z.string().uuid(),
  contextType: z
    .enum(['application', 'talent_profile', 'smart_match', 'general'])
    .optional(),
  contextId: z.string().uuid().optional(),
})

export async function startConversationAction(input: unknown) {
  const ctx = await requireUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = startSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Data tidak valid' }
  }

  const { otherUserId, contextType, contextId } = parsed.data

  if (ctx.user.id === otherUserId) {
    return { ok: false, error: 'Tidak bisa chat dengan diri sendiri' }
  }

  try {
    // Verify other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true },
    })

    if (!otherUser) {
      return { ok: false, error: 'User tidak ditemukan' }
    }

    // Cari atau buat conversation
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: ctx.user.id } } },
          { participants: { some: { userId: otherUserId } } },
        ],
        participants: {
          every: { userId: { in: [ctx.user.id, otherUserId] } },
        },
      },
      select: { id: true },
    })

    if (existing) {
      return { ok: true, conversationId: existing.id, isNew: false }
    }

    const created = await prisma.conversation.create({
      data: {
        contextType: contextType ?? 'general',
        contextId: contextId ?? null,
        lastMessageAt: new Date(),
        participants: {
          create: [
            { userId: ctx.user.id },
            { userId: otherUserId },
          ],
        },
      },
      select: { id: true },
    })

    revalidatePath('/student/messages')
    revalidatePath('/company/messages')

    return { ok: true, conversationId: created.id, isNew: true }
  } catch (err: any) {
    console.error('[startConversation] Error:', err?.message)
    return { ok: false, error: 'Gagal mulai percakapan' }
  }
}