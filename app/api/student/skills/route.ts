// app/api/student/skills/route.ts
import { NextResponse } from 'next/server'
import { getStudentSkills } from '@/lib/queries/skills'

export async function GET() {
  const skills = await getStudentSkills()
  return NextResponse.json({ skills })
}