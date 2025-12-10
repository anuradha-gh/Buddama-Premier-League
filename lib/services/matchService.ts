import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc, deleteDoc, orderBy, setDoc, getDoc } from "firebase/firestore";
import { Match } from "@/lib/types";

// Collection Reference
const matchesRef = () => collection(db, "matches");

export async function addCommentary(matchId: string, text: string) {
    if (!db) {
        console.warn("Firestore not initialized. Cannot add commentary.");
        return;
    }
    try {
        await addDoc(collection(db, "matches", matchId, "commentary"), {
            text,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding commentary:", error);
    }
}

export async function getMatchesBySeason(seasonId: string): Promise<Match[]> {
    if (!db) return [];
    try {
        const q = query(
            matchesRef(),
            where("seasonId", "==", seasonId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
    } catch (error) {
        console.error("Error fetching matches:", error);
        return [];
    }
}

export async function getAllMatches(): Promise<Match[]> {
    if (!db) return [];
    try {
        const snapshot = await getDocs(matchesRef());
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
    } catch (error) {
        console.error("Error fetching all matches:", error);
        return [];
    }
}

export async function getMatchById(matchId: string): Promise<Match | null> {
    if (!db) return null;
    try {
        const docSnap = await getDoc(doc(db, "matches", matchId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Match;
        }
        return null;
    } catch (error) {
        console.error("Error fetching match:", error);
        return null;
    }
}

export async function createMatch(matchData: Omit<Match, "id">): Promise<Match | null> {
    if (!db) return null;
    try {
        // Create a new document reference with an auto-generated ID
        const newMatchRef = doc(matchesRef());
        const newMatch: Match = {
            ...matchData,
            id: newMatchRef.id,
        };
        await setDoc(newMatchRef, newMatch);
        return newMatch;
    } catch (error) {
        console.error("Error creating match:", error);
        return null;
    }
}

export async function updateMatch(matchId: string, updates: Partial<Match>): Promise<Match | null> {
    if (!db) return null;
    try {
        const matchDocRef = doc(db, "matches", matchId);
        await updateDoc(matchDocRef, updates);
        return { id: matchId, ...updates } as Match; // Return partial for UI update or fetch fresh
    } catch (error) {
        console.error("Error updating match:", error);
        return null;
    }
}

export async function deleteMatch(matchId: string): Promise<boolean> {
    if (!db) return false;
    try {
        await deleteDoc(doc(db, "matches", matchId));
        return true;
    } catch (error) {
        console.error("Error deleting match:", error);
        return false;
    }
}
