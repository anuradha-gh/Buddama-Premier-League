/**
 * Migration Script: Update Team Logos
 * 
 * This script updates all team documents in Firestore to add logo field
 * with paths to team logo images in /public/teams/
 * 
 * Run this once to fix missing team logos in points table
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Team name to logo filename mapping
const teamLogoMap: Record<string, string> = {
    "BUDDAMA CHALLENGERS": "/teams/buddama-challengers.png",
    "BUDDAMA ROYALS": "/teams/buddama-royals.png",
    "BUDDAMA CAPITALS": "/teams/buddama-capitals.png",
    "BUDDAMA FALCONS": "/teams/buddama-falcons.png",
    "BUDDAMA TITANS": "/teams/buddama-titans.png",
    "BUDDAMA KINGS": "/teams/buddama-kings.png",
};

async function updateTeamLogos() {
    try {
        console.log("🚀 Starting team logo migration...");

        const teamsSnapshot = await getDocs(collection(db, "teams"));

        let updated = 0;
        let skipped = 0;

        for (const teamDoc of teamsSnapshot.docs) {
            const teamData = teamDoc.data();
            const teamName = teamData.name;

            if (teamLogoMap[teamName]) {
                const logoPath = teamLogoMap[teamName];

                await updateDoc(doc(db, "teams", teamDoc.id), {
                    logo: logoPath
                });

                console.log(`✅ Updated ${teamName} → ${logoPath}`);
                updated++;
            } else {
                console.warn(`⚠️ No logo mapping found for: ${teamName}`);
                skipped++;
            }
        }

        console.log("\n📊 Migration Complete!");
        console.log(`   ✅ Updated: ${updated} teams`);
        console.log(`   ⚠️ Skipped: ${skipped} teams`);

    } catch (error) {
        console.error("❌ Migration failed:", error);
    }
}

// Run migration
updateTeamLogos();
