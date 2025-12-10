import { db } from "@/lib/firebase";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { Team, Season } from "@/lib/types";

// Teams Service
export async function getAllTeams(): Promise<Team[]> {
    if (!db) return [];
    try {
        const snapshot = await getDocs(collection(db, "teams"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
    } catch (error) {
        console.error("Error fetching teams:", error);
        return [];
    }
}

export async function getTeamById(teamId: string): Promise<Team | null> {
    if (!db) return null;
    try {
        const { getDoc } = await import("firebase/firestore");
        const docSnap = await getDoc(doc(db, "teams", teamId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Team;
        }
        return null;
    } catch (error) {
        console.error("Error fetching team:", error);
        return null;
    }
}

export async function createTeam(teamData: Omit<Team, "id">): Promise<Team | null> {
    if (!db) return null;
    try {
        const newTeamRef = doc(collection(db, "teams"));
        const newTeam: Team = {
            ...teamData,
            id: newTeamRef.id,
        };
        await setDoc(newTeamRef, newTeam);
        return newTeam;
    } catch (error) {
        console.error("Error creating team:", error);
        return null;
    }
}

export async function updateTeam(teamId: string, updates: Partial<Team>): Promise<Team | null> {
    if (!db) return null;
    try {
        const teamDocRef = doc(db, "teams", teamId);
        await updateDoc(teamDocRef, updates);
        return { id: teamId, ...updates } as Team;
    } catch (error) {
        console.error("Error updating team:", error);
        return null;
    }
}

export async function deleteTeam(teamId: string): Promise<boolean> {
    if (!db) return false;
    try {
        await deleteDoc(doc(db, "teams", teamId));
        return true;
    } catch (error) {
        console.error("Error deleting team:", error);
        return false;
    }
}

// Seasons Service
export async function getAllSeasons(): Promise<Season[]> {
    if (!db) return [];
    try {
        const snapshot = await getDocs(collection(db, "seasons"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Season));
    } catch (error) {
        console.error("Error fetching seasons:", error);
        return [];
    }
}

export async function getSeasonById(seasonId: string): Promise<Season | null> {
    if (!db) return null;
    try {
        const { getDoc } = await import("firebase/firestore");
        const docSnap = await getDoc(doc(db, "seasons", seasonId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Season;
        }
        return null;
    } catch (error) {
        console.error("Error fetching season:", error);
        return null;
    }
}

export async function createSeason(seasonData: Omit<Season, "id">): Promise<Season | null> {
    if (!db) return null;
    try {
        const newSeasonRef = doc(collection(db, "seasons"));
        const newSeason: Season = {
            ...seasonData,
            id: newSeasonRef.id,
        };
        await setDoc(newSeasonRef, newSeason);
        return newSeason;
    } catch (error) {
        console.error("Error creating season:", error);
        return null;
    }
}

export async function updateSeason(seasonId: string, updates: Partial<Season>): Promise<Season | null> {
    if (!db) return null;
    try {
        const seasonDocRef = doc(db, "seasons", seasonId);
        await updateDoc(seasonDocRef, updates);
        return { id: seasonId, ...updates } as Season;
    } catch (error) {
        console.error("Error updating season:", error);
        return null;
    }
}

export async function deleteSeason(seasonId: string): Promise<boolean> {
    if (!db) return false;
    try {
        await deleteDoc(doc(db, "seasons", seasonId));
        return true;
    } catch (error) {
        console.error("Error deleting season:", error);
        return false;
    }
}
