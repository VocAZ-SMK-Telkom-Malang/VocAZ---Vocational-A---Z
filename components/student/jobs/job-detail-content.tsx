// components/student/jobs/job-detail-content.tsx
import { FileText, CheckCircle2, ListChecks, Sparkles } from 'lucide-react'

type Props = {
  description: string | null
  requirements: string | null
  responsibilities: string | null
  skills: { id: string; name: string; isRequired: boolean }[]
}

export function JobDetailContent({
  description,
  requirements,
  responsibilities,
  skills,
}: Props) {
  const hasContent =
    description || requirements || responsibilities || skills.length > 0

  if (!hasContent) {
    return (
      <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-8 text-center">
        <p className="text-sm text-on-surface-variant">
          Belum ada detail untuk lowongan ini.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {description && (
        <Section icon={FileText} title="Deskripsi Pekerjaan">
          <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
            {description}
          </div>
        </Section>
      )}

      {responsibilities && (
        <Section icon={ListChecks} title="Tanggung Jawab">
          <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
            {responsibilities}
          </div>
        </Section>
      )}

      {requirements && (
        <Section icon={CheckCircle2} title="Kualifikasi">
          <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
            {requirements}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section icon={Sparkles} title="Skill yang Dibutuhkan">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  skill.isRequired
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {skill.name}
                {skill.isRequired && (
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">
                    Wajib
                  </span>
                )}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="font-display text-base font-bold text-on-surface">
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}