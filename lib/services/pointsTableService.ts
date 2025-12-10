import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, query, where, orderBy } from "firebase/firestore";

export interface PointsTableEntry {
    id: string;
    seasonId: string;
    teamId: string;
    teamName: string;
    played: number;
    won: number;
    lost: number;
    tied: number;
    noResult: number;
    points: number;
    nrr: number;
    position: number;
}

// Get points table for a season
export async function getPointsTableBySeason(seasonId: string): Promise<PointsTableEntry[]> {
    if (!db) return [];
    try {
        const q = query(
            collection(db, "points_table"),
            where("seasonId", "==", seasonId),
            orderBy("position", "asc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PointsTableEntry));
    } catch (error) {
        console.error("Error fetching points table:", error);
        return [];
    }
}

// Update a points table entry
export async function updatePointsTableEntry(
    entryId: string,
    updates: Partial<PointsTableEntry>
): Promise<boolean> {
    if (!db) return false;
    try {
        await setDoc(doc(db, "points_table", entryId), updates, { merge: true });
        return true;
    } catch (error) {
        console.error("Error updating points table entry:", error);
        return false;
    }
}

// Initialize points table for a season (creates entries for all teams)
export async function initializePointsTable(
    seasonId: string,
    teams: { id: string; name: string }[]
): Promise<boolean> {
    if (!db) return false;
    try {
        const batch: Promise<void>[] = [];

        teams.forEach((team, index) => {
            const entryId = `${seasonId}_${team.id}`;
            const entry: PointsTableEntry = {
                id: entryId,
                seasonId,
                teamId: team.id,
                teamName: team.name,
                played: 0,
                won: 0,
                lost: 0,
                tied: 0,
                noResult: 0,
                points: 0,
                nrr: 0,
                position: index + 1
            };

            batch.push(setDoc(doc(db, "points_table", entryId), entry));
        });

        await Promise.all(batch);
        return true;
    } catch (error) {
        console.error("Error initializing points table:", error);
        return false;
    }
}
