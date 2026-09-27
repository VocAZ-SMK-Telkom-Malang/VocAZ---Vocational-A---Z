// lib/register/steps.ts
export type Role = 'student' | 'company' | 'school' | 'certification'

export type Step = {
  number: number
  label: string
  key: string
}

export const REGISTER_STEPS: Record<Role, Step[]> = {
  student: [
    { number: 1, label: 'Akun', key: 'account' },
    { number: 2, label: 'Profil', key: 'profile' },
    { number: 3, label: 'Selesai', key: 'done' },
  ],
  company: [
    { number: 1, label: 'Akun', key: 'account' },
    { number: 2, label: 'Data Perusahaan', key: 'data' },
    { number: 3, label: 'Verifikasi', key: 'verification' },
    { number: 4, label: 'Selesai', key: 'done' },
  ],
  school: [
    { number: 1, label: 'Akun', key: 'account' },
    { number: 2, label: 'Data Sekolah', key: 'data' },
    { number: 3, label: 'Selesai', key: 'done' },
  ],
  certification: [
    { number: 1, label: 'Akun', key: 'account' },
    { number: 2, label: 'Data Lembaga', key: 'data' },
    { number: 3, label: 'Selesai', key: 'done' },
  ],
}

export const ROLE_LABELS: Record<Role, string> = {
  student: 'Siswa & Alumni SMK',
  company: 'Perusahaan & Recruiter',
  school: 'SMK & BKK',
  certification: 'Lembaga Sertifikasi',
}