// lib/queries/messages.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type ConversationItem = {
  id: string
  otherUser: {
    id: string
    fullName: string
    avatarUrl: string | null
    role: string
    headline: string | null
    companyName: string | null
    isVerified: boolean
    studentProfileId: string | null    // ← TAMBAH
    companySlug: string | null        
  }
  lastMessage: {
    body: string
    createdAt: string
    isOwn: boolean
  } | null
  unreadCount: number
  lastMessageAt: string
  lastMessageAtRelative: string
}

export type MessageItem = {
  id: string
  body: string
  isOwn: boolean
  isRead: boolean
  createdAt: string
  createdAtRelative: string
  attachmentUrl: string | null
}

export type ConversationDetail = {
  id: string
  otherUser: {
    id: string
    fullName: string
    avatarUrl: string | null
    role: string
    headline: string | null
    companyName: string | null
    isVerified: boolean
    studentProfileId: string | null    // ← TAMBAH
    companySlug: string | null         // ← TAMBAH
  }
  messages: MessageItem[]
}

// ============================================
// HELPERS
// ============================================

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} minggu lalu`
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

function fullDateTime(date: Date): string {
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ============================================
// GET CONVERSATIONS (list untuk sidebar)
// ============================================

export async function getConversations(
  userId: string
): Promise<ConversationItem[]> {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { userId } },
    },
    orderBy: { lastMessageAt: 'desc' },
    take: 100,
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              role: true,
              isActive: true,
              studentProfile: {
                select: {
                  id: true,
                  headline: true,
                  certificates: {
                    where: { verificationStatus: 'verified' },
                    select: { id: true },
                    take: 1,
                  },
                },
              },
              ownedCompany: {
                select: {
                  name: true,
                  slug: true,
                  verificationStatus: true,
                },
              },
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          id: true,
          body: true,
          createdAt: true,
          senderId: true,
        },
      },
    },
  })

  const results: ConversationItem[] = []

  for (const conv of conversations) {
    const other = conv.participants.find((p) => p.userId !== userId)
    if (!other) continue

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: conv.id,
        senderId: { not: userId },
        isRead: false,
      },
    })

    const lastMsg = conv.messages[0]
    const otherUser = other.user

    const hasVerifiedCert =
      (otherUser.studentProfile?.certificates?.length ?? 0) > 0
    const isCompanyVerified =
      otherUser.ownedCompany?.verificationStatus === 'verified'

    results.push({
      id: conv.id,
      otherUser: {
        id: otherUser.id,
        fullName: otherUser.fullName ?? 'User',
        avatarUrl: otherUser.avatarUrl,
        role: otherUser.role,
        headline: otherUser.studentProfile?.headline ?? null,
        companyName: otherUser.ownedCompany?.name ?? null,
        isVerified: hasVerifiedCert || isCompanyVerified,
        studentProfileId: otherUser.studentProfile?.id ?? null,   // ← TAMBAH
        companySlug: otherUser.ownedCompany?.slug ?? null,        // ← TAMBAH
      },
      lastMessage: lastMsg
        ? {
            body: lastMsg.body ?? '',
            createdAt: lastMsg.createdAt.toISOString(),
            isOwn: lastMsg.senderId === userId,
          }
        : null,
      unreadCount,
      lastMessageAt: (conv.lastMessageAt ?? conv.createdAt).toISOString(),
      lastMessageAtRelative: relativeTime(
        conv.lastMessageAt ?? conv.createdAt
      ),
    })
  }

  return results
}

// ============================================
// GET CONVERSATION BY ID
// ============================================

export async function getConversationById(
  conversationId: string,
  userId: string
): Promise<ConversationDetail | null> {
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              role: true,
              studentProfile: {
                select: {
                  id: true, 
                  headline: true,
                  certificates: {
                    where: { verificationStatus: 'verified' },
                    select: { id: true },
                    take: 1,
                  },
                },
              },
              ownedCompany: {
                select: {
                  name: true,
                  slug: true,  
                  verificationStatus: true,
                },
              },
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 200,
      },
    },
  })

  if (!conv) return null

  const isParticipant = conv.participants.some((p) => p.userId === userId)
  if (!isParticipant) return null

  const other = conv.participants.find((p) => p.userId !== userId)
  if (!other) return null

  const otherUser = other.user
  const hasVerifiedCert =
    (otherUser.studentProfile?.certificates?.length ?? 0) > 0
  const isCompanyVerified =
    otherUser.ownedCompany?.verificationStatus === 'verified'

  return {
    id: conv.id,
    otherUser: {
      id: otherUser.id,
      fullName: otherUser.fullName ?? 'User',
      avatarUrl: otherUser.avatarUrl,
      role: otherUser.role,
      headline: otherUser.studentProfile?.headline ?? null,
      companyName: otherUser.ownedCompany?.name ?? null,
      isVerified: hasVerifiedCert || isCompanyVerified,
      studentProfileId: otherUser.studentProfile?.id ?? null,   // ← TAMBAH
      companySlug: otherUser.ownedCompany?.slug ?? null,        // ← TAMBAH
    },
    messages: conv.messages.map((m) => ({
      id: m.id,
      body: m.body ?? '',
      isOwn: m.senderId === userId,
      isRead: m.isRead,
      createdAt: m.createdAt.toISOString(),
      createdAtRelative: fullDateTime(m.createdAt),
      attachmentUrl: m.attachmentUrl,
    })),
  }
}

// ============================================
// FIND OR CREATE CONVERSATION
// ============================================

export async function findOrCreateConversation(
  userId: string,
  otherUserId: string,
  contextType?: 'application' | 'talent_profile' | 'smart_match' | 'general',
  contextId?: string
): Promise<string> {
  if (userId === otherUserId) {
    throw new Error('Tidak bisa chat dengan diri sendiri')
  }

  // Cari existing 1-on-1 conversation
  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: otherUserId } } },
      ],
      participants: { every: { userId: { in: [userId, otherUserId] } } },
    },
    select: { id: true },
  })

  if (existing) return existing.id

  // Buat baru
  const created = await prisma.conversation.create({
    data: {
      contextType: contextType ?? 'general',
      contextId: contextId ?? null,
      lastMessageAt: new Date(),
      participants: {
        create: [{ userId }, { userId: otherUserId }],
      },
    },
    select: { id: true },
  })

  return created.id
}

// ============================================
// GET UNREAD COUNT (semua conversations)
// ============================================

export async function getTotalUnreadMessages(userId: string): Promise<number> {
  return prisma.message.count({
    where: {
      isRead: false,
      senderId: { not: userId },
      conversation: {
        participants: { some: { userId } },
      },
    },
  })
}