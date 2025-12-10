import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ADMIN_COLLECTION = "admin";
const ADMIN_DOC_ID = "credentials";

// Simple hash function (for demo - in production use bcrypt)
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function initializeAdminPassword() {
    try {
        const adminRef = doc(db, ADMIN_COLLECTION, ADMIN_DOC_ID);
        const adminDoc = await getDoc(adminRef);

        if (!adminDoc.exists()) {
            // Set initial password: BPL@buddama2025
            const hashedPassword = await hashPassword("BPL@buddama2025");
            await setDoc(adminRef, {
                passwordHash: hashedPassword,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            });
            console.log("Admin password initialized");
        }
    } catch (error) {
        console.error("Error initializing admin password:", error);
    }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
    try {
        const adminRef = doc(db, ADMIN_COLLECTION, ADMIN_DOC_ID);
        const adminDoc = await getDoc(adminRef);

        if (!adminDoc.exists()) {
            await initializeAdminPassword();
            return verifyAdminPassword(password);
        }

        const hashedPassword = await hashPassword(password);
        const storedHash = adminDoc.data().passwordHash;

        return hashedPassword === storedHash;
    } catch (error) {
        console.error("Error verifying password:", error);
        return false;
    }
}

export async function updateAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
        // Verify current password
        const isValid = await verifyAdminPassword(currentPassword);
        if (!isValid) {
            return { success: false, message: "Current password is incorrect" };
        }

        // Update to new password
        const hashedPassword = await hashPassword(newPassword);
        const adminRef = doc(db, ADMIN_COLLECTION, ADMIN_DOC_ID);
        await setDoc(adminRef, {
            passwordHash: hashedPassword,
            lastUpdated: new Date().toISOString()
        }, { merge: true });

        return { success: true, message: "Password updated successfully" };
    } catch (error) {
        console.error("Error updating password:", error);
        return { success: false, message: "Error updating password" };
    }
}

// Session management using cookies
export function setAdminSession() {
    if (typeof window !== 'undefined') {
        const expires = new Date();
        expires.setHours(expires.getHours() + 12); // 12 hour expiration

        document.cookie = `bpl_admin_auth=true; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
        document.cookie = `bpl_admin_login_time=${Date.now()}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    }
}

export function clearAdminSession() {
    if (typeof window !== 'undefined') {
        document.cookie = 'bpl_admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'bpl_admin_login_time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
}

export function isAdminAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;

    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {} as Record<string, string>);

    const isAuth = cookies['bpl_admin_auth'] === 'true';
    const loginTime = cookies['bpl_admin_login_time'];

    if (!isAuth || !loginTime) return false;

    // Session expires after 12 hours
    const sessionDuration = 12 * 60 * 60 * 1000;
    const now = Date.now();
    const elapsed = now - parseInt(loginTime);

    if (elapsed > sessionDuration) {
        clearAdminSession();
        return false;
    }

    return true;
}
