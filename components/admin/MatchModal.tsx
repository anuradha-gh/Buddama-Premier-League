"use client";

import { useState, useEffect } from "react";
import { Match, Team } from "@/lib/types";
import { X, Save } from "lucide-react";

interface MatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (match: Partial<Match>) => void;
    teams: Team[];
    match?: Match | null; // For editing
}

export default function MatchModal({ isOpen, onClose, onSave, teams, match }: MatchModalProps) {
    const [formData, setFormData] = useState<Partial<Match>>({
        teamAId: "",
        teamBId: "",
        date: "",
        venue: "Buddama Cricket Ground",
        round: "League Stage",
        status: "Scheduled"
    });

    useEffect(() => {
        if (match) {
            setFormData({
                ...match,
                date: new Date(match.date).toISOString().slice(0, 16) // Format for datetime-local
            });
        } else {
            setFormData({
                teamAId: teams[0]?.id || "",
                teamBId: teams[1]?.id || "",
                date: "",
                venue: "Buddama Cricket Ground",
                round: "League Stage",
                status: "Scheduled"
            });
        }
    }, [match, isOpen, teams]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.teamAId === formData.teamBId) {
            alert("Home and Away teams cannot be the same.");
            return;
        }
        onSave({
            ...formData,
            date: new Date(formData.date!).toISOString()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white">
                        {match ? "Edit Match" : "Schedule Match"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Home Team</label>
                            <select
                                required
                                value={formData.teamAId}
                                onChange={(e) => setFormData({ ...formData, teamAId: e.target.value })}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                {teams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Away Team</label>
                            <select
                                required
                                value={formData.teamBId}
                                onChange={(e) => setFormData({ ...formData, teamBId: e.target.value })}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                {teams.map(team => (
                                    <option key={team.id} value={team.id} disabled={team.id === formData.teamAId}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Date & Time</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Round</label>
                            <select
                                value={formData.round}
                                onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="League Stage">League Stage</option>
                                <option value="Qualifier 1">Qualifier 1</option>
                                <option value="Eliminator">Eliminator</option>
                                <option value="Qualifier 2">Qualifier 2</option>
                                <option value="Final">Final</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-400">Venue</label>
                            <input
                                type="text"
                                required
                                value={formData.venue}
                                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
                        >
                            <Save size={20} />
                            Save Match
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
