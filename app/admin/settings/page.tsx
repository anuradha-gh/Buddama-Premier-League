"use client";

import { useState } from "react";
import { Shield, Lock, CheckCircle, AlertCircle, LogOut } from "lucide-react";
import { updateAdminPassword, clearAdminSession } from "@/lib/services/authService";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const router = useRouter();

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        // Validation
        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'New password must be at least 8 characters long' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);

        try {
            const result = await updateAdminPassword(currentPassword, newPassword);

            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                // Logout after password change
                setTimeout(() => {
                    handleLogout();
                }, 2000);
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearAdminSession();
        router.push("/admin/login");
    };

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Admin Settings</h2>
                <p className="text-gray-400">Manage admin access and security settings</p>
            </div>

            {/* Current Password Info */}
            <div className="bg-slate-900 border border-white/5 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                        <Shield className="text-primary" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Access Control Status</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Your admin panel is protected by password authentication. Only users with the correct password can access admin features.
                        </p>
                        <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Protection Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-slate-900 border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Lock className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-white">Change Password</h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            required
                            minLength={8}
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            required
                        />
                    </div>

                    {message && (
                        <div className={`flex items-center gap-2 p-4 rounded-lg ${message.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                                : 'bg-red-500/10 border border-red-500/50 text-red-400'
                            }`}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            <span className="text-sm">{message.text}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-slate-950 font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>

            {/* Logout Section */}
            <div className="bg-slate-900 border border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Logout</h3>
                        <p className="text-gray-400 text-sm">End your current admin session</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 font-medium rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Security Tips */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <h4 className="text-white font-bold mb-3">Security Tips</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>Use a strong password with a mix of letters, numbers, and symbols</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>Change your password regularly</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>Never share your admin password with anyone</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>Always logout when you're done using the admin panel</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
