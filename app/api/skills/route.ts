// app/api/skills/route.ts
import { NextResponse } from 'next/server'
import { getAllSkills } from '@/lib/queries/skills'

export async function GET() {
  const skills = await getAllSkills()
  return NextResponse.json({ skills })
}