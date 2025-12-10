"use client";

import { useState } from "react";
import { Season } from "@/lib/types";
import { X, Save } from "lucide-react";

interface SeasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (season: Partial<Season>) => void;
}

export default function SeasonModal({ isOpen, onClose, onSave }: SeasonModalProps) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            startDate,
            // Default values for new season
            status: 'Upcoming',
            isCurrent: false,
            year: new Date(startDate).getFullYear()
        });
        onClose();
        // Reset form
        setName("");
        setStartDate("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white">Create New Season</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Season Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. BPL 2026"
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Start Date</label>
                        <input
                            type="date"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
                        >
                            <Save size={18} />
                            Create Season
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
