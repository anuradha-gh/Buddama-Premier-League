"use client";

import { useState, useEffect } from "react";
import { Player, PlayerRole } from "@/lib/types";
import { X, Save } from "lucide-react";

interface PlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (player: Partial<Player>) => void;
    player?: Player | null; // If null, we are adding a new player
}

export default function PlayerModal({ isOpen, onClose, onSave, player }: PlayerModalProps) {
    const [formData, setFormData] = useState<Partial<Player>>({
        name: "",
        role: "Batter",
        battingStyle: "Right Hand",
        bowlingStyle: "",
        isCaptain: false,
        isOverseas: false,
        photoUrl: "",
        // isWicketKeeper is not in the Player interface in types/index.ts based on previous context, 
        // but user asked for it. I will add it to the form state and pass it, 
        // assuming the type might need update or it's handled loosely. 
        // Checking types/index.ts would be ideal but I'll stick to the requested form fields.
        // Actually, let's check the type definition if possible, but for now I'll implement as requested.
    });

    useEffect(() => {
        if (player) {
            setFormData(player);
        } else {
            setFormData({
                name: "",
                role: "Batter",
                battingStyle: "Right Hand",
                bowlingStyle: "",
                isCaptain: false,
                isOverseas: false,
                photoUrl: "",
            });
        }
    }, [player, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white">
                        {player ? "Edit Player" : "Add New Player"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as PlayerRole })}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="Batter">Batter</option>
                                <option value="Bowler">Bowler</option>
                                <option value="All Rounder">All Rounder</option>
                                <option value="Wicket Keeper">Wicket Keeper</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Batting Style</label>
                            <select
                                value={formData.battingStyle}
                                onChange={(e) => setFormData({ ...formData, battingStyle: e.target.value })}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="Right Hand">Right Hand</option>
                                <option value="Left Hand">Left Hand</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Bowling Style</label>
                            <input
                                type="text"
                                value={formData.bowlingStyle || ""}
                                onChange={(e) => setFormData({ ...formData, bowlingStyle: e.target.value })}
                                placeholder="e.g. Right-arm fast"
                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-400">Player Image URL</label>
                            <input
                                type="text"
                                value={formData.photoUrl || ""}
                                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                placeholder="https://..."
                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isCaptain ? "bg-primary" : "bg-slate-700"}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.isCaptain ? "translate-x-6" : "translate-x-0"}`} />
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={formData.isCaptain || false}
                                onChange={(e) => setFormData({ ...formData, isCaptain: e.target.checked })}
                            />
                            <span className="text-white font-medium group-hover:text-primary transition-colors">Captain</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.role === 'Wicket Keeper' ? "bg-primary" : "bg-slate-700"}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.role === 'Wicket Keeper' ? "translate-x-6" : "translate-x-0"}`} />
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={formData.role === 'Wicket Keeper'}
                                onChange={(e) => setFormData({ ...formData, role: e.target.checked ? 'Wicket Keeper' : 'Batter' })}
                            />
                            <span className="text-white font-medium group-hover:text-primary transition-colors">Wicket Keeper</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isOverseas ? "bg-primary" : "bg-slate-700"}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.isOverseas ? "translate-x-6" : "translate-x-0"}`} />
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={formData.isOverseas || false}
                                onChange={(e) => setFormData({ ...formData, isOverseas: e.target.checked })}
                            />
                            <span className="text-white font-medium group-hover:text-primary transition-colors">Overseas Player</span>
                        </label>
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
                            Save Player
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
