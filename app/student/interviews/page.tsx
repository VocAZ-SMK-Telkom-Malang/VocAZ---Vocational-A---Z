// app/student/interviews/page.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import {
  AI_INTERVIEW_STATUS_LABEL,
  AI_INTERVIEW_STATUS_STYLE,
} from '@/lib/ai-interview/constants'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'AI Interview Saya — VocAZ',
}

export default async function StudentInterviewsPage() {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      role: true,
      studentProfile: { select: { id: true } },
    },
  })

  if (!user || user.role !== 'student' || !user.studentProfile) {
    redirect('/onboarding')
  }

  const interviews = await prisma.aiInterview.findMany({
    where: {
      application: { studentId: user.studentProfile.id },
    },
    orderBy: { invitedAt: 'desc' },
    include: {
      application: {
        include: {
          job: {
            include: {
              company: {
                select: { name: true, logoUrl: true },
              },
            },
          },
        },
      },
      _count: {
        select: { answers: { where: { answer: { not: null } } } },
      },
    },
  })

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
          AI Interview Saya
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Interview awal dari recruiter dengan AI — jawab pertanyaan via teks.
        </p>
      </div>

      {interviews.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-16 text-center">
          <Sparkles className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-on-surface mb-1">
            Belum ada undangan AI Interview
          </h3>
          <p className="text-sm text-on-surface-variant">
            Undangan akan muncul di sini saat recruiter mengirimnya.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {interviews.map((iv) => {
            const statusCfg = {
              label: AI_INTERVIEW_STATUS_LABEL[iv.status] ?? iv.status,
              style: AI_INTERVIEW_STATUS_STYLE[iv.status] ?? '',
            }
            const answered = iv._count.answers
            const total = Array.isArray(iv.questions)
              ? (iv.questions as any[]).length
              : 0

            return (
              <Link
                key={iv.id}
                href={`/student/interviews/${iv.id}`}
                className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  {iv.application.job.company.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={iv.application.job.company.logoUrl}
                      alt={iv.application.job.company.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold shrink-0">
                      {iv.application.job.company.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                        {iv.application.job.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md border font-mono text-[10px] font-bold ${statusCfg.style}`}
                      >
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      {iv.application.job.company.name}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-[11px] text-on-surface-variant">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(iv.invitedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      {iv.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          {answered}/{total} terjawab
                        </span>
                      )}
                      {iv.status === 'pending' && (
                        <span className="text-amber-600 font-bold">
                          {answered}/{total} terjawab
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-on-surface-variant/40 group-hover:text-primary shrink-0 mt-2 transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}