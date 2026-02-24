#!/usr/bin/env node

/**
 * AuraCarbon Setup Diagnostic
 * Verify all components are correctly configured
 */

const fs = require('fs')
const path = require('path')

const checks = []

// 1. Check .env.local exists
checks.push({
  name: '📋 .env.local exists',
  check: () => fs.existsSync(path.join(__dirname, '.env.local')),
  fix: 'Create .env.local with DATABASE_URL, OAuth keys, NEXTAUTH_SECRET',
})

// 2. Check package.json has all deps
checks.push({
  name: '📦 Dependencies installed',
  check: () => fs.existsSync(path.join(__dirname, 'node_modules')),
  fix: 'Run: npm install',
})

// 3. Check Prisma schema exists
checks.push({
  name: '🗄️ Prisma schema exists',
  check: () => fs.existsSync(path.join(__dirname, 'prisma', 'schema.prisma')),
  fix: 'Schema file is missing! (Should be prisma/schema.prisma)',
})

// 4. Check seed script exists
checks.push({
  name: '🌱 Seed script exists',
  check: () => fs.existsSync(path.join(__dirname, 'prisma', 'seed.ts')),
  fix: 'Seed file is missing! (Should be prisma/seed.ts)',
})

// 5. Check Carbon Engine exists
checks.push({
  name: '⚙️ Carbon Engine exists',
  check: () => fs.existsSync(path.join(__dirname, 'lib', 'carbon-engine.ts')),
  fix: 'Carbon Engine file is missing! (Should be lib/carbon-engine.ts)',
})

// 6. Check NextAuth config exists
checks.push({
  name: '🔐 NextAuth config exists',
  check: () => fs.existsSync(path.join(__dirname, 'lib', 'auth.config.ts')),
  fix: 'NextAuth config is missing! (Should be lib/auth.config.ts)',
})

// 7. Check API endpoints exist
const apiEndpoints = [
  'pages/api/materials/index.ts',
  'pages/api/grid-factors/index.ts',
  'pages/api/calculations/create.ts',
  'pages/api/calculations/records.ts',
  'pages/api/dashboard/stats.ts',
]

checks.push({
  name: '🔌 API endpoints exist',
  check: () => apiEndpoints.every((ep) => fs.existsSync(path.join(__dirname, ep))),
  fix: `Missing API endpoints. Should have: ${apiEndpoints.join(', ')}`,
})

// 8. Check env vars
checks.push({
  name: '🔑 Environment variables set',
  check: () => {
    if (!fs.existsSync(path.join(__dirname, '.env.local'))) return false
    const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8')
    const requiredVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'GOOGLE_CLIENT_ID',
      'GITHUB_CLIENT_ID',
    ]
    return requiredVars.every((v) => env.includes(v))
  },
  fix: 'Missing required env vars in .env.local',
})

// Run checks
console.log('\n🔧 AuraCarbon Setup Diagnostic\n')
console.log('=' .repeat(50))

let passed = 0
let failed = 0

checks.forEach(({ name, check, fix }) => {
  const result = check()
  if (result) {
    console.log(`✅ ${name}`)
    passed++
  } else {
    console.log(`❌ ${name}`)
    console.log(`   → Fix: ${fix}`)
    failed++
  }
})

console.log('=' .repeat(50))
console.log(`\nResults: ${passed} passed, ${failed} failed\n`)

if (failed === 0) {
  console.log('🎉 All checks passed! Ready to run:')
  console.log('  npm run db:push   (push schema to Supabase)')
  console.log('  npm run db:seed   (seed 50 materials + 150 countries)')
  console.log('  npm run dev       (start dev server)\n')
  process.exit(0)
} else {
  console.log('⚠️  Please fix the issues above before proceeding.\n')
  process.exit(1)
}
