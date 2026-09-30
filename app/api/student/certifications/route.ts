// app/api/student/certifications/route.ts
import { NextResponse } from 'next/server'
import { getStudentCertificates } from '@/lib/queries/certifications'

export async function GET() {
  const certificates = await getStudentCertificates()
  return NextResponse.json({ certificates })
}