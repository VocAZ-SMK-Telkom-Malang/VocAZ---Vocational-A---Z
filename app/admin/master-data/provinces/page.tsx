import { getProvinces } from '@/lib/admin/queries'
import { ProvincesClient } from './provinces-client'

export default async function ProvincesPage() {
  const provinces = await getProvinces()
  return <ProvincesClient provinces={provinces} />
}