/**
 * Admin Credentials Reset Script
 * 
 * Run this once to reset admin credentials to default values.
 * This will overwrite any existing credentials.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your Firebase config (from .env or paste directly)
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Simple hash function (same as authService.ts)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function resetAdminCredentials() {
    try {
        console.log('🔄 Resetting admin credentials...');

        const username = 'admin';
        const password = 'BPL@buddama2025';
        const hashedPassword = await hashPassword(password);

        const adminRef = doc(db, 'admin', 'credentials');
        await setDoc(adminRef, {
            username: username,
            passwordHash: hashedPassword,
            failedAttempts: 0,
            lockoutUntil: null,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        });

        console.log('✅ Admin credentials reset successfully!');
        console.log('');
        console.log('🔑 Login with:');
        console.log('   Username: admin');
        console.log('   Password: BPL@buddama2025');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting credentials:', error);
        process.exit(1);
    }
}

resetAdminCredentials();
