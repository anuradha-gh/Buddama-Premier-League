"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMatchDetails } from "@/hooks/useMatchDetails";
import Image from "next/image";
import { Calendar, Trophy, User } from "lucide-react";

export default function MatchCenterPage() {
    const params = useParams();
    const matchId = params.id as string;
    const { match, matchState, teamA, teamB, players, loading } = useMatchDetails(matchId);
    const [activeTab, setActiveTab] = useState<'scorecard' | 'commentary' | 'squads'>('scorecard');

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center text-white">
                Loading match details...
            </div>
        );
    }

    if (!match || !teamA || !teamB) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center text-white">
                Match not found.
            </div>
        );
    }

    // Helper to get player name
    const getPlayerName = (id: string) => {
        const p = players.find(player => player.id === id);
        return p ? p.name : "Unknown Player";
    };

    // Determine current batting team for display
    const isTeamABatting = matchState?.battingTeamId === teamA.id;
    const battingTeam = isTeamABatting ? teamA : teamB;
    // const bowlingTeam = isTeamABatting ? teamB : teamA; // Unused for now

    // Current Score Display Logic
    const currentScore = match.score ? (isTeamABatting ? match.score.teamA : match.score.teamB) : null;
    const currentOvers = currentScore?.overs || 0;
    const currentRuns = currentScore?.runs || 0;
    const currentWickets = currentScore?.wickets || 0;

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12">
            {/* Header Section */}
            <div className="bg-slate-900 border-b border-white/5 pb-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center gap-6">
                        {/* Match Info */}
                        <div className="text-center space-y-2">
                            <h1 className="text-gray-400 uppercase tracking-wider text-sm font-bold">
                                {match.round} • {match.venue}
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                                <Calendar className="w-3 h-3 text-white" />
                                <span>{new Date(match.date).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Scoreboard */}
                        <div className="flex items-center justify-center gap-8 md:gap-16 w-full max-w-4xl">
                            {/* Team A */}
                            <div className={`flex flex-col items-center gap-4 flex-1 text-right ${matchState?.battingTeamId === teamA.id ? 'opacity-100' : 'opacity-60'}`}>
                                <div className="relative w-20 h-20 md:w-24 md:h-24 bg-slate-800 rounded-full p-2 border border-white/10">
                                    <Image
                                        src={teamA.logoUrl}
                                        alt={teamA.name}
                                        fill
                                        className="object-cover rounded-full"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-white">{teamA.name}</h2>
                                    {match.score && (
                                        <div className="text-3xl md:text-4xl font-bold text-white mt-2">
                                            {match.score.teamA.runs}/{match.score.teamA.wickets}
                                            <span className="text-lg text-gray-400 ml-2">({match.score.teamA.overs})</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* VS / Result */}
                            <div className="flex flex-col items-center justify-center gap-2">
                                {match.status === 'Live' ? (
                                    <div className="flex flex-col items-center">
                                        <span className="text-red-500 font-bold uppercase tracking-widest text-xs animate-pulse mb-2">● Live</span>
                                        <div className="text-4xl font-bold text-white">
                                            {currentRuns}/{currentWickets}
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            {currentOvers} Overs
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 uppercase">
                                            {battingTeam.shortName} Batting
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-4xl md:text-6xl font-black text-white/10 italic">VS</div>
                                        {match.result && (
                                            <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                                                {match.result}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Team B */}
                            <div className={`flex flex-col items-center gap-4 flex-1 text-left ${matchState?.battingTeamId === teamB.id ? 'opacity-100' : 'opacity-60'}`}>
                                <div className="relative w-20 h-20 md:w-24 md:h-24 bg-slate-800 rounded-full p-2 border border-white/10">
                                    <Image
                                        src={teamB.logoUrl}
                                        alt={teamB.name}
                                        fill
                                        className="object-cover rounded-full"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-white">{teamB.name}</h2>
                                    {match.score && (
                                        <div className="text-3xl md:text-4xl font-bold text-white mt-2">
                                            {match.score.teamB.runs}/{match.score.teamB.wickets}
                                            <span className="text-lg text-gray-400 ml-2">({match.score.teamB.overs})</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Live Details Widget (Batsmen & Bowler) */}
                        {match.status === 'Live' && matchState && (
                            <div className="w-full max-w-3xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Batsmen */}
                                <div className="glass-card p-4 rounded-xl border border-white/10">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <User className="w-3 h-3" /> Batsmen at Crease
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-primary font-bold">➤</span>
                                                <span className="text-white font-bold">{getPlayerName(matchState.strikerId)}</span>
                                            </div>
                                            <span className="text-gray-400 text-sm">*</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 pl-5">
                                                <span className="text-gray-300">{getPlayerName(matchState.nonStrikerId)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bowler */}
                                <div className="glass-card p-4 rounded-xl border border-white/10">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full border border-gray-400" /> Current Bowler
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-bold">{getPlayerName(matchState.currentBowlerId)}</span>
                                        <div className="text-xs text-gray-500">
                                            {matchState.ballsBowledInOver}/6 Balls
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="container mx-auto px-4 mt-8">
                <div className="flex items-center justify-center gap-4 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('scorecard')}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'scorecard'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        Scorecard
                    </button>
                    <button
                        onClick={() => setActiveTab('commentary')}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'commentary'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        Ball-by-Ball
                    </button>
                    <button
                        onClick={() => setActiveTab('squads')}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'squads'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        Squads
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-8">
                    {activeTab === 'scorecard' && (
                        <div className="glass-card p-12 text-center">
                            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Full Scorecard Coming Soon</h3>
                            <p className="text-gray-400">Detailed batting and bowling figures will be available shortly.</p>
                        </div>
                    )}

                    {activeTab === 'commentary' && (
                        <div className="glass-card p-12 text-center">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                                <span className="font-mono text-2xl">...</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Commentary Feed</h3>
                            <p className="text-gray-400">Ball-by-ball updates will appear here.</p>
                        </div>
                    )}

                    {activeTab === 'squads' && (
                        <div className="glass-card p-12 text-center">
                            <div className="flex justify-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-gray-500">
                                    <Image src={teamA.logoUrl} alt={teamA.name} width={24} height={24} className="opacity-50" unoptimized />
                                </div>
                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-gray-500">
                                    <Image src={teamB.logoUrl} alt={teamB.name} width={24} height={24} className="opacity-50" unoptimized />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Playing XI</h3>
                            <p className="text-gray-400">Team lineups will be displayed here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
