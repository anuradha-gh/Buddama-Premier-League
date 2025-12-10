import { db } from "@/lib/firebase";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, setDoc, query, where } from "firebase/firestore";
import { Player } from "@/lib/types";

// Players Service
export async function getPlayersByTeamId(teamId: string): Promise<Player[]> {
    if (!db) return [];
    try {
        const playersRef = collection(db, "players");
        const q = query(playersRef, where("teamId", "==", teamId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
}

export async function getAllPlayers(): Promise<Player[]> {
    if (!db) return [];
    try {
        const snapshot = await getDocs(collection(db, "players"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
    } catch (error) {
        console.error("Error fetching all players:", error);
        return [];
    }
}

export async function getPlayerById(playerId: string): Promise<Player | null> {
    if (!db) return null;
    try {
        const { getDoc } = await import("firebase/firestore");
        const docSnap = await getDoc(doc(db, "players", playerId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Player;
        }
        return null;
    } catch (error) {
        console.error("Error fetching player:", error);
        return null;
    }
}

export async function createPlayer(playerData: Omit<Player, "id">): Promise<Player | null> {
    if (!db) return null;
    try {
        const newPlayerRef = doc(collection(db, "players"));
        const newPlayer: Player = {
            ...playerData,
            id: newPlayerRef.id,
        };
        await setDoc(newPlayerRef, newPlayer);
        return newPlayer;
    } catch (error) {
        console.error("Error creating player:", error);
        return null;
    }
}

export async function updatePlayer(playerId: string, updates: Partial<Player>): Promise<Player | null> {
    if (!db) return null;
    try {
        const playerDocRef = doc(db, "players", playerId);
        await updateDoc(playerDocRef, updates);
        return { id: playerId, ...updates } as Player;
    } catch (error) {
        console.error("Error updating player:", error);
        return null;
    }
}

export async function deletePlayer(playerId: string): Promise<boolean> {
    if (!db) return false;
    try {
        await deleteDoc(doc(db, "players", playerId));
        return true;
    } catch (error) {
        console.error("Error deleting player:", error);
        return false;
    }
}
