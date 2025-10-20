/**
 * Reset Firestore Layout Script
 * Deletes the existing homepage layout document so it can be reinitialized
 * with the correct component fields.
 * 
 * Run this with: node scripts/reset-layout.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccountPath = path.join(__dirname, '..', 'serviceAccount.json');
  
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Error loading service account:', error.message);
    console.log('\nPlease ensure serviceAccount.json exists in the project root.');
    process.exit(1);
  }
}

const db = admin.firestore();

async function resetLayout() {
  try {
    console.log('🔄 Deleting existing layout document...');
    await db.collection('layouts').doc('homepage').delete();
    console.log('✅ Layout document deleted successfully!');
    console.log('\n🎯 Next steps:');
    console.log('1. Visit http://localhost:3000/studio');
    console.log('2. Sign in with your admin credentials');
    console.log('3. The layout will auto-initialize with component fields');
    console.log('4. Visit /studio-preview to see your sections rendered');
  } catch (error) {
    console.error('❌ Error deleting layout:', error);
    process.exit(1);
  }
}

resetLayout();
