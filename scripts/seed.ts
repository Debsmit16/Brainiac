// Legacy Firebase seeding script - replaced by Supabase database-setup.sql
// Run with: npx tsx scripts/seed.ts

console.log('This script is deprecated. Use the Supabase SQL script instead:');
console.log('Execute the database-setup.sql file in your Supabase dashboard');

async function main() {
  console.log('🌱 Data seeding is now handled by database-setup.sql');
  console.log('✅ Please run the SQL script in your Supabase dashboard');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});