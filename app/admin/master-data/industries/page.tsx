import { getIndustries } from '@/lib/admin/queries'
import { IndustriesClient } from './industries-client'

export default async function IndustriesPage() {
  const industries = await getIndustries()
  return <IndustriesClient industries={industries} />
}