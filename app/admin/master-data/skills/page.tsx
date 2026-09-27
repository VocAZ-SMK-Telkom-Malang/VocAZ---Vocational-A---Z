import { getSkills } from '@/lib/admin/queries'
import { SkillsClient } from './skills-client'

export default async function SkillsPage() {
  const { skills, totalCount } = await getSkills()
  return <SkillsClient skills={skills} totalCount={totalCount} />
}