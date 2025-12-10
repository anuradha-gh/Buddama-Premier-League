"use client";

import { useLiveMatch } from "@/hooks/useLiveMatch";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";

export default function HeroScoreWidget() {
    const { match, teamA, teamB, loading } = useLiveMatch();

    if (loading) return null; // Or a loading skeleton
    if (!match || !teamA || !teamB) return null;

    const isLive = match.status === 'Live';
    const matchDate = new Date(match.date);

    return (
        <div className="w-full max-w-4xl mx-auto mb-12 animate-fade-in-up">
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
                {/* Header Label */}
                <div className="flex justify-center mb-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${isLive
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        }`}>
                        {isLive && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                        <span className="font-bold text-xs tracking-wider uppercase">
                            {isLive ? 'Live Match' : 'Upcoming Match'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 md:gap-12">
                    {/* Team A */}
                    <div className="flex flex-col items-center gap-4 flex-1">
                        <div className="relative w-16 h-16 md:w-24 md:h-24 bg-slate-800/50 rounded-full p-2">
                            <Image
                                src={teamA.logoUrl}
                                alt={teamA.name}
                                fill
                                className="object-cover rounded-full"
                                unoptimized
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="text-white font-bold text-lg md:text-2xl leading-tight">{teamA.name}</h3>
                        </div>
                    </div>

                    {/* Center Info (Score or Date) */}
                    <div className="flex flex-col items-center justify-center min-w-[140px] md:min-w-[200px]">
                        {isLive && match.score ? (
                            <>
                                <div className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                                    {/* Displaying Batting Team Score Logic */}
                                    {/* Assuming match.battingFirstId helps, but simplified for now: */}
                                    {/* We show Team A vs Team B scores usually, or just the active one. */}
                                    {/* For Hero Widget, let's show the main score line if available, or VS */}

                                    {/* Simple logic: Show both if available, or just VS if not started properly */}
                                    {match.score.teamA.runs}/{match.score.teamA.wickets}
                                </div>
                                <div className="text-gray-400 font-mono mt-2 text-sm md:text-base">
                                    {match.score.teamA.overs} Overs
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    vs {teamB.shortName} ({match.score.teamB.runs}/{match.score.teamB.wickets})
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl md:text-6xl font-black text-white/10 italic select-none">VS</div>
                                <div className="mt-4 flex flex-col items-center gap-1 text-center">
                                    <div className="flex items-center gap-2 text-primary font-bold">
                                        <Calendar className="w-4 h-4 text-white" />
                                        <span>{matchDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {matchDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center gap-4 flex-1">
                        <div className="relative w-16 h-16 md:w-24 md:h-24 bg-slate-800/50 rounded-full p-2">
                            <Image
                                src={teamB.logoUrl}
                                alt={teamB.name}
                                fill
                                className="object-cover rounded-full"
                                unoptimized
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="text-white font-bold text-lg md:text-2xl leading-tight">{teamB.name}</h3>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 text-center">
                    <Link
                        href={`/match-center/${match.id}`}
                        className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-bold uppercase tracking-wider group"
                    >
                        {isLive ? 'View Full Scoreboard' : 'View Match Details'}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
