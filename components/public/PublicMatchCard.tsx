"use client";

import { Match, Team } from "@/lib/types";
import { Calendar, Clock, MapPin } from "lucide-react";

interface PublicMatchCardProps {
    match: Match;
    teamA?: Team;
    teamB?: Team;
}

export default function PublicMatchCard({ match, teamA, teamB }: PublicMatchCardProps) {
    const isCompleted = match.status === 'Completed';
    const isLive = match.status === 'Live';

    return (
        <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
            {/* Header / Date Badge */}
            <div className="bg-white/5 px-4 py-2 flex items-center justify-between text-sm text-gray-400 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-white" />
                        <span>{new Date(match.date).toLocaleDateString()}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-600" />
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>{match.venue}</span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Team A */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white/5 p-2 group-hover:border-primary/20 transition-colors">
                            {teamA?.logoUrl ? (
                                <img src={teamA.logoUrl} alt={teamA.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-xl font-bold text-gray-500">{teamA?.shortName}</span>
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wide">{teamA?.name}</h3>
                            {isCompleted && match.score && (
                                <div className="text-2xl font-bold text-primary mt-1">
                                    {match.score.teamA.runs}/{match.score.teamA.wickets}
                                    <span className="text-sm text-gray-500 font-normal ml-1">({match.score.teamA.overs})</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* VS / Status */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl md:text-5xl font-display italic font-bold text-gray-700 group-hover:text-gray-600 transition-colors">
                            VS
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isLive ? 'bg-red-500/20 text-red-500 animate-pulse' :
                            isCompleted ? 'bg-green-500/20 text-green-500' :
                                'bg-blue-500/20 text-blue-500'
                            }`}>
                            {match.status}
                        </div>
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white/5 p-2 group-hover:border-primary/20 transition-colors">
                            {teamB?.logoUrl ? (
                                <img src={teamB.logoUrl} alt={teamB.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-xl font-bold text-gray-500">{teamB?.shortName}</span>
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wide">{teamB?.name}</h3>
                            {isCompleted && match.score && (
                                <div className="text-2xl font-bold text-primary mt-1">
                                    {match.score.teamB.runs}/{match.score.teamB.wickets}
                                    <span className="text-sm text-gray-500 font-normal ml-1">({match.score.teamB.overs})</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Result Banner */}
                {isCompleted && match.result && (
                    <div className="mt-6 pt-4 border-t border-white/5 text-center">
                        <p className="text-green-400 font-bold uppercase tracking-wider text-sm md:text-base">
                            {match.result}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
