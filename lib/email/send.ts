// lib/email/send.ts
import { resend, FROM_EMAIL } from './client'
import { TeamInviteEmail } from './templates/team-invite'

type SendTeamInviteParams = {
  to: string
  companyName: string
  inviterName: string
  role: string
  inviteUrl: string
  expiresAt: string
}

export async function sendTeamInviteEmail(params: SendTeamInviteParams) {
  if (!resend) {
    console.warn('[email] Resend not configured — skip sending')
    return { ok: false, error: 'Email service not configured' }
  }

  try {
    const html = TeamInviteEmail({
      companyName: params.companyName,
      inviterName: params.inviterName,
      role: params.role,
      inviteUrl: params.inviteUrl,
      expiresAt: params.expiresAt,
    })

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Undangan Bergabung ke ${params.companyName} — VocAZ`,
      html,
    })

    if (result.error) {
      console.error('[email] Send failed:', result.error)
      return { ok: false, error: result.error.message }
    }

    return { ok: true, id: result.data?.id }
  } catch (err: any) {
    console.error('[email] Error:', err?.message)
    return { ok: false, error: err?.message ?? 'Gagal kirim email' }
  }
}