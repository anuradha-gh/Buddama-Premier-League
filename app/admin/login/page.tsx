"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Shield, User } from "lucide-react";
import { verifyAdminCredentials, setAdminSession, isAdminAuthenticated } from "@/lib/services/authService";
import Image from "next/image";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Redirect if already logged in
        if (isAdminAuthenticated()) {
            window.location.href = "/admin/dashboard";
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLockedUntil(null);
        setLoading(true);

        try {
            const result = await verifyAdminCredentials(username, password);

            if (result.success) {
                setAdminSession();
                // Use window.location.href for hard navigation to dashboard
                window.location.href = "/admin/dashboard";
            } else {
                setError(result.message);
                if (result.lockedUntil) {
                    setLockedUntil(result.lockedUntil);
                }
                setPassword("");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <Image
                            src="/logo-white.png"
                            alt="BPL Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="font-display text-3xl text-white mb-2">BPL ADMIN</h1>
                    <p className="text-gray-400">Enter credentials to continue</p>
                </div>

                {/* Login Form */}
                <div className="bg-slate-900 border border-white/10 rounded-xl p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="p-4 bg-primary/20 rounded-full">
                            <Shield className="text-primary" size={32} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full bg-slate-950 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-slate-950 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                                <p className="text-red-400 text-sm font-medium">{error}</p>
                                {lockedUntil && (
                                    <p className="text-red-300 text-xs mt-1">
                                        Try again after {lockedUntil.toLocaleTimeString()}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-slate-950 font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? "Verifying..." : "Login"}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-400 text-xs text-center">
                            🔒 Account locks after 5 failed attempts (30 min)
                        </p>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Buddama Premier League • Admin Portal
                </p>
            </div>
        </div>
    );
}
