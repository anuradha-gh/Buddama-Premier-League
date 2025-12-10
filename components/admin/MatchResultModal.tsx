"use client";

import { Team } from "@/lib/types";
import { X, Trophy } from "lucide-react";

interface MatchResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (winnerId: string, result: string) => void;
    teamA: Team;
    teamB: Team;
}

export default function MatchResultModal({ isOpen, onClose, onSave, teamA, teamB }: MatchResultModalProps) {
    const handleWinnerSelect = (winnerId: string, teamName: string) => {
        const loserName = winnerId === teamA.id ? teamB.name : teamA.name;
        const result = `${teamName} won against ${loserName}`;
        onSave(winnerId, result);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-800/50">
                    <div>
                        <h3 className="text-xl font-bold text-white">Match Result</h3>
                        <p className="text-sm text-gray-400 mt-1">Select the winning team</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Team A */}
                        <button
                            onClick={() => handleWinnerSelect(teamA.id, teamA.name)}
                            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 hover:from-primary/20 hover:to-primary/10 border-2 border-white/10 hover:border-primary rounded-xl p-8 transition-all duration-300 hover:scale-105"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-24 h-24 rounded-full bg-slate-800 p-4 group-hover:bg-primary/20 transition-colors">
                                    <img
                                        src={teamA.logoUrl}
                                        alt={teamA.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                        {teamA.name}
                                    </h4>
                                    <p className="text-sm text-gray-400 mt-1">Click to select winner</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trophy className="text-primary" size={32} />
                                </div>
                            </div>
                        </button>

                        {/* Team B */}
                        <button
                            onClick={() => handleWinnerSelect(teamB.id, teamB.name)}
                            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 hover:from-primary/20 hover:to-primary/10 border-2 border-white/10 hover:border-primary rounded-xl p-8 transition-all duration-300 hover:scale-105"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-24 h-24 rounded-full bg-slate-800 p-4 group-hover:bg-primary/20 transition-colors">
                                    <img
                                        src={teamB.logoUrl}
                                        alt={teamB.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                        {teamB.name}
                                    </h4>
                                    <p className="text-sm text-gray-400 mt-1">Click to select winner</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trophy className="text-primary" size={32} />
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-slate-950/50 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
