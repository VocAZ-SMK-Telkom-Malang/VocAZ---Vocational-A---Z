import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

// =====================================================
// MASTER SKILLS
// =====================================================

const skills = [
  // Programming
  { name: 'JavaScript', category: 'Pemrograman' },
  { name: 'TypeScript', category: 'Pemrograman' },
  { name: 'Python', category: 'Pemrograman' },
  { name: 'Java', category: 'Pemrograman' },
  { name: 'PHP', category: 'Pemrograman' },
  { name: 'C++', category: 'Pemrograman' },
  { name: 'C#', category: 'Pemrograman' },
  { name: 'Go', category: 'Pemrograman' },
  { name: 'Kotlin', category: 'Pemrograman' },
  { name: 'Swift', category: 'Pemrograman' },

  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Svelte', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Bootstrap', category: 'Frontend' },
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },

  // Backend
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'NestJS', category: 'Backend' },
  { name: 'Laravel', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'Flask', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend' },

  // Database
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'SQLite', category: 'Database' },

  // Mobile
  { name: 'React Native', category: 'Mobile' },
  { name: 'Flutter', category: 'Mobile' },
  { name: 'Android Development', category: 'Mobile' },
  { name: 'iOS Development', category: 'Mobile' },

  // Design
  { name: 'Figma', category: 'Desain' },
  { name: 'Adobe XD', category: 'Desain' },
  { name: 'Photoshop', category: 'Desain' },
  { name: 'Illustrator', category: 'Desain' },
  { name: 'CorelDRAW', category: 'Desain' },
  { name: 'Canva', category: 'Desain' },
  { name: 'UI/UX Design', category: 'Desain' },

  // Engineering
  { name: 'AutoCAD', category: 'Teknik' },
  { name: 'SolidWorks', category: 'Teknik' },
  { name: 'PLC', category: 'Teknik' },
  { name: 'Arduino', category: 'Teknik' },
  { name: 'Raspberry Pi', category: 'Teknik' },
  { name: 'IoT', category: 'Teknik' },
  { name: '3D Printing', category: 'Teknik' },

  // Networking
  { name: 'Jaringan Komputer', category: 'Jaringan' },
  { name: 'Cisco', category: 'Jaringan' },
  { name: 'Mikrotik', category: 'Jaringan' },
  { name: 'Linux', category: 'Jaringan' },
  { name: 'Windows Server', category: 'Jaringan' },

  // Office
  { name: 'Microsoft Excel', category: 'Office' },
  { name: 'Microsoft Word', category: 'Office' },
  { name: 'Microsoft PowerPoint', category: 'Office' },
  { name: 'Google Workspace', category: 'Office' },

  // Soft Skill
  { name: 'Public Speaking', category: 'Soft Skill' },
  { name: 'Teamwork', category: 'Soft Skill' },
  { name: 'Leadership', category: 'Soft Skill' },
  { name: 'Problem Solving', category: 'Soft Skill' },
  { name: 'Time Management', category: 'Soft Skill' },
  { name: 'Communication', category: 'Soft Skill' },
  { name: 'Critical Thinking', category: 'Soft Skill' },
  { name: 'Adaptability', category: 'Soft Skill' },

  // Bahasa
  { name: 'Bahasa Inggris', category: 'Bahasa' },
  { name: 'Bahasa Jepang', category: 'Bahasa' },
  { name: 'Bahasa Korea', category: 'Bahasa' },
  { name: 'Bahasa Mandarin', category: 'Bahasa' },
  { name: 'Bahasa Jerman', category: 'Bahasa' },
]

// =====================================================
// SYSTEM SETTINGS
// =====================================================

const systemSettings = [
  {
    key: 'platform.name',
    value: { text: 'VocAZ' },
    description: 'Nama platform',
  },
  {
    key: 'platform.tagline',
    value: { text: 'Ekosistem Talenta SMK Indonesia' },
    description: 'Tagline platform',
  },
  {
    key: 'platform.version',
    value: { text: '0.1.0' },
    description: 'Versi platform',
  },
  {
    key: 'platform.maintenance',
    value: { enabled: false },
    description: 'Mode maintenance',
  },
  {
    key: 'verification.company.auto_approve',
    value: { enabled: false },
    description: 'Auto-approve verifikasi perusahaan',
  },
  {
    key: 'verification.certificate.auto_approve',
    value: { enabled: false },
    description: 'Auto-approve verifikasi sertifikat',
  },
  {
    key: 'moderation.auto_flag_threshold',
    value: { count: 5 },
    description: 'Jumlah report sebelum konten otomatis di-flag',
  },
  {
    key: 'showcase.max_duration_sec',
    value: { seconds: 300 },
    description: 'Durasi maksimal video showcase (detik)',
  },
  {
    key: 'showcase.max_size_mb',
    value: { mb: 100 },
    description: 'Ukuran maksimal video showcase (MB)',
  },
  {
    key: 'upload.max_avatar_size_mb',
    value: { mb: 5 },
    description: 'Ukuran maksimal avatar (MB)',
  },
]

// =====================================================
// SCHOOL PROGRAMS (contoh program keahlian SMK)
// =====================================================

const schoolPrograms = [
  { name: 'Rekayasa Perangkat Lunak', code: 'RPL' },
  { name: 'Teknik Komputer dan Jaringan', code: 'TKJ' },
  { name: 'Multimedia', code: 'MM' },
  { name: 'Desain Komunikasi Visual', code: 'DKV' },
  { name: 'Teknik Kendaraan Ringan Otomotif', code: 'TKRO' },
  { name: 'Teknik Sepeda Motor', code: 'TSM' },
  { name: 'Teknik Instalasi Tenaga Listrik', code: 'TITL' },
  { name: 'Teknik Pemesinan', code: 'TP' },
  { name: 'Teknik Pengelasan', code: 'TPL' },
  { name: 'Akuntansi dan Keuangan Lembaga', code: 'AKL' },
  { name: 'Otomatisasi dan Tata Kelola Perkantoran', code: 'OTKP' },
  { name: 'Bisnis Daring dan Pemasaran', code: 'BDP' },
  { name: 'Perhotelan', code: 'PH' },
  { name: 'Tata Boga', code: 'TB' },
  { name: 'Tata Busana', code: 'TBS' },
  { name: 'Agribisnis Tanaman Pangan dan Hortikultura', code: 'ATPH' },
]

// =====================================================
// MAIN SEED FUNCTION
// =====================================================

async function main() {
  console.log('🌱 Mulai seeding...')

  // 1. Skills
  console.log('📚 Seeding skills...')
  let skillCount = 0
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { category: skill.category },
      create: skill,
    })
    skillCount++
  }
  console.log(`   ✅ ${skillCount} skills`)

  // 2. System settings
  console.log('⚙️  Seeding system settings...')
  let settingCount = 0
  for (const setting of systemSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        description: setting.description,
      },
      create: setting,
    })
    settingCount++
  }
  console.log(`   ✅ ${settingCount} settings`)

  // 3. School programs (sebagai SystemSetting juga, karena belum ada tabel master)
  console.log('🏫 Seeding school programs...')
  await prisma.systemSetting.upsert({
    where: { key: 'master.school_programs' },
    update: {
      value: { programs: schoolPrograms },
      description: 'Master program keahlian SMK',
    },
    create: {
      key: 'master.school_programs',
      value: { programs: schoolPrograms },
      description: 'Master program keahlian SMK',
    },
  })
  console.log(`   ✅ ${schoolPrograms.length} program keahlian`)

  console.log('')
  console.log('🎉 Seeding selesai!')
  console.log('')
  console.log('Ringkasan:')
  console.log(`  - Skills       : ${skillCount}`)
  console.log(`  - Settings     : ${settingCount + 1}`)
  console.log(`  - Programs     : ${schoolPrograms.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })