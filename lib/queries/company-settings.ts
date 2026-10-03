// lib/queries/company-settings.ts
import { prisma } from '@/lib/prisma'

export type CompanySettingsData = {
  // Account
  email: string
  fullName: string
  phone: string | null
  jobTitle: string | null

  // Notification
  emailNotifications: boolean
  applicationUpdates: boolean
  newMessages: boolean
  talentRecommendations: boolean

  // Company info (read-only display)
  companyName: string
  companySlug: string | null
  verificationStatus: string
}

const DEFAULT_SETTINGS: CompanySettingsData = {
  email: '',
  fullName: '',
  phone: null,
  jobTitle: null,
  emailNotifications: true,
  applicationUpdates: true,
  newMessages: true,
  talentRecommendations: true,
  companyName: '',
  companySlug: null,
  verificationStatus: 'unverified',
}

export async function getCompanySettings(
  companyId: string
): Promise<CompanySettingsData> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      name: true,
      slug: true,
      verificationStatus: true,
      owner: {
        select: {
          email: true,
          fullName: true,
          phone: true,
          jobTitle: true,
          notificationPrefs: true,
        },
      },
    },
  })

  if (!company || !company.owner) return DEFAULT_SETTINGS

  const owner = company.owner
  const prefs = (owner.notificationPrefs ?? {}) as Record<string, boolean>

  return {
    email: owner.email,
    fullName: owner.fullName ?? '',
    phone: owner.phone,
    jobTitle: owner.jobTitle,
    emailNotifications: prefs.emailNotifications ?? true,
    applicationUpdates: prefs.applicationUpdates ?? true,
    newMessages: prefs.newMessages ?? true,
    talentRecommendations: prefs.talentRecommendations ?? true,
    companyName: company.name,
    companySlug: company.slug,
    verificationStatus: company.verificationStatus,
  }
}