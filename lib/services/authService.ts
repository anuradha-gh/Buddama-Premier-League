import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore";

const ADMIN_COLLECTION = "admin";
const ADMIN_DOC_ID = "credentials";
const ADMIN_LOGS_COLLECTION = "admin_logs";

// Simple hash function (for demo - in production use bcrypt)
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Password strength validation
export function validatePasswordStrength(password: string): { valid: boolean; message: string } {
    if (password.length < 12) {
        return { valid: false, message: 'Password must be at least 12 characters' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain a number' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: 'Password must contain special character' };
    }
    return { valid: true, message: 'Password is strong' };
}

export async function initializeAdminPassword() {
    try {
        const adminRef = doc(db, ADMIN_COLLECTION, ADMIN_DOC_ID);
        const adminDoc = await getDoc(adminRef);

        if (!adminDoc.exists()) {
            // Set initial credentials: admin / BPL@buddama2025
            const hashedPassword = await hashPassword("BPL@buddama2025");
            await setDoc(adminRef, {
                username: "admin",
                passwordHash: hashedPassword,
                failedAttempts: 0,
                lockoutUntil: null,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            });
            console.log("Admin credentials initialized");
        }
    } catch (error) {
        console.error("Error initializing admin credentials:", error);
    }
}

// Log login attempt
async function logLoginAttempt(success: boolean, username: string, ipAddress?: string) {
    try {
        await addDoc(collection(db, ADMIN_LOGS_COLLECTION), {
            timestamp: new Date().toISOString(),
            success,
            username,
            ipAddress: ipAddress || 'unknown',
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
        });
    } catch (error) {
        console.error("Error logging login attempt:", error);
    }
}

// Check account lockout status
async function checkAccountLockout(): Promise<{ isLocked: boolean; lockedUntil?: Date }> {
    try {
        const adminRef = doc(db, ADMIN_COLLECTION, ADMIN_DOC_ID);
        const adminDoc = await getDoc(adminRef);

        if (!adminDoc.exists()) return { isLocked: false };

        const data = adminDoc.data();
        const lockoutUntil = data.lockoutUntil;

        if (lockoutUntil && new Date(lockoutUntil) > new Date()) {
            return { isLocked: true, lockedUntil: new Date(lockoutUntil) };
        }

        return { isLocked: false };
    } catch (error) {
        console.error("Error checking lockout:", error);
        return { isLocked: false };
    }
}

export async function verifyAdminCredentials(
    username: string,
    password: string,
    ipAddress?: string
): Promise<{
    success: boolean;
    message: string;
    lockedUntil?: Date;
}> {
    try {
        // Check if account is locked
        const lockStatus = await checkAccountLockout();
        if (lockStatus.isLocked) {
            await logLoginAttempt(false, username, ipAddress);
            return {
                success: false,
                message: `Account locked. Try again after ${lockStatus.lockedUntil?.toLocaleTimeString()}`,
                lockedUntil: lockStatus.lockedUntil
            };
        }

        const adminRef = doc(db, ADMIN_COLLECTION, ADMIN_DOC_ID);
        const adminDoc = await getDoc(adminRef);

        if (!adminDoc.exists()) {
            await initializeAdminPassword();
            return verifyAdminCredentials(username, password, ipAddress);
        }

        const data = adminDoc.data();
        const hashedPassword = await hashPassword(password);
        const isValidUsername = data.username === username;
        const isValidPassword = data.passwordHash === hashedPassword;
        const isValid = isValidUsername && isValidPassword;

        // Log attempt
        await logLoginAttempt(isValid, username, ipAddress);

        if (isValid) {
            // Reset failed attempts on successful login
            await updateDoc(adminRef, {
                failedAttempts: 0,
                lockoutUntil: null,
                lastLoginAt: new Date().toISOString()
            });
            return { success: true, message: 'Login successful' };
        } else {
            // Increment failed attempts
            const failedAttempts = (data.failedAttempts || 0) + 1;
            const updateData: any = {
                failedAttempts,
                lastFailedAttempt: new Date().toISOString()
            };

            // Lock account after 5 failed attempts for 30 minutes
            if (failedAttempts >= 5) {
                const lockoutUntil = new Date();
                lockoutUntil.setMinutes(lockoutUntil.getMinutes() + 30);
                updateData.lockoutUntil = lockoutUntil.toISOString();

                await updateDoc(adminRef, updateData);
                return {
                    success: false,
                    message: `Too many failed attempts. Account locked for 30 minutes.`,
                    lockedUntil: lockoutUntil
                };
            }

            await updateDoc(adminRef, updateData);
            const remainingAttempts = 5 - failedAttempts;
            return {
                success: false,
                message: `Invalid credentials. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
            };
        }
    } catch (error) {
        console.error("Error verifying credentials:", error);
        return { success: false, message: "An error occurred. Please try again." };
    }
}

// Legacy function for backward compatibility
export async function verifyAdminPassword(password: string): Promise<boolean> {
    const result = await verifyAdminCredentials("admin", password);
    return result.success;
}

export async function updateAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
        // Validate new password strength
        const validation = validatePasswordStrength(newPassword);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

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

        document.cookie = `bpl_admin_auth=true; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`;
        document.cookie = `bpl_admin_login_time=${Date.now()}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`;
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
