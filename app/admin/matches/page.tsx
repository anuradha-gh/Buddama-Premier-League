"use client";

import { useState, useEffect } from "react";
import { getAllSeasons, getAllTeams } from "@/lib/services/teamSeasonService";
import { getMatchesBySeason, createMatch, updateMatch, deleteMatch } from "@/lib/services/matchService";
import { Match, Season, Team } from "@/lib/types";
import { Plus, Calendar, MapPin, Clock, Edit2, Trash2, Trophy } from "lucide-react";
import SeasonModal from "@/components/admin/SeasonModal";
import MatchModal from "@/components/admin/MatchModal";
import MatchResultModal from "@/components/admin/MatchResultModal";

export default function MatchesPage() {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
    const [editingMatch, setEditingMatch] = useState<Match | null>(null);

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
                setMatches(seasonMatches);
            };
            fetchMatches();
        }
    }, [selectedSeasonId]);

    const handleCreateSeason = async (seasonData: Partial<Season>) => {
        try {
            const { collection, addDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            if (db) {
                const newSeasonRef = await addDoc(collection(db, 'seasons'), {
                    ...seasonData,
                    status: 'Active',
                    ballsPerOver: 6,
                    createdAt: new Date().toISOString()
                });

                const newSeason: Season = {
                    id: newSeasonRef.id,
                    name: seasonData.name || "New Season",
                    startDate: seasonData.startDate || new Date().toISOString(),
                    endDate: seasonData.endDate || "",
                    isCurrent: false, // Default
                    ...seasonData
                } as Season;

                setSeasons([...seasons, newSeason]);
                setSelectedSeasonId(newSeason.id);
                setIsSeasonModalOpen(false);
            }
        } catch (e) {
            console.error("Error creating season:", e);
            alert("Failed to create season");
        }
    };

    const handleScheduleMatch = () => {
        setEditingMatch(null);
        setIsMatchModalOpen(true);
    };

    const handleEditMatch = (match: Match) => {
        setEditingMatch(match);
        setIsMatchModalOpen(true);
    };

    const handleDeleteMatch = async (matchId: string) => {
        if (confirm("Are you sure you want to delete this match?")) {
            const success = await deleteMatch(matchId);
            if (success) {
                setMatches(matches.filter(m => m.id !== matchId));
            }
        }
    };

    const handleSaveResult = async (winnerId: string, result: string) => {
        if (!selectedMatch) return;

        const updatedMatch = await updateMatch(selectedMatch.id, {
            status: 'Completed',
            result: result
        });

        if (updatedMatch) {
            setMatches(matches.map(m =>
                m.id === selectedMatch.id
                    ? { ...m, status: 'Completed' as const, result }
                    : m
            ));
            setSelectedMatch(null);
        }
    };

    const handleSaveMatch = async (matchData: Partial<Match>) => {
        if (editingMatch) {
            // Update existing
            const updatedMatch = await updateMatch(editingMatch.id, matchData);
            if (updatedMatch) {
                // Merge updated fields with existing match to avoid losing data not returned by updateMatch if it returns partial
                // But our service returns {id, ...updates}, so we need to be careful.
                // Actually, let's just re-fetch or merge carefully.
                setMatches(matches.map(m => m.id === editingMatch.id ? { ...m, ...updatedMatch } : m));
            }
        } else {
            // Add new
            const newMatch = await createMatch({
                ...matchData,
                seasonId: selectedSeasonId,
                status: 'Scheduled', // Default status
                currentOver: 0,
                totalOvers: 20,
                teamAId: matchData.teamAId!,
                teamBId: matchData.teamBId!,
                date: matchData.date!,
                venue: matchData.venue || 'Buddama Cricket Ground',
                round: matchData.round || 'League Stage'
            } as Match); // Cast to Match to satisfy type, though createMatch takes Omit<Match, "id">

            if (newMatch) {
                setMatches([...matches, newMatch]);
            }
        }
        setIsMatchModalOpen(false);
    };

    const getTeam = (teamId: string) => {
        return teams.find(t => t.id === teamId);
    };

    if (loading && seasons.length === 0) {
        return <div className="text-white text-center py-20">Loading matches...</div>;
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Matches</h2>
                        <p className="text-gray-400 mt-1">Manage match schedules and results.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-xl border border-white/10">
                        <div className="relative">
                            <select
                                value={selectedSeasonId}
                                onChange={(e) => setSelectedSeasonId(e.target.value)}
                                className="appearance-none bg-slate-800 text-white px-4 py-2 pr-8 rounded-lg border border-white/10 focus:outline-none focus:border-primary cursor-pointer min-w-[150px]"
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

                        <button
                            onClick={() => setIsSeasonModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap border border-white/10"
                        >
                            <Plus size={18} />
                            New Season
                        </button>
                    </div>
                </div>

                {/* Schedule Match Button */}
                <button
                    onClick={handleScheduleMatch}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-900/20"
                >
                    <Plus size={20} />
                    Schedule Match
                </button>
            </div>

            {/* Matches List */}
            <div className="grid grid-cols-1 gap-6">
                {matches.length > 0 ? (
                    matches.map((match) => {
                        const teamA = getTeam(match.teamAId);
                        const teamB = getTeam(match.teamBId);
                        const isFuture = new Date(match.date) > new Date();

                        return (
                            <div key={match.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group relative">
                                {/* Date Badge */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur border-b border-x border-white/10 px-4 py-1 rounded-b-lg text-xs font-medium text-gray-400 flex items-center gap-2 z-10">
                                    <Calendar size={12} className="text-white" />
                                    {new Date(match.date).toLocaleDateString()}
                                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                                    <Clock size={12} />
                                    {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>

                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                        {/* Team A */}
                                        <div className="flex flex-col items-center gap-3 flex-1">
                                            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white/5 p-2">
                                                {teamA?.logoUrl ? (
                                                    <img src={teamA.logoUrl} alt={teamA.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-2xl font-bold text-gray-500">{teamA?.shortName}</span>
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-xl font-bold text-white uppercase">{teamA?.name}</h3>
                                                <p className="text-sm text-gray-500">Home</p>
                                            </div>
                                        </div>

                                        {/* VS / Info */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="text-5xl font-display italic font-bold text-gray-500">VS</div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                                                <MapPin size={14} />
                                                {match.venue}
                                            </div>
                                            <div className="text-xs font-medium text-primary uppercase tracking-wider mt-1">
                                                {match.round}
                                            </div>
                                        </div>

                                        {/* Team B */}
                                        <div className="flex flex-col items-center gap-3 flex-1">
                                            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white/5 p-2">
                                                {teamB?.logoUrl ? (
                                                    <img src={teamB.logoUrl} alt={teamB.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-2xl font-bold text-gray-500">{teamB?.shortName}</span>
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-xl font-bold text-white uppercase">{teamB?.name}</h3>
                                                <p className="text-sm text-gray-500">Away</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="bg-slate-950/50 border-t border-white/5 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${match.status === 'Live' ? 'bg-red-500/20 text-red-500' :
                                            match.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                                                'bg-blue-500/20 text-blue-500'
                                            }`}>
                                            {match.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleEditMatch(match)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                            title="Edit Match"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMatch(match.id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                                            title="Delete Match"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        <div className="w-px h-6 bg-white/10 mx-1" />

                                        <button
                                            onClick={() => {
                                                if (match.status !== 'Completed') {
                                                    setSelectedMatch(match);
                                                    setIsResultModalOpen(true);
                                                }
                                            }}
                                            disabled={match.status === 'Completed'}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${match.status === 'Completed'
                                                ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                                                : 'bg-primary hover:bg-primary/90 text-white'
                                                }`}
                                        >
                                            {match.status === 'Completed' ? (
                                                <>
                                                    <Trophy size={16} />
                                                    Result Saved
                                                </>
                                            ) : (
                                                <>
                                                    <Trophy size={16} />
                                                    Match Result
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-white/5 border-dashed">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <Calendar size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Matches Scheduled</h3>
                        <p className="text-gray-400 mb-6">Get started by scheduling the first match for this season.</p>
                        <button
                            onClick={handleScheduleMatch}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors"
                        >
                            <Plus size={20} />
                            Schedule Match
                        </button>
                    </div>
                )}
            </div>

            <SeasonModal
                isOpen={isSeasonModalOpen}
                onClose={() => setIsSeasonModalOpen(false)}
                onSave={handleCreateSeason}
            />

            <MatchModal
                isOpen={isMatchModalOpen}
                onClose={() => setIsMatchModalOpen(false)}
                onSave={handleSaveMatch}
                teams={teams}
                match={editingMatch}
            />

            {selectedMatch && (
                <MatchResultModal
                    isOpen={isResultModalOpen}
                    onClose={() => {
                        setIsResultModalOpen(false);
                        setSelectedMatch(null);
                    }}
                    onSave={handleSaveResult}
                    teamA={getTeam(selectedMatch.teamAId)!}
                    teamB={getTeam(selectedMatch.teamBId)!}
                />
            )}
        </div>
    );
}
