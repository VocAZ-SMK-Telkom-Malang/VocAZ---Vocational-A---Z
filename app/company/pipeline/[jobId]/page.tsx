// app/company/pipeline/[jobId]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import { getPipelineBoard } from '@/lib/queries/company-pipeline'
import { PipelineClient } from './pipeline-client'

type Props = {
  params: Promise<{ jobId: string }>
}

export async function generateMetadata({ params }: Props) {
  const { jobId } = await params
  const ctx = await getCompanyContext()
  if (!ctx) return { title: 'Pipeline — VocAZ' }

  const board = await getPipelineBoard(jobId, ctx.companyId)
  return {
    title: board
      ? `Pipeline — ${board.job.title} — VocAZ`
      : 'Pipeline — VocAZ',
  }
}

export default async function PipelineJobPage({ params }: Props) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const { jobId } = await params
  const board = await getPipelineBoard(jobId, ctx.companyId)

  if (!board) notFound()

  return <PipelineClient board={board} />
}