// app/company/profile/profile-client.tsx
'use client'

import { useState } from 'react'
import { Building2, BookOpen, Gift, MapPin } from 'lucide-react'
import { ProfileHeader } from '@/components/company/profile/profile-header'
import { BasicInfoForm } from '@/components/company/profile/basic-info-form'
import { AboutForm } from '@/components/company/profile/about-form'
import { BenefitsForm } from '@/components/company/profile/benefits-form'
import { ContactForm } from '@/components/company/profile/contact-form'

type TabKey = 'basic' | 'about' | 'benefits' | 'contact'

type Props = {
  company: {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    coverUrl: string | null
    tagline: string | null
    industry: string | null
    companySize: string | null
    website: string | null
    email: string | null
    phone: string | null
    foundedYear: number | null
    employeeRange: string | null
    description: string | null
    culture: string | null
    benefits: string[]
    address: string | null
    city: string | null
    province: string | null
    linkedinUrl: string | null
    instagramUrl: string | null
    facebookUrl: string | null
    verificationStatus: string
    completion: number
  }
}

export function CompanyProfileClient({ company }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('basic')

  const tabs: Array<{ key: TabKey; label: string; icon: any }> = [
    { key: 'basic', label: 'Info Dasar', icon: Building2 },
    { key: 'about', label: 'Tentang', icon: BookOpen },
    { key: 'benefits', label: 'Benefit', icon: Gift },
    { key: 'contact', label: 'Kontak & Sosial', icon: MapPin },
  ]

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <ProfileHeader
        companyName={company.name}
        slug={company.slug}
        logoUrl={company.logoUrl}
        verified={company.verificationStatus === 'verified'}
        completion={company.completion}
      />

      {/* Tabs */}
      <div className="border-b border-outline-variant/30">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon
            const isActive = activeTab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`
                  relative px-4 py-3 text-sm font-bold transition-colors whitespace-nowrap
                  ${
                    isActive
                      ? 'text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }
                `}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {t.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 md:p-8">
        {activeTab === 'basic' && <BasicInfoForm company={company} />}
        {activeTab === 'about' && (
          <AboutForm
            description={company.description}
            culture={company.culture}
          />
        )}
        {activeTab === 'benefits' && (
          <BenefitsForm benefits={company.benefits} />
        )}
        {activeTab === 'contact' && (
          <ContactForm
            address={company.address}
            city={company.city}
            province={company.province}
            linkedinUrl={company.linkedinUrl}
            instagramUrl={company.instagramUrl}
            facebookUrl={company.facebookUrl}
          />
        )}
      </div>
    </div>
  )
}