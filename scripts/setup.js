#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up ImagineX...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local from .env.example...');
  const envExample = fs.readFileSync(path.join(process.cwd(), '.env.example'), 'utf8');
  fs.writeFileSync(envPath, envExample);
  console.log('✅ .env.local created\n');
} else {
  console.log('✅ .env.local already exists\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Generate Prisma client
console.log('🗄️ Setting up database...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');
} catch (error) {
  console.log('⚠️ Prisma generation failed - make sure to set up your database URL\n');
}

console.log('🎉 Setup complete!\n');
console.log('Next steps:');
console.log('1. Update your .env.local file with your API keys');
console.log('2. Set up your database and run: npx prisma db push');
console.log('3. Run: npm run dev');
console.log('\nFor detailed setup instructions, see README.md');