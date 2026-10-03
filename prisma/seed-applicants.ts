// prisma/seed-applicants.ts
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { recalculateApplicationMatch } from '../lib/matching/recalculate'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

// ============================================
// HELPER — Generate Neon Auth ID (fake, untuk seed)
// ============================================

function fakeNeonAuthId(seed: string): string {
  // UUID v4 format, deterministic dari string
  const crypto = require('crypto')
  const hash = crypto.createHash('md5').update(seed).digest('hex')
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`
}

// ============================================
// STUDENTS
// ============================================

const students = [
  {
    email: 'budi.santoso@demo.vocaz.id',
    fullName: 'Budi Santoso',
    phone: '+62 812-1111-0001',
    headline: 'Frontend Developer Enthusiast',
    bio: 'Siswa SMK Telkom Malang jurusan RPL. Fokus di React & Next.js. Pernah magang 6 bulan di startup lokal.',
    city: 'Malang',
    province: 'Jawa Timur',
    gender: 'male' as const,
    isOpenToWork: true,
    skills: [
      { name: 'React', proficiency: 'advanced' as const },
      { name: 'TypeScript', proficiency: 'intermediate' as const },
      { name: 'Next.js', proficiency: 'intermediate' as const },
      { name: 'Tailwind CSS', proficiency: 'advanced' as const },
      { name: 'HTML', proficiency: 'expert' as const },
      { name: 'CSS', proficiency: 'expert' as const },
      { name: 'Git', proficiency: 'intermediate' as const },
    ],
    experiences: [
      {
        title: 'Frontend Developer Intern',
        companyName: 'PT Kreatif Digital Nusantara',
        employmentType: 'internship' as const,
        location: 'Malang',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-12-01'),
        isCurrent: false,
        description: 'Membangun dashboard admin dengan React + TypeScript. Kolaborasi tim 5 orang.',
      },
    ],
    educations: [
      {
        schoolName: 'SMK Telkom Malang',
        major: 'Rekayasa Perangkat Lunak',
        degree: 'SMK',
        startYear: 2022,
        endYear: 2025,
        gpa: 3.85,
      },
    ],
    certificates: [
      {
        title: 'Junior Web Developer',
        certificateNumber: 'BNSP-2024-001',
        badgeType: 'lsp_bnsp' as const,
        verificationStatus: 'verified' as const,
        issuedDate: new Date('2024-12-10'),
      },
      {
        title: 'React Fundamentals',
        certificateNumber: 'DICODING-2024-002',
        badgeType: 'industry' as const,
        verificationStatus: 'verified' as const,
        issuedDate: new Date('2024-08-15'),
      },
    ],
  },
  {
    email: 'siti.nurhaliza@demo.vocaz.id',
    fullName: 'Siti Nurhaliza',
    phone: '+62 812-1111-0002',
    headline: 'UI/UX Designer & Frontend Dev',
    bio: 'Desainer yang bisa coding. Fokus di design system & user experience.',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    gender: 'female' as const,
    isOpenToWork: true,
    skills: [
      { name: 'Figma', proficiency: 'expert' as const },
      { name: 'UI/UX Design', proficiency: 'advanced' as const },
      { name: 'React', proficiency: 'intermediate' as const },
      { name: 'HTML', proficiency: 'advanced' as const },
      { name: 'CSS', proficiency: 'advanced' as const },
      { name: 'Tailwind CSS', proficiency: 'intermediate' as const },
      { name: 'Design System', proficiency: 'advanced' as const },
    ],
    experiences: [
      {
        title: 'UI/UX Designer Freelance',
        companyName: 'Freelance',
        employmentType: 'freelance' as const,
        location: 'Remote',
        startDate: new Date('2024-03-01'),
        endDate: null,
        isCurrent: true,
        description: 'Mendesain 15+ landing page & mobile app untuk klien UMKM.',
      },
    ],
    educations: [
      {
        schoolName: 'SMKN 4 Surakarta',
        major: 'Desain Komunikasi Visual',
        degree: 'SMK',
        startYear: 2022,
        endYear: 2025,
        gpa: 3.92,
      },
    ],
    certificates: [
      {
        title: 'UI/UX Design Professional',
        certificateNumber: 'BNSP-2024-010',
        badgeType: 'lsp_bnsp' as const,
        verificationStatus: 'verified' as const,
        issuedDate: new Date('2024-11-20'),
      },
    ],
  },
  {
    email: 'dimas.raditya@demo.vocaz.id',
    fullName: 'Dimas Raditya',
    phone: '+62 812-1111-0003',
    headline: 'Backend Developer | Go & Node.js',
    bio: 'Suka bikin API & microservices. Aktif di komunitas Go Jakarta.',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    gender: 'male' as const,
    isOpenToWork: true,
    skills: [
      { name: 'Go', proficiency: 'advanced' as const },
      { name: 'Node.js', proficiency: 'advanced' as const },
      { name: 'PostgreSQL', proficiency: 'intermediate' as const },
      { name: 'Redis', proficiency: 'intermediate' as const },
      { name: 'Docker', proficiency: 'intermediate' as const },
      { name: 'Linux', proficiency: 'advanced' as const },
      { name: 'REST API', proficiency: 'advanced' as const },
    ],
    experiences: [
      {
        title: 'Backend Developer Intern',
        companyName: 'PT Digital Solusi Indonesia',
        employmentType: 'internship' as const,
        location: 'Jakarta',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-12-31'),
        isCurrent: false,
        description: 'Membangun microservices dengan Go + PostgreSQL untuk sistem e-commerce.',
      },
    ],
    educations: [
      {
        schoolName: 'SMK Mitra Industri MM2100',
        major: 'Rekayasa Perangkat Lunak',
        degree: 'SMK',
        startYear: 2022,
        endYear: 2025,
        gpa: 3.78,
      },
    ],
    certificates: [
      {
        title: 'Backend Developer',
        certificateNumber: 'BNSP-2024-020',
        badgeType: 'lsp_bnsp' as const,
        verificationStatus: 'verified' as const,
        issuedDate: new Date('2024-10-15'),
      },
      {
        title: 'AWS Cloud Practitioner',
        certificateNumber: 'AWS-2024-003',
        badgeType: 'industry' as const,
        verificationStatus: 'verified' as const,
        issuedDate: new Date('2024-09-01'),
      },
    ],
  },
  {
    email: 'anisa.rahma@demo.vocaz.id',
    fullName: 'Anisa Rahma',
    phone: '+62 812-1111-0004',
    headline: 'Mobile Developer | Flutter',
    bio: 'Suka mobile dev. Punya 5+ aplikasi published di Play Store.',
    city: 'Bandung',
    province: 'Jawa Barat',
    gender: 'female' as const,
    isOpenToWork: true,
    skills: [
      { name: 'Flutter', proficiency: 'advanced' as const },
      { name: 'React Native', proficiency: 'intermediate' as const },
      { name: 'Kotlin', proficiency: 'intermediate' as const },
      { name: 'Android Development', proficiency: 'advanced' as const },
      { name: 'REST API', proficiency: 'intermediate' as const },
      { name: 'Firebase', proficiency: 'advanced' as const },
    ],
    experiences: [
      {
        title: 'Mobile Developer',
        companyName: 'PT Mobile Kreatif',
        employmentType: 'freelance' as const,
        location: 'Remote',
        startDate: new Date('2024-04-01'),
        endDate: null,
        isCurrent: true,
        description: 'Mengembangkan 5 aplikasi Flutter untuk klien lokal.',
      },
    ],
    educations: [
      {
        schoolName: 'SMK Negeri 2 Bandung',
        major: 'Rekayasa Perangkat Lunak',
        degree: 'SMK',
        startYear: 2022,
        endYear: 2025,
        gpa: 3.88,
      },
    ],
    certificates: [
      {
        title: 'Mobile Developer Professional',
        certificateNumber: 'BNSP-2024-030',
        badgeType: 'lsp_bnsp' as const,
        verificationStatus: 'verified' as const,
        issuedDate: new Date('2024-09-20'),
      },
    ],
  },
  {
    email: 'fajar.nugraha@demo.vocaz.id',
    fullName: 'Fajar Nugraha',
    phone: '+62 812-1111-0005',
    headline: '3D Artist & Game Developer',
    bio: 'Fokus di 3D modeling & game asset. Unreal Engine enthusiast.',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    gender: 'male' as const,
    isOpenToWork: true,
    skills: [
      { name: 'Blender 3D', proficiency: 'advanced' as const },
      { name: 'Unreal Engine 5', proficiency: 'intermediate' as const },
      { name: 'Unity', proficiency: 'intermediate' as const },
      { name: 'Photoshop', proficiency: 'advanced' as const },
      { name: '3D Modeling', proficiency: 'advanced' as const },
    ],
    experiences: [
      {
        title: '3D Artist Freelance',
        companyName: 'Freelance',
        employmentType: 'freelance' as const,
        location: 'Remote',
        startDate: new Date('2023-10-01'),
        endDate: null,
        isCurrent: true,
        description: 'Membuat 30+ game asset untuk indie game developer.',
      },
    ],
    educations: [
      {
        schoolName: 'SMKN 4 Surakarta',
        major: 'Desain Komunikasi Visual',
        degree: 'SMK',
        startYear: 2022,
        endYear: 2025,
        gpa: 3.70,
      },
    ],
    certificates: [],
  },
  {
    email: 'rizky.ramadhan@demo.vocaz.id',
    fullName: 'Rizky Ramadhan',
    phone: '+62 812-1111-0006',
    headline: 'EV Conversion Specialist',
    bio: 'Suka otomotif & teknologi EV. Juara LKS tingkat provinsi.',
    city: 'Magelang',
    province: 'Jawa Tengah',
    gender: 'male' as const,
    isOpenToWork: true,
    skills: [
      { name: 'PLC', proficiency: 'advanced' as const },
      { name: 'AutoCAD', proficiency: 'intermediate' as const },
      { name: 'IoT', proficiency: 'intermediate' as const },
      { name: 'Arduino', proficiency: 'advanced' as const },
    ],
    experiences: [
      {
        title: 'Teknisi EV Magang',
        companyName: 'PT Konversi EV Nusantara',
        employmentType: 'internship' as const,
        location: 'Yogyakarta',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-09-30'),
        isCurrent: false,
        description: 'Konversi motor bensin ke listrik untuk 12 unit.',
      },
    ],
    educations: [
      {
        schoolName: 'SMK Negeri 1 Magelang',
        major: 'Teknik Kendaraan Ringan Otomotif',
        degree: 'SMK',
        startYear: 2022,
        endYear: 2025,
        gpa: 3.65,
      },
    ],
    certificates: [
      {
        title: 'Teknisi Konversi EV',
        certificateNumber: 'BNSP-2024-040',
        badgeType: 'lsp_bnsp' as const,
        verificationStatus: 'verified' as const,
        issuedDate: new Date('2024-08-10'),
      },
    ],
  },
]

// ============================================
// MAIN SEED
// ============================================

async function main() {
  console.log('🌱 Seeding applicants for demo...\n')

  // 1. Get available jobs
  const jobs = await prisma.job.findMany({
    where: { status: 'active', deletedAt: null },
    select: {
      id: true,
      title: true,
      slug: true,
      companyId: true,
      company: { select: { name: true } },
    },
    take: 10,
  })

  if (jobs.length === 0) {
    console.error('❌ Tidak ada job aktif. Jalankan `npx prisma db seed` dulu.')
    return
  }

  console.log(`📋 Found ${jobs.length} active jobs\n`)

  // 2. Seed each student
  for (const student of students) {
    console.log(`👤 ${student.fullName}`)

    // 2a. Create user
    const user = await prisma.user.upsert({
      where: { email: student.email },
      update: {
        fullName: student.fullName,
        phone: student.phone,
        avatarUrl: null,
      },
      create: {
        neonAuthUserId: fakeNeonAuthId(student.email),
        email: student.email,
        role: 'student',
        fullName: student.fullName,
        phone: student.phone,
      },
      select: { id: true },
    })

    // 2b. Create/update student profile
    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        headline: student.headline,
        bio: student.bio,
        city: student.city,
        province: student.province,
        gender: student.gender,
        isOpenToWork: student.isOpenToWork,
        isPublic: true,
        profileCompletion: 85,
        careerReadiness: 75,
      },
      create: {
        userId: user.id,
        headline: student.headline,
        bio: student.bio,
        city: student.city,
        province: student.province,
        gender: student.gender,
        isOpenToWork: student.isOpenToWork,
        isPublic: true,
        profileCompletion: 85,
        careerReadiness: 75,
      },
      select: { id: true },
    })

    // 2c. Delete old skills & re-add
    await prisma.studentSkill.deleteMany({
      where: { studentId: profile.id },
    })

    for (const skill of student.skills) {
      const skillRecord = await prisma.skill.upsert({
        where: { name: skill.name },
        update: {},
        create: { name: skill.name, category: 'Umum' },
      })
      await prisma.studentSkill.create({
        data: {
          studentId: profile.id,
          skillId: skillRecord.id,
          proficiency: skill.proficiency,
        },
      })
    }
    console.log(`   ✓ ${student.skills.length} skills`)

    // 2d. Delete old experiences & re-add
    await prisma.studentExperience.deleteMany({
      where: { studentId: profile.id },
    })
    for (const exp of student.experiences) {
      await prisma.studentExperience.create({
        data: {
          studentId: profile.id,
          title: exp.title,
          companyName: exp.companyName,
          employmentType: exp.employmentType,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate,
          isCurrent: exp.isCurrent,
          description: exp.description,
        },
      })
    }
    console.log(`   ✓ ${student.experiences.length} experiences`)

    // 2e. Delete old educations & re-add
    await prisma.studentEducation.deleteMany({
      where: { studentId: profile.id },
    })
    for (const edu of student.educations) {
      await prisma.studentEducation.create({
        data: {
          studentId: profile.id,
          schoolName: edu.schoolName,
          major: edu.major,
          degree: edu.degree,
          startYear: edu.startYear,
          endYear: edu.endYear,
          gpa: edu.gpa,
        },
      })
    }
    console.log(`   ✓ ${student.educations.length} educations`)

    // 2f. Delete old certificates & re-add
    await prisma.certificate.deleteMany({
      where: { studentId: profile.id },
    })
    for (const cert of student.certificates) {
      await prisma.certificate.create({
        data: {
          studentId: profile.id,
          title: cert.title,
          certificateNumber: cert.certificateNumber,
          badgeType: cert.badgeType,
          verificationStatus: cert.verificationStatus,
          issuedDate: cert.issuedDate,
          verifiedAt: cert.verificationStatus === 'verified' ? new Date() : null,
        },
      })
    }
    console.log(`   ✓ ${student.certificates.length} certificates`)

    // 2g. Apply to 2-3 jobs (random)
    const jobsToApply = jobs
      .filter((_, idx) => {
        // Apply ke job yang match kategori
        const jobTitle = jobs[idx]?.title.toLowerCase() ?? ''
        const skillMatch =
          student.skills.some((s) =>
            jobTitle.includes(s.name.toLowerCase().slice(0, 4))
          ) ||
          jobTitle.includes('developer') ||
          jobTitle.includes('designer') ||
          jobTitle.includes('engineer')

        return skillMatch
      })
      .slice(0, 3)

    if (jobsToApply.length === 0) {
      // Fallback: apply ke 2 job random
      jobsToApply.push(...jobs.slice(0, 2))
    }

    for (const job of jobsToApply) {
      // Check if already applied
      const existing = await prisma.application.findUnique({
        where: {
          jobId_studentId: { jobId: job.id, studentId: profile.id },
        },
      })

      if (existing) continue

      const coverLetter = `Halo, saya ${student.fullName}, ${student.headline}. Saya tertarik dengan posisi ${job.title} di ${job.company.name}. ${student.bio}`

      const application = await prisma.application.create({
        data: {
          jobId: job.id,
          studentId: profile.id,
          coverLetter,
          status: 'submitted',
        },
        select: { id: true },
      })

      // Add history
      await prisma.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          status: 'submitted',
          notes: 'Lamaran dikirim',
          changedBy: user.id,
        },
      })

      // Hitung match score
      const score = await recalculateApplicationMatch(application.id)
      console.log(`   ✓ Apply "${job.title}" → ${score}% match`)
    }

    console.log('')
  }

  console.log('🎉 Seeding selesai!')
  console.log('')
  console.log('🔑 Untuk login sebagai student:')
  console.log('   - Login via Neon Auth dengan email di atas')
  console.log('   - Atau lihat pelamar di /company/jobs sebagai recruiter')
}

main()
  .catch((err) => {
    console.error('❌ Seed error:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })