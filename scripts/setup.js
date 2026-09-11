#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('\x1b[36m%s\x1b[0m', '🚀 [Memorize Supporter] Initializing environment...\n');

// 1. Check & copy .env
const envPath = path.join(ROOT_DIR, '.env');
const envExamplePath = path.join(ROOT_DIR, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📄 Creating .env from .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env created successfully.\n');
  } else {
    console.warn('⚠️ .env.example not found, creating default .env...');
    fs.writeFileSync(envPath, 'DATABASE_URL="file:../.data/memorize.sqlite"\n');
    console.log('✅ Default .env created.\n');
  }
} else {
  console.log('✅ .env already exists.\n');
}

// 2. Run Prisma DB Push
console.log('📦 Pushing database schema (Prisma)...');
try {
  execSync('npx prisma db push', { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log('✅ Database schema ready.\n');
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Failed to push database schema. Please check Prisma configuration.');
  process.exit(1);
}

// 3. Run ETL pipeline
console.log('🔄 Running initial ETL to sync decks...');
try {
  execSync('npm run etl', { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log('✅ ETL completed.\n');
} catch (error) {
  console.warn('⚠️ ETL completed with warnings or no input files found.\n');
}

console.log('\x1b[32m%s\x1b[0m', '🎉 Setup completed successfully!');
console.log('\x1b[36m%s\x1b[0m', 'Run "npm run dev" to start your learning application.\n');
