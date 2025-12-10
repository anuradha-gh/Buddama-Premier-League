"use client";

import { useState, useEffect } from "react";
import { Users, Trophy, Calendar, Activity, Loader } from "lucide-react";
import { getAllTeams } from "@/lib/services/teamSeasonService";
import { getMatchesBySeason, getAllMatches } from "@/lib/services/matchService";
import { Match } from "@/lib/types";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [totalTeams, setTotalTeams] = useState(0);
    const [completedMatches, setCompletedMatches] = useState(0);
    const [upcomingMatches, setUpcomingMatches] = useState(0);
    const [liveMatches, setLiveMatches] = useState(0);
    const [recentMatches, setRecentMatches] = useState<Match[]>([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Get all teams
            const teams = await getAllTeams();
            setTotalTeams(teams.length);

            // Get all matches
            const matches = await getAllMatches();

            // Calculate stats
            const completed = matches.filter(m => m.status === 'Completed').length;
            const upcoming = matches.filter(m => m.status === 'Scheduled').length;
            const live = matches.filter(m => m.status === 'Live').length;

            setCompletedMatches(completed);
            setUpcomingMatches(upcoming);
            setLiveMatches(live);

            // Get recent completed matches (last 5)
            const recent = matches
                .filter(m => m.status === 'Completed')
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5);

            setRecentMatches(recent);
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: "Total Teams", value: totalTeams.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Matches Completed", value: completedMatches.toString(), icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        { label: "Upcoming", value: upcomingMatches.toString(), icon: Calendar, color: "text-purple-400", bg: "bg-purple-400/10" },
        { label: "Live Now", value: liveMatches.toString(), icon: Activity, color: "text-green-400", bg: "bg-green-400/10" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
                <p className="text-gray-400 mt-1">Manage your league, teams, and matches.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-slate-900 border border-white/5 p-6 rounded-xl hover:border-primary/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.bg}`}>
                                    <Icon className={stat.color} size={24} />
                                </div>
                                <span className="text-3xl font-bold text-white">{stat.value}</span>
                            </div>
                            <h3 className="text-gray-400 font-medium">{stat.label}</h3>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900 border border-white/5 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Match Results</h3>
                {recentMatches.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Trophy className="mx-auto mb-2" size={32} />
                        <p>No completed matches yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentMatches.map((match) => (
                            <div key={match.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <div>
                                        <span className="text-gray-300">
                                            {match.result || "Match completed"}
                                        </span>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {match.venue} • {match.round}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(match.date).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
