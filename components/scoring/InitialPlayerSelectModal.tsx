"use client";

import { useState, useEffect } from "react";
import { Player, Team } from "@/lib/types";
import { Users, User } from "lucide-react";

interface InitialPlayerSelectModalProps {
    isOpen: boolean;
    battingTeam: Team;
    bowlingTeam: Team;
    battingTeamPlayers: Player[];
    bowlingTeamPlayers: Player[];
    onConfirm: (strikerId: string, nonStrikerId: string, bowlerId: string) => void;
}

export default function InitialPlayerSelectModal({
    isOpen,
    battingTeam,
    bowlingTeam,
    battingTeamPlayers,
    bowlingTeamPlayers,
    onConfirm
}: InitialPlayerSelectModalProps) {
    const [strikerId, setStrikerId] = useState("");
    const [nonStrikerId, setNonStrikerId] = useState("");
    const [bowlerId, setBowlerId] = useState("");
    const [error, setError] = useState("");

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStrikerId("");
            setNonStrikerId("");
            setBowlerId("");
            setError("");
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!strikerId || !nonStrikerId || !bowlerId) {
            setError("Please select all three players to start the innings.");
            return;
        }

        if (strikerId === nonStrikerId) {
            setError("Striker and Non-Striker cannot be the same player.");
            return;
        }

        onConfirm(strikerId, nonStrikerId, bowlerId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-black/50">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="text-primary" />
                        Select Opening Players
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Batting Team Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            {battingTeam.name} (Batting)
                        </h3>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase">Striker</label>
                                <select
                                    value={strikerId}
                                    onChange={(e) => setStrikerId(e.target.value)}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="">Select Striker</option>
                                    {battingTeamPlayers.map(player => (
                                        <option
                                            key={player.id}
                                            value={player.id}
                                            disabled={player.id === nonStrikerId}
                                        >
                                            {player.name} ({player.role})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase">Non-Striker</label>
                                <select
                                    value={nonStrikerId}
                                    onChange={(e) => setNonStrikerId(e.target.value)}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="">Select Non-Striker</option>
                                    {battingTeamPlayers.map(player => (
                                        <option
                                            key={player.id}
                                            value={player.id}
                                            disabled={player.id === strikerId}
                                        >
                                            {player.name} ({player.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/10" />

                    {/* Bowling Team Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            {bowlingTeam.name} (Bowling)
                        </h3>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase">Opening Bowler</label>
                            <select
                                value={bowlerId}
                                onChange={(e) => setBowlerId(e.target.value)}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                            >
                                <option value="">Select Bowler</option>
                                {bowlingTeamPlayers.map(player => (
                                    <option key={player.id} value={player.id}>
                                        {player.name} ({player.bowlingStyle || player.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-slate-950/50">
                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-lg uppercase tracking-wider shadow-lg shadow-primary/20 transition-all"
                    >
                        Start Innings
                    </button>
                </div>
            </div>
        </div>
    );
}
