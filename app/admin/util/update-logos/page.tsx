"use client";

import { useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Team name to logo filename mapping
const teamLogoMap: Record<string, string> = {
    "BUDDAMA CHALLENGERS": "/teams/buddama-challengers.png",
    "BUDDAMA ROYALS": "/teams/buddama-royals.png",
    "BUDDAMA CAPITALS": "/teams/buddama-capitals.png",
    "BUDDAMA FALCONS": "/teams/buddama-falcons.png",
    "BUDDAMA TITANS": "/teams/buddama-titans.png",
    "BUDDAMA KINGS": "/teams/buddama-kings.png",
};

export default function UpdateTeamLogosPage() {
    const [status, setStatus] = useState<string[]>([]);
    const [updating, setUpdating] = useState(false);

    const updateTeamLogos = async () => {
        setUpdating(true);
        setStatus(["🚀 Starting team logo update..."]);

        try {
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

                    setStatus(prev => [...prev, `✅ Updated ${teamName} → ${logoPath}`]);
                    updated++;
                } else {
                    setStatus(prev => [...prev, `⚠️ No logo mapping found for: ${teamName}`]);
                    skipped++;
                }
            }

            setStatus(prev => [
                ...prev,
                "",
                "📊 Update Complete!",
                `   ✅ Updated: ${updated} teams`,
                `   ⚠️ Skipped: ${skipped} teams`
            ]);

        } catch (error) {
            console.error("Error updating team logos:", error);
            setStatus(prev => [...prev, `❌ Error: ${error}`]);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">Update Team Logos</h1>
                <p className="text-gray-400 mb-8">
                    This utility will update all team documents in Firestore to add the logo field
                    with correct paths to team logo images.
                </p>

                <button
                    onClick={updateTeamLogos}
                    disabled={updating}
                    className="px-6 py-3 bg-primary hover:bg-primary/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold transition-colors"
                >
                    {updating ? "Updating..." : "Update All Team Logos"}
                </button>

                {status.length > 0 && (
                    <div className="mt-8 p-4 bg-slate-900 rounded-lg border border-white/10">
                        <h2 className="text-xl font-bold mb-4">Status Log:</h2>
                        <div className="font-mono text-sm space-y-1">
                            {status.map((line, index) => (
                                <div key={index}>{line}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
