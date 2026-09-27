import { getTalents, getTalentStats } from '@/lib/queries/talenta'
import { TalentaClient } from './talenta-client'

type SearchParams = Promise<{
  search?: string
  program?: string
  province?: string
  page?: string
}>

export default async function TalentaPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const page = parseInt(params.page || '1')

  const [result, stats] = await Promise.all([
    getTalents({
      search: params.search,
      program: params.program,
      province: params.province,
      page,
    }),
    getTalentStats(),
  ])

  return <TalentaClient result={result} stats={stats} />
}