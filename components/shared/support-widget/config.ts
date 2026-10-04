// components/shared/support-widget/config.ts

export const SUPPORT_CONFIG = {
  name: 'VocAZ Help Center',
  subtitle: 'Tim Support Resmi',
  avatarUrl: '/vocaz2.png',      // ← ganti ke logo square
  avatarFallback: '/vocaz.png',      // ← fallback kalau square gak ada
  initial: 'V',                       // ← fallback huruf kalau dua-duanya gagal

  whatsapp: '6281212128164',
  email: 'vocaz@gmail.com',

  greeting:
    'Halo! Ada yang bisa kami bantu? Silakan pilih kanal komunikasi di bawah ini.',
  followUp:
    'Tim support kami akan merespons dalam 1×24 jam pada hari kerja.',

  channels: [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      description: 'Respon cepat via WhatsApp',
      icon: 'MessageCircle',
      color: 'emerald',
      href: (wa: string) =>
        `https://wa.me/${wa}?text=${encodeURIComponent(
          'Halo VocAZ, saya ingin bertanya tentang layanan Anda.'
        )}`,
      external: true,
    },
    {
      id: 'email',
      label: 'Email',
      description: 'Kirim pertanyaan via email',
      icon: 'Mail',
      color: 'blue',
      href: (email: string) =>
        `mailto:${email}?subject=${encodeURIComponent(
          'Pertanyaan tentang VocAZ'
        )}`,
      external: false,
    },
  ] as const,

  faqs: [
    {
      q: 'Apa itu VocAZ?',
      a: 'VocAZ adalah platform yang menghubungkan talenta SMK Indonesia dengan dunia industri melalui portofolio terverifikasi.',
    },
    {
      q: 'Bagaimana cara mendaftar?',
      a: 'Klik tombol "Join VocAZ" di halaman utama, pilih tipe akun (siswa/sekolah/perusahaan/lembaga sertifikasi), lalu ikuti langkah pendaftaran.',
    },
    {
      q: 'Apakah VocAZ gratis?',
      a: 'Untuk Perusahaan atau recruiter,VocAZ memberikan akses gratis kepada mereka.',
    },
    {
      q: 'Bagaimana cara memverifikasi sertifikat?',
      a: 'Upload sertifikat di halaman profil Anda, kemudian lembaga sertifikasi terkait akan memverifikasi dalam 1-3 hari kerja.',
    },
  ],
} as const

export type SupportChannelId = (typeof SUPPORT_CONFIG.channels)[number]['id']