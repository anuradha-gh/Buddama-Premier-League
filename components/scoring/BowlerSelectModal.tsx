import { Player } from "@/lib/types";
import { X } from "lucide-react";

interface BowlerSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (bowlerId: string) => void;
    availableBowlers: Player[];
    currentBowlerId?: string;
}

export default function BowlerSelectModal({
    isOpen,
    onClose,
    onSelect,
    availableBowlers,
    currentBowlerId
}: BowlerSelectModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/50">
                    <h3 className="text-lg font-bold text-white">Select Next Bowler</h3>
                    {/* Close button is hidden/disabled because selection is mandatory at end of over, 
                        but we keep the prop for flexibility if needed later */}
                    {/* <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button> */}
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                        {availableBowlers.map((bowler) => {
                            const isCurrentBowler = bowler.id === currentBowlerId;
                            return (
                                <button
                                    key={bowler.id}
                                    onClick={() => !isCurrentBowler && onSelect(bowler.id)}
                                    disabled={isCurrentBowler}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${isCurrentBowler
                                            ? "bg-slate-800/50 border-white/5 opacity-50 cursor-not-allowed"
                                            : "bg-slate-800 border-white/10 hover:bg-slate-700 hover:border-primary/50 active:scale-[0.98]"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {bowler.photoUrl ? (
                                            <img
                                                src={bowler.photoUrl}
                                                alt={bowler.name}
                                                className="w-10 h-10 rounded-full object-cover bg-slate-700"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-gray-400">
                                                {bowler.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="text-left">
                                            <div className="font-bold text-white">{bowler.name}</div>
                                            <div className="text-xs text-gray-400">{bowler.bowlingStyle || "Bowler"}</div>
                                        </div>
                                    </div>
                                    {isCurrentBowler && (
                                        <span className="text-xs text-red-400 font-medium px-2 py-1 bg-red-400/10 rounded">
                                            Just Bowled
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
