"use client";

import Link from "next/link";
import { getAllTeams } from "@/lib/services/teamSeasonService";
import { Team } from "@/lib/types";
import { Plus, Users, Settings } from "lucide-react";
import { useEffect, useState } from "react";

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            setLoading(true);
            const fetchedTeams = await getAllTeams();
            setTeams(fetchedTeams);
            setLoading(false);
        };
        fetchTeams();
    }, []);

    if (loading) {
        return <div className="text-white text-center py-20">Loading teams...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Teams</h2>
                    <p className="text-gray-400 mt-1">Manage team profiles and rosters.</p>
                </div>
                <Link href="/admin/teams/new" className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors">
                    <Plus size={20} />
                    Create New Team
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <div key={team.id} className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors group">
                        <div className="p-6 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-white/5">
                                    {team.logoUrl ? (
                                        <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-500">{team.shortName}</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                        <Link href={`/admin/teams/${team.id}`}>
                                            {team.name}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-gray-400">{team.homeVenue}</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-950/50 border-t border-white/5 flex gap-3">
                            <Link
                                href={`/admin/teams/${team.id}/roster`}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Users size={16} />
                                Edit Roster
                            </Link>
                            <Link
                                href={`/admin/teams/${team.id}`}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Settings size={16} />
                                Settings
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
