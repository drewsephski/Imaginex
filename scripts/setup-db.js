require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function setupDatabase() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Not found');
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Try to create a simple query to test if tables exist
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Tables exist. Found ${userCount} users.`);
    } catch (error) {
      if (error.code === 'P2021') {
        console.log('❌ Tables do not exist. Need to run migrations.');
        console.log('Please run: npx prisma db push');
      } else {
        console.error('❌ Database error:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your DATABASE_URL in .env.local');
    console.log('2. Make sure your database is running');
    console.log('3. Verify your database credentials');
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();