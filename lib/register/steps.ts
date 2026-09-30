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
    { number: 1, label: 'Pilih Paket', key: 'plan' },
    { number: 2, label: 'Pembayaran', key: 'payment' },
    { number: 3, label: 'Akun', key: 'account' },
    { number: 4, label: 'Data Sekolah', key: 'school' },
    { number: 5, label: 'Selesai', key: 'done' },
  ],
  certification: [
    { number: 1, label: 'Tipe Lembaga', key: 'type' },
    { number: 2, label: 'Akun', key: 'account' },
    { number: 3, label: 'Data Lembaga', key: 'institution' },
    { number: 4, label: 'Selesai', key: 'done' },
  ],
}

export const ROLE_LABELS: Record<Role, string> = {
  student: 'Siswa & Alumni SMK',
  company: 'Perusahaan & Recruiter',
  school: 'SMK & BKK',
  certification: 'Lembaga Sertifikasi',
}