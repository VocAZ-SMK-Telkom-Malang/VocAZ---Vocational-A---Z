// app/register/company/_components/step-2-data.tsx
import { getIndustries, getProvinces } from '@/lib/admin/queries'
import { Step2DataForm } from './step-2-data-form'

export async function Step2Data() {
  const [industries, provinces] = await Promise.all([
    getIndustries(),
    getProvinces(),
  ])

  return (
    <Step2DataForm
      industries={industries.map((i) => ({
        id: i.id,
        name: i.name,
        slug: i.slug,
      }))}
      provinces={provinces.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
      }))}
    />
  )
}