// test-action.ts
import 'dotenv/config'

async function main() {
  console.log('=== TEST TOGGLE JOB ===\n')

  // Import dari actions.ts
  console.log('1. Import actions...')
  const actions = await import('./lib/student/actions')
  console.log('   Exported keys:', Object.keys(actions).join(', '))

  const { toggleSaveJob, getSavedJobIds } = actions

  if (typeof toggleSaveJob !== 'function') {
    console.log('❌ toggleSaveJob BUKAN function! Type:', typeof toggleSaveJob)
    return
  }
  console.log('   ✓ toggleSaveJob is function')

  // Cari job
  const { prisma } = await import('./lib/prisma')
  const job = await prisma.job.findFirst({ select: { id: true, title: true } })
  if (!job) {
    console.log('❌ No job')
    return
  }
  console.log('\n2. Target job:', job.title)
  console.log('   Job ID:', job.id)

  // Panggil
  console.log('\n3. Call toggleSaveJob...')
  const result = await toggleSaveJob(job.id)
  console.log('   Result:', JSON.stringify(result, null, 2))

  // Cek DB
  console.log('\n4. Cek DB...')
  const count = await prisma.savedJob.count()
  console.log('   Total saved jobs:', count)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    const { prisma } = await import('./lib/prisma')
    await prisma.$disconnect()
  })