"use client";

import { useState } from "react";
import { Player, WicketType } from "@/lib/types";
import { X } from "lucide-react";

interface WicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (wicketType: WicketType, newBatsmanId: string, dismissedPlayerId?: string) => void;
    availableBatsmen: Player[];
    striker: Player | undefined;
    nonStriker: Player | undefined;
}

export default function WicketModal({ isOpen, onClose, onConfirm, availableBatsmen, striker, nonStriker }: WicketModalProps) {
    const [wicketType, setWicketType] = useState<WicketType>("Caught");
    const [newBatsmanId, setNewBatsmanId] = useState<string>("");
    const [runOutPlayerId, setRunOutPlayerId] = useState<string>("");

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!newBatsmanId) {
            alert("Please select the new batsman.");
            return;
        }

        if (wicketType === 'RunOut' && !runOutPlayerId) {
            alert("Please select who is Run Out.");
            return;
        }

        // For run out, use selected player. For others, it's implied to be the striker (handled by parent or default)
        const dismissedId = wicketType === 'RunOut' ? runOutPlayerId : undefined;

        onConfirm(wicketType, newBatsmanId, dismissedId);
        onClose();

        // Reset state
        setWicketType("Caught");
        setNewBatsmanId("");
        setRunOutPlayerId("");
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-display text-white">Wicket Fall</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Dismissal Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['Bowled', 'Caught', 'LBW', 'RunOut', 'Stumped', 'HitWicket'] as WicketType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setWicketType(type)}
                                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${wicketType === type
                                        ? 'bg-red-500 text-white'
                                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {wicketType === 'RunOut' && (
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5 animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm text-red-400 font-bold mb-3 uppercase tracking-wider">Who is Out?</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setRunOutPlayerId(striker?.id || "")}
                                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${runOutPlayerId === striker?.id
                                            ? 'bg-red-500/20 border-red-500 text-white'
                                            : 'bg-slate-800 border-transparent text-gray-400 hover:bg-slate-700'
                                        }`}
                                >
                                    <span className="text-xs uppercase">Striker</span>
                                    <span className="font-bold text-sm">{striker?.name}</span>
                                </button>
                                <button
                                    onClick={() => setRunOutPlayerId(nonStriker?.id || "")}
                                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${runOutPlayerId === nonStriker?.id
                                            ? 'bg-red-500/20 border-red-500 text-white'
                                            : 'bg-slate-800 border-transparent text-gray-400 hover:bg-slate-700'
                                        }`}
                                >
                                    <span className="text-xs uppercase">Non-Striker</span>
                                    <span className="font-bold text-sm">{nonStriker?.name}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">New Batsman</label>
                        <select
                            value={newBatsmanId}
                            onChange={(e) => setNewBatsmanId(e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded px-3 py-3 text-white focus:border-primary outline-none"
                        >
                            <option value="">Select Player...</option>
                            {availableBatsmen.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.name} ({player.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleConfirm}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-wide transition-colors"
                        >
                            Confirm Wicket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
