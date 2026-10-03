// lib/ai-interview/constants.ts

export const DEFAULT_AI_INTERVIEW_QUESTIONS = [
  'Ceritakan tentang posisi terakhirmu. Apa tanggung jawab utamamu saat itu?',
  'Apa yang kamu cari dari posisi berikutnya?',
  'Apa yang paling membuatmu tertarik untuk bekerja di perusahaan ini?',
  'Keahlian atau skill khusus apa yang menurutmu akan sesuai dengan posisi ini?',
  'Ceritakan situasi sulit yang pernah kamu hadapi. Apa yang terjadi, dan apa yang kamu lakukan?',
  'Jika kamu diterima di posisi ini, kapan kamu bisa mulai bekerja?',
]

export const AI_INTERVIEW_EXPIRY_DAYS = 7

export const AI_INTERVIEW_STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu Dijawab',
  completed: 'Selesai',
  expired: 'Kedaluwarsa',
  cancelled: 'Dibatalkan',
}

export const AI_INTERVIEW_STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-surface-container text-on-surface-variant border-outline-variant',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
}