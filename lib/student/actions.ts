// lib/student/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

type ActionResult = { ok: boolean; error?: string; data?: any }

// ============================================
// HELPER: Get current student profile
// ============================================

async function getCurrentStudentProfile() {
  const session = await getServerSession()
  if (!session?.user) return null

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: true },
  })

  return user?.studentProfile || null
}

// ============================================
// TOGGLE SAVE JOB
// ============================================

export async function toggleSaveJob(jobId: string): Promise<ActionResult> {
  try {
    const profile = await getCurrentStudentProfile()
    if (!profile) {
      return { ok: false, error: 'Harus login sebagai student' }
    }

    const existing = await prisma.savedJob.findUnique({
      where: {
        studentId_jobId: {
          studentId: profile.id,
          jobId,
        },
      },
    })

    if (existing) {
      await prisma.savedJob.delete({ where: { id: existing.id } })
      revalidatePath('/student/saved')
      return { ok: true, data: { saved: false } }
    }

    await prisma.savedJob.create({
      data: { studentId: profile.id, jobId },
    })
    revalidatePath('/student/saved')
    return { ok: true, data: { saved: true } }
  } catch (err) {
    console.error('Toggle save job error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal menyimpan',
    }
  }
}

// ============================================
// APPLY JOB
// ============================================

type ApplyJobInput = {
  jobId: string
  coverLetter?: string
  resumeUrl?: string
  resumeKey?: string
}

export async function applyJob(input: ApplyJobInput): Promise<ActionResult> {
  try {
    const profile = await getCurrentStudentProfile()
    if (!profile) {
      return { ok: false, error: 'Harus login sebagai student' }
    }

    // Cek sudah pernah lamar?
    const existing = await prisma.application.findUnique({
      where: {
        jobId_studentId: {
          jobId: input.jobId,
          studentId: profile.id,
        },
      },
    })

    if (existing) {
      return { ok: false, error: 'Kamu sudah melamar lowongan ini' }
    }

    // Cek job masih aktif
    const job = await prisma.job.findUnique({
      where: { id: input.jobId },
      select: { id: true, status: true, title: true, companyId: true },
    })

    if (!job || job.status !== 'active') {
      return { ok: false, error: 'Lowongan sudah tidak aktif' }
    }

    // Buat application
    const application = await prisma.application.create({
      data: {
        jobId: input.jobId,
        studentId: profile.id,
        coverLetter: input.coverLetter || null,
        resumeUrl: input.resumeUrl || null,
        resumeKey: input.resumeKey || null,
        status: 'submitted',
      },
    })

    // Buat status history
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        status: 'submitted',
        notes: 'Lamaran dikirim',
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: profile.userId,
        action: 'job.apply',
        targetType: 'job',
        targetId: input.jobId,
        metadata: {
          jobTitle: job.title,
          applicationId: application.id,
        },
      },
    })

    revalidatePath('/student/applications')
    revalidatePath('/student/dashboard')
    revalidatePath(`/student/jobs`)

    return {
      ok: true,
      data: { applicationId: application.id },
    }
  } catch (err) {
    console.error('Apply job error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal melamar',
    }
  }
}

// ============================================
// WITHDRAW APPLICATION
// ============================================

export async function withdrawApplication(
  applicationId: string
): Promise<ActionResult> {
  try {
    const profile = await getCurrentStudentProfile()
    if (!profile) {
      return { ok: false, error: 'Harus login sebagai student' }
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (!application || application.studentId !== profile.id) {
      return { ok: false, error: 'Lamaran tidak ditemukan' }
    }

    if (['hired', 'rejected', 'withdrawn'].includes(application.status)) {
      return { ok: false, error: 'Lamaran sudah final, tidak bisa dibatalkan' }
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'withdrawn' },
    })

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        status: 'withdrawn',
        notes: 'Dibatalkan oleh pelamar',
      },
    })

    revalidatePath('/student/applications')
    revalidatePath('/student/dashboard')

    return { ok: true }
  } catch (err) {
    console.error('Withdraw application error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal membatalkan',
    }
  }
}

// ============================================
// SHOWCASE VIDEO — CREATE / UPDATE
// ============================================

type SaveShowcaseInput = {
  id?: string
  title: string
  description?: string
  videoUrl: string
  videoKey?: string | null
  videoSource: 'upload' | 'youtube' | 'tiktok' | 'gdrive' | 'instagram'
  thumbnailUrl?: string | null
  thumbnailKey?: string | null
  category?: string
  skillTags?: string[]
  durationSec?: number
  status?: 'draft' | 'published'
}

export async function saveShowcaseVideo(
  input: SaveShowcaseInput
): Promise<ActionResult> {
  try {
    const profile = await getCurrentStudentProfile()
    if (!profile) return { ok: false, error: 'Harus login sebagai student' }

    // Validasi
    if (!input.title || input.title.trim().length < 2) {
      return { ok: false, error: 'Judul minimal 2 karakter' }
    }

    if (!input.videoUrl) {
      return { ok: false, error: 'Video wajib diisi' }
    }

    // Upload source wajib punya videoKey
    if (input.videoSource === 'upload' && !input.videoKey) {
      return { ok: false, error: 'Video upload tidak valid' }
    }

    // Instagram wajib thumbnail
    if (input.videoSource === 'instagram' && !input.thumbnailUrl) {
      return { ok: false, error: 'Instagram wajib upload thumbnail' }
    }

    const status = input.status || 'published'
    const publishedAt = status === 'published' ? new Date() : null

    // UPDATE
    if (input.id) {
      const existing = await prisma.showcaseVideo.findFirst({
        where: { id: input.id, studentId: profile.id },
      })
      if (!existing) return { ok: false, error: 'Video tidak ditemukan' }

      const updated = await prisma.showcaseVideo.update({
        where: { id: input.id },
        data: {
          title: input.title.trim(),
          description: input.description?.trim() || null,
          videoUrl: input.videoUrl,
          videoKey: input.videoKey || null,
          videoSource: input.videoSource,
          thumbnailUrl: input.thumbnailUrl || null,
          thumbnailKey: input.thumbnailKey || null,
          category: input.category?.trim() || null,
          skillTags: input.skillTags || [],
          durationSec: input.durationSec || null,
          status,
          publishedAt:
            status === 'published' ? existing.publishedAt || new Date() : null,
        },
      })

      await prisma.auditLog.create({
        data: {
          actorId: profile.userId,
          action: 'showcase.update',
          targetType: 'showcase_video',
          targetId: updated.id,
        },
      })

      revalidatePath('/student/showcase/my')
      revalidatePath('/student/dashboard')

      return { ok: true, data: { id: updated.id } }
    }

    // CREATE
    const created = await prisma.showcaseVideo.create({
      data: {
        studentId: profile.id,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        videoUrl: input.videoUrl,
        videoKey: input.videoKey || null,
        videoSource: input.videoSource,
        thumbnailUrl: input.thumbnailUrl || null,
        thumbnailKey: input.thumbnailKey || null,
        category: input.category?.trim() || null,
        skillTags: input.skillTags || [],
        durationSec: input.durationSec || null,
        status,
        publishedAt,
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: profile.userId,
        action: 'showcase.create',
        targetType: 'showcase_video',
        targetId: created.id,
        metadata: {
          title: created.title,
          source: input.videoSource,
          status,
        },
      },
    })

    revalidatePath('/student/showcase/my')
    revalidatePath('/student/dashboard')

    return { ok: true, data: { id: created.id } }
  } catch (err) {
    console.error('Save showcase error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal menyimpan',
    }
  }
}

// ============================================
// SHOWCASE VIDEO — DELETE
// ============================================

export async function deleteShowcaseVideo(
  videoId: string
): Promise<ActionResult> {
  try {
    const profile = await getCurrentStudentProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    const existing = await prisma.showcaseVideo.findFirst({
      where: { id: videoId, studentId: profile.id },
    })
    if (!existing) return { ok: false, error: 'Video tidak ditemukan' }

    await prisma.showcaseVideo.delete({ where: { id: videoId } })

    await prisma.auditLog.create({
      data: {
        actorId: profile.userId,
        action: 'showcase.delete',
        targetType: 'showcase_video',
        targetId: videoId,
        metadata: { title: existing.title },
      },
    })

    revalidatePath('/student/showcase/my')
    revalidatePath('/student/dashboard')

    return { ok: true }
  } catch (err) {
    console.error('Delete showcase error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal menghapus',
    }
  }
}

// ============================================
// SHOWCASE INTERACTIONS
// ============================================

// Helper: Get current user (semua role)
async function getCurrentUser() {
  const session = await getServerSession()
  if (!session?.user) return null

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      fullName: true,
      studentProfile: { select: { id: true } },
    },
  })

  return user
}

// ============================================
// 1. TOGGLE LIKE (student only)
// ============================================

export async function toggleShowcaseLike(
  videoId: string
): Promise<ActionResult & { liked?: boolean; likeCount?: number }> {
  try {
    const user = await getCurrentUser()
    if (!user) return { ok: false, error: 'Harus login' }

    if (user.role !== 'student') {
      return { ok: false, error: 'Hanya siswa yang bisa like video' }
    }

    // Cek video ada & published
    const video = await prisma.showcaseVideo.findFirst({
      where: { id: videoId, status: 'published' },
      select: { id: true, likeCount: true },
    })
    if (!video) return { ok: false, error: 'Video tidak ditemukan' }

    // Cek existing like
    const existing = await prisma.showcaseLike.findUnique({
      where: {
        videoId_userId: { videoId, userId: user.id },
      },
    })

    if (existing) {
      // Unlike
      await prisma.$transaction([
        prisma.showcaseLike.delete({ where: { id: existing.id } }),
        prisma.showcaseVideo.update({
          where: { id: videoId },
          data: { likeCount: { decrement: 1 } },
        }),
      ])

      revalidatePath('/showcase')
      revalidatePath(`/showcase/${videoId}`)

      return { ok: true, liked: false, likeCount: Math.max(0, video.likeCount - 1) }
    }

    // Like
    await prisma.$transaction([
      prisma.showcaseLike.create({
        data: { videoId, userId: user.id },
      }),
      prisma.showcaseVideo.update({
        where: { id: videoId },
        data: { likeCount: { increment: 1 } },
      }),
    ])

    revalidatePath('/showcase')
    revalidatePath(`/showcase/${videoId}`)

    return { ok: true, liked: true, likeCount: video.likeCount + 1 }
  } catch (err) {
    console.error('Toggle like error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal like',
    }
  }
}

// ============================================
// 2. ADD COMMENT (student only)
// ============================================

export async function addShowcaseComment(
  videoId: string,
  body: string
): Promise<ActionResult & { commentId?: string; commentCount?: number }> {
  try {
    const user = await getCurrentUser()
    if (!user) return { ok: false, error: 'Harus login' }

    if (user.role !== 'student') {
      return { ok: false, error: 'Hanya siswa yang bisa komentar' }
    }

    const trimmed = body?.trim()
    if (!trimmed) return { ok: false, error: 'Komentar tidak boleh kosong' }
    if (trimmed.length > 500) {
      return { ok: false, error: 'Komentar maksimal 500 karakter' }
    }

    // Cek video
    const video = await prisma.showcaseVideo.findFirst({
      where: { id: videoId, status: 'published' },
      select: { id: true, commentCount: true },
    })
    if (!video) return { ok: false, error: 'Video tidak ditemukan' }

    const [comment] = await prisma.$transaction([
      prisma.showcaseComment.create({
        data: { videoId, userId: user.id, body: trimmed },
      }),
      prisma.showcaseVideo.update({
        where: { id: videoId },
        data: { commentCount: { increment: 1 } },
      }),
    ])

    revalidatePath('/showcase')
    revalidatePath(`/showcase/${videoId}`)

    return {
      ok: true,
      commentId: comment.id,
      commentCount: video.commentCount + 1,
    }
  } catch (err) {
    console.error('Add comment error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal komentar',
    }
  }
}

// ============================================
// 3. DELETE COMMENT (student only, own comment)
// ============================================

export async function deleteShowcaseComment(
  commentId: string
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    if (!user) return { ok: false, error: 'Harus login' }

    const comment = await prisma.showcaseComment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true, videoId: true },
    })

    if (!comment) return { ok: false, error: 'Komentar tidak ditemukan' }

    if (comment.userId !== user.id) {
      return { ok: false, error: 'Kamu tidak bisa hapus komentar orang lain' }
    }

    await prisma.$transaction([
      prisma.showcaseComment.delete({ where: { id: commentId } }),
      prisma.showcaseVideo.update({
        where: { id: comment.videoId },
        data: { commentCount: { decrement: 1 } },
      }),
    ])

    revalidatePath('/showcase')
    revalidatePath(`/showcase/${comment.videoId}`)

    return { ok: true }
  } catch (err) {
    console.error('Delete comment error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal hapus komentar',
    }
  }
}

// ============================================
// 4. TOGGLE FOLLOW (student only, target: student)
// ============================================

export async function toggleFollowStudent(
  targetStudentProfileId: string
): Promise<ActionResult & { following?: boolean; followerCount?: number }> {
  try {
    const user = await getCurrentUser()
    if (!user) return { ok: false, error: 'Harus login' }

    if (user.role !== 'student') {
      return { ok: false, error: 'Hanya siswa yang bisa follow' }
    }

    if (!user.studentProfile) {
      return { ok: false, error: 'Profil student tidak ditemukan' }
    }

    // Cek tidak follow diri sendiri
    if (user.studentProfile.id === targetStudentProfileId) {
      return { ok: false, error: 'Tidak bisa follow diri sendiri' }
    }

    // Cek target ada
    const target = await prisma.studentProfile.findUnique({
      where: { id: targetStudentProfileId },
      select: { id: true, isPublic: true, followerCount: true },
    })
    if (!target) return { ok: false, error: 'Student tidak ditemukan' }
    if (!target.isPublic) {
      return { ok: false, error: 'Profil ini privat' }
    }

    // Cek existing
    const existing = await prisma.studentFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetStudentProfileId,
        },
      },
    })

    if (existing) {
      // Unfollow
      await prisma.$transaction([
        prisma.studentFollow.delete({ where: { id: existing.id } }),
        prisma.studentProfile.update({
          where: { id: targetStudentProfileId },
          data: { followerCount: { decrement: 1 } },
        }),
        prisma.studentProfile.update({
          where: { id: user.studentProfile.id },
          data: { followingCount: { decrement: 1 } },
        }),
      ])

      revalidatePath('/showcase')
      revalidatePath(`/student/talents/${targetStudentProfileId}`)

      return {
        ok: true,
        following: false,
        followerCount: Math.max(0, target.followerCount - 1),
      }
    }

    // Follow
    await prisma.$transaction([
      prisma.studentFollow.create({
        data: {
          followerId: user.id,
          followingId: targetStudentProfileId,
        },
      }),
      prisma.studentProfile.update({
        where: { id: targetStudentProfileId },
        data: { followerCount: { increment: 1 } },
      }),
      prisma.studentProfile.update({
        where: { id: user.studentProfile.id },
        data: { followingCount: { increment: 1 } },
      }),
    ])

    revalidatePath('/showcase')
    revalidatePath(`/student/talents/${targetStudentProfileId}`)

    return {
      ok: true,
      following: true,
      followerCount: target.followerCount + 1,
    }
  } catch (err) {
    console.error('Toggle follow error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal follow',
    }
  }
}

// ============================================
// 5. RECORD SHARE (semua role login)
// ============================================

export async function recordShowcaseShare(
  videoId: string
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    if (!user) return { ok: false, error: 'Harus login' }

    await prisma.showcaseVideo.update({
      where: { id: videoId },
      data: { shareCount: { increment: 1 } },
    })

    return { ok: true }
  } catch (err) {
    console.error('Record share error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal record share',
    }
  }
}

// ============================================
// 6. INCREMENT VIEW (semua role login)
// ============================================

export async function incrementShowcaseView(
  videoId: string
): Promise<ActionResult> {
  try {
    await prisma.showcaseVideo.update({
      where: { id: videoId },
      data: { viewCount: { increment: 1 } },
    })
    return { ok: true }
  } catch (err) {
    console.error('Increment view error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal record view',
    }
  }
}

// ============================================
// CLIENT-CALLABLE WRAPPERS (untuk feed)
// ============================================

export async function fetchShowcaseFeed(input: {
  page: number
  limit?: number
  excludeStudentId?: string
}) {
  const { getShowcaseFeed } = await import('./queries')
  return getShowcaseFeed(input)
}

export async function fetchVideoComments(
  videoId: string,
  options?: { cursor?: string; limit?: number }
) {
  const { getVideoComments } = await import('./queries')
  return getVideoComments(videoId, options)
}