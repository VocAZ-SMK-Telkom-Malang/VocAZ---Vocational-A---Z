// components/shared/student-profile/student-profile-view.tsx
'use client'

import { ProfileHero } from './profile-hero'
import { ProfileContent } from './profile-content'
import { OwnerActions } from './role-actions/owner-actions'
import { RecruiterActions } from './role-actions/recruiter-actions'
import { StudentActions } from './role-actions/student-actions'
import { SchoolActions } from './role-actions/school-actions'
import { PublicActions } from './role-actions/public-actions'
import type {
  StudentProfileDetail,
  ViewerContext,
} from '@/lib/queries/student-profile-detail'

type ApplicationContext = {
  applicationId: string
  jobId: string
  jobTitle: string
  status: string
  appliedAt: string
  coverLetter: string | null
  resumeUrl: string | null
  matchScore: number | null
}

type Props = {
  profile: StudentProfileDetail
  viewer: ViewerContext
  initialFollowing?: boolean
  applicationContext?: ApplicationContext
  onEdit?: () => void
}

export function StudentProfileView({
  profile,
  viewer,
  initialFollowing = false,
  applicationContext,
  onEdit,
}: Props) {
  // ============================================
  // RENDER ROLE-SPECIFIC ACTIONS
  // ============================================

  function renderActions() {
    if (viewer.isOwner && onEdit) {
      return <OwnerActions profile={profile} onEdit={onEdit} />
    }

    switch (viewer.role) {
      case 'company':
        return (
          <RecruiterActions
            profile={profile}
            applicationContext={applicationContext}
          />
        )

      case 'student':
        return (
          <StudentActions
            profile={profile}
            initialFollowing={initialFollowing}
          />
        )

      case 'school':
        return <SchoolActions profile={profile} />

      case 'admin':
        return <RecruiterActions profile={profile} />

      case 'guest':
      default:
        return <PublicActions />
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      <ProfileHero
        profile={profile}
        viewer={viewer}
        actionsSlot={renderActions()}
      />

      <ProfileContent
        profile={profile}
        viewer={viewer}
        applicationContext={applicationContext}
      />
    </div>
  )
}