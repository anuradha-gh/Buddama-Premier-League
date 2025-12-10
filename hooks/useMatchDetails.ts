import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Match, MatchState, Team, Player } from "@/lib/types";
import { getAllTeams, getAllPlayers } from "@/lib/mockDb";

interface UseMatchDetailsResult {
    match: Match | null;
    matchState: MatchState | null;
    teamA: Team | null;
    teamB: Team | null;
    players: Player[];
    loading: boolean;
    error: string | null;
}

export function useMatchDetails(matchId: string): UseMatchDetailsResult {
    const [match, setMatch] = useState<Match | null>(null);
    const [matchState, setMatchState] = useState<MatchState | null>(null);
    const [teamA, setTeamA] = useState<Team | null>(null);
    const [teamB, setTeamB] = useState<Team | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!db || !matchId) {
            setLoading(false);
            return;
        }

        setLoading(true);

        // 1. Listen for Match Document
        const matchRef = doc(db, "matches", matchId);
        const unsubscribeMatch = onSnapshot(matchRef, async (docSnap) => {
            try {
                if (docSnap.exists()) {
                    const matchData = { id: docSnap.id, ...docSnap.data() } as Match;
                    setMatch(matchData);

                    // Fetch static data (Teams & Players) if not already fetched
                    // In a real app, we might want to cache this or fetch it once.
                    // For now, fetching on every match update is okay but slightly inefficient.
                    // Better to fetch only if teams changed or first load.
                    if (!teamA || !teamB) {
                        const allTeams = await getAllTeams();
                        const tA = allTeams.find(t => t.id === matchData.teamAId) || null;
                        const tB = allTeams.find(t => t.id === matchData.teamBId) || null;
                        setTeamA(tA);
                        setTeamB(tB);

                        const allPlayers = await getAllPlayers();
                        setPlayers(allPlayers);
                    }
                } else {
                    setError("Match not found");
                    setMatch(null);
                }
            } catch (err) {
                console.error("Error fetching match:", err);
                setError("Failed to fetch match");
            }
        }, (err) => {
            console.error("Match listener error:", err);
            setError(err.message);
        });

        // 2. Listen for Match State Document (for detailed live scoring)
        // Assuming collection is 'match_states' and docId is matchId
        const matchStateRef = doc(db, "match_states", matchId);
        const unsubscribeMatchState = onSnapshot(matchStateRef, (docSnap) => {
            if (docSnap.exists()) {
                setMatchState(docSnap.data() as MatchState);
            } else {
                setMatchState(null);
            }
            setLoading(false);
        }, (err) => {
            console.error("MatchState listener error:", err);
            // Don't set main error here, as match state might just not exist yet
            setLoading(false);
        });

        return () => {
            unsubscribeMatch();
            unsubscribeMatchState();
        };
    }, [matchId]);

    return { match, matchState, teamA, teamB, players, loading, error };
}
