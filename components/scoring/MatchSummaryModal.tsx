"use client";

import { Trophy, CheckCircle } from "lucide-react";

interface MatchSummaryModalProps {
    isOpen: boolean;
    winnerName: string;
    margin: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function MatchSummaryModal({ isOpen, winnerName, margin, onConfirm, onClose }: MatchSummaryModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-black/50 scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-8 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                        <Trophy size={40} className="text-yellow-500" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-gray-400 text-sm uppercase tracking-wider font-bold">Match Winner</h2>
                        <h1 className="text-4xl font-display text-white">{winnerName}</h1>
                    </div>

                    <div className="px-6 py-3 bg-slate-800 rounded-xl border border-white/5">
                        <p className="text-xl text-primary font-bold">{margin}</p>
                    </div>

                    <p className="text-sm text-gray-500">
                        Confirming will finalize the match and update the standings. This action cannot be undone.
                    </p>

                    <div className="w-full pt-4">
                        <button
                            onClick={onConfirm}
                            className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-lg uppercase tracking-wider shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                            <CheckCircle size={24} />
                            Confirm & Update Standings
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full mt-3 py-3 text-gray-400 hover:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
