import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Match, Team } from "@/lib/types";
import { getAllTeams } from "@/lib/mockDb";

interface UseLiveMatchResult {
    match: Match | null;
    teamA: Team | null;
    teamB: Team | null;
    loading: boolean;
    error: string | null;
}

export function useLiveMatch(): UseLiveMatchResult {
    const [match, setMatch] = useState<Match | null>(null);
    const [teamA, setTeamA] = useState<Team | null>(null);
    const [teamB, setTeamB] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If Firebase is not initialized, we might want to fallback or just return error
        if (!db) {
            console.warn("Firebase DB not initialized. useLiveMatch will not function.");
            setLoading(false);
            setError("Database not connected");
            return;
        }

        setLoading(true);

        // 1. Listen for LIVE matches
        const matchesRef = collection(db, "matches");
        const liveQuery = query(matchesRef, where("status", "==", "Live"), limit(1));

        const unsubscribe = onSnapshot(liveQuery, async (snapshot) => {
            try {
                let foundMatch: Match | null = null;

                if (!snapshot.empty) {
                    // Found a LIVE match
                    const doc = snapshot.docs[0];
                    foundMatch = { id: doc.id, ...doc.data() } as Match;
                } else {
                    // No LIVE match, find nearest SCHEDULED match
                    // We use a separate fetch here to avoid complex nested listeners if possible, 
                    // or we could set up another listener. For "Scheduled", a one-time fetch or separate listener is fine.
                    // Let's try to fetch the next scheduled match.
                    const scheduledQuery = query(
                        matchesRef,
                        where("status", "==", "Scheduled"),
                        orderBy("date", "asc"),
                        limit(1)
                    );

                    const scheduledSnapshot = await getDocs(scheduledQuery);
                    if (!scheduledSnapshot.empty) {
                        const doc = scheduledSnapshot.docs[0];
                        foundMatch = { id: doc.id, ...doc.data() } as Match;
                    }
                }

                if (foundMatch) {
                    setMatch(foundMatch);

                    // Fetch Teams (using mockDb for now as requested/implied by current architecture)
                    // In a full real-time app, teams would also be in Firestore.
                    const allTeams = await getAllTeams();
                    const tA = allTeams.find(t => t.id === foundMatch?.teamAId) || null;
                    const tB = allTeams.find(t => t.id === foundMatch?.teamBId) || null;

                    setTeamA(tA);
                    setTeamB(tB);
                } else {
                    setMatch(null);
                }

                setLoading(false);

            } catch (err) {
                console.error("Error in useLiveMatch:", err);
                setError("Failed to fetch match data");
                setLoading(false);
            }
        }, (err) => {
            console.error("Snapshot error:", err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { match, teamA, teamB, loading, error };
}
