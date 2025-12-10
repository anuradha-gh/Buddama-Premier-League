"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Calendar, Table2, Settings, LogOut, Image } from "lucide-react";

const menuItems = [
    { name: "Dashboard", icon: Home, href: "/admin/dashboard" },
    { name: "Teams", icon: Users, href: "/admin/teams" },
    { name: "Matches", icon: Calendar, href: "/admin/matches" },
    { name: "Points Table", icon: Table2, href: "/admin/points-table" },
    { name: "Gallery", icon: Image, href: "/admin/gallery" },
    { name: "Settings", icon: Settings, href: "/admin/settings" }, // Placeholder route
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-16 hover:w-64 bg-slate-900 border-r border-white/10 transition-all duration-300 z-50 overflow-hidden group">
            <div className="flex flex-col h-full">
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-white/10">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        B
                    </div>
                    <span className="ml-3 font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        BPL Admin
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 flex flex-col gap-2 px-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center h-12 px-3 rounded-lg transition-colors ${isActive
                                    ? "bg-green-500/10 text-green-400"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon size={24} className="min-w-[24px]" />
                                <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-2 border-t border-white/10">
                    <button
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                const { clearAdminSession } = require('@/lib/services/authService');
                                clearAdminSession();
                                window.location.href = '/admin/login';
                            }
                        }}
                        className="flex items-center w-full h-12 px-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={24} className="min-w-[24px]" />
                        <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Logout
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
