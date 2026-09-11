#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');

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
    console.log('📄 Creating default .env...');
    fs.writeFileSync(envPath, 'NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB="5"\n');
    console.log('✅ Default .env created.\n');
  }
} else {
  console.log('✅ .env already exists.\n');
}

console.log('\x1b[32m%s\x1b[0m', '🎉 Setup completed successfully! (100% Local-First Architecture)');
console.log('\x1b[36m%s\x1b[0m', 'Run "npm run dev" to start your learning application.\n');
