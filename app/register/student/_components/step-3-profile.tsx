// app/register/student/_components/step-3-profile.tsx
import { prisma } from '@/lib/prisma'
import { Step3ProfileForm } from './step-3-profile-form'

export async function Step3Profile() {
  const skills = await prisma.skill.findMany({
    select: { id: true, name: true, category: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })

  return <Step3ProfileForm skills={skills} />
}