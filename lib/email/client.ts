// lib/email/client.ts
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('[email] RESEND_API_KEY not set — email will not be sent')
}

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'VocAZ <noreply@vocaz.id>'