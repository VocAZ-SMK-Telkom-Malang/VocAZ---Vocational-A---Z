// app/register/student/_components/step-2-data.tsx
import { prisma } from '@/lib/prisma'
import { Step2DataForm } from './step-2-data-form'

export async function Step2Data() {
  const [schools, provinces] = await Promise.all([
    prisma.school.findMany({
      select: { id: true, name: true, city: true, province: true },
      orderBy: { name: 'asc' },
    }),
    prisma.province.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return <Step2DataForm schools={schools} provinces={provinces} />
}