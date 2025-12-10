"use client";

import { useState, useEffect } from "react";
import { getAllSeasons, getAllTeams } from "@/lib/services/teamSeasonService";
import { getMatchesBySeason } from "@/lib/services/matchService";
import { Match, Season, Team } from "@/lib/types";
import PublicMatchCard from "@/components/public/PublicMatchCard";
import { Calendar, Filter } from "lucide-react";

export default function MatchHistoryPage() {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [fetchedSeasons, fetchedTeams] = await Promise.all([
                getAllSeasons(),
                getAllTeams()
            ]);
            setSeasons(fetchedSeasons);
            setTeams(fetchedTeams);

            if (fetchedSeasons.length > 0) {
                // Default to current season or the first one
                const currentSeason = fetchedSeasons.find(s => s.isCurrent) || fetchedSeasons[0];
                setSelectedSeasonId(currentSeason.id);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    // Fetch matches when season changes
    useEffect(() => {
        if (selectedSeasonId) {
            const fetchMatches = async () => {
                const seasonMatches = await getMatchesBySeason(selectedSeasonId);
                // Sort matches: Future matches ascending, Past matches descending
                setMatches(seasonMatches);
            };
            fetchMatches();
        }
    }, [selectedSeasonId]);

    const getTeam = (teamId: string) => {
        return teams.find(t => t.id === teamId);
    };

    // Group matches
    const upcomingMatches = matches
        .filter(m => m.status === 'Scheduled' || m.status === 'Live')
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB; // Ascending (earliest first)
        });

    const pastMatches = matches
        .filter(m => m.status === 'Completed')
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA; // Descending (most recent first)
        });

    if (loading && seasons.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 pb-12 flex items-center justify-center">
                <div className="text-white">Loading match history...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-display italic">
                            MATCH FIXTURES <span className="text-primary">AND HISTORY</span>
                        </h1>
                        <p className="text-gray-400 max-w-xl">
                            Explore the complete schedule and results of the Budhama Premier League.
                        </p>
                    </div>

                    {/* Season Selector */}
                    <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 px-3 text-gray-400">
                            <Filter size={16} />
                            <span className="text-sm font-medium uppercase tracking-wider">Season</span>
                        </div>
                        <div className="relative">
                            <select
                                value={selectedSeasonId}
                                onChange={(e) => setSelectedSeasonId(e.target.value)}
                                className="appearance-none bg-slate-800 text-white px-4 py-2 pr-10 rounded-lg border border-white/10 focus:outline-none focus:border-primary cursor-pointer min-w-[180px] font-bold"
                            >
                                {seasons.map(season => (
                                    <option key={season.id} value={season.id}>
                                        {season.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-16">
                    {/* Latest Results */}
                    {pastMatches.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                                    LATEST RESULTS
                                </h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {pastMatches.map(match => (
                                    <PublicMatchCard
                                        key={match.id}
                                        match={match}
                                        teamA={getTeam(match.teamAId)}
                                        teamB={getTeam(match.teamBId)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Upcoming Fixtures */}
                    {upcomingMatches.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Calendar className="text-primary" />
                                    UPCOMING FIXTURES
                                </h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {upcomingMatches.map(match => (
                                    <PublicMatchCard
                                        key={match.id}
                                        match={match}
                                        teamA={getTeam(match.teamAId)}
                                        teamB={getTeam(match.teamBId)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* No Matches State */}
                    {matches.length === 0 && (
                        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5 border-dashed">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
                                <Calendar size={40} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No Matches Found</h3>
                            <p className="text-gray-400">There are no matches scheduled for this season yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
