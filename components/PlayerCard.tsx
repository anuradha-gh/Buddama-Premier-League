import { Player } from "@/lib/types";
import Image from "next/image";
import { User } from "lucide-react";

interface PlayerCardProps {
    player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
    return (
        <div
            className="glass-card rounded-xl overflow-hidden relative group transition-all duration-300 hover:-translate-y-2"
            style={{
                // @ts-ignore - Custom CSS variable for hover effect
                '--hover-color': '#004aad'
            }}
        >
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    boxShadow: 'inset 0 0 20px var(--hover-color, #004aad)',
                    borderColor: 'var(--hover-color, #004aad)'
                }}
            />

            {/* Image Container */}
            <div className="relative h-72 w-full bg-gradient-to-b from-slate-800 to-slate-900 flex items-end justify-center">
                {player.photoUrl ? (
                    <Image
                        src={player.photoUrl}
                        alt={player.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                    />
                ) : (
                    <div className="h-full w-full flex items-end justify-center pb-0 opacity-50">
                        <User className="w-48 h-48 text-gray-500" strokeWidth={1} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {player.isCaptain && (
                        <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg" title="Captain">
                            C
                        </span>
                    )}
                    {player.role === 'Wicket Keeper' && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg" title="Wicket Keeper">
                            WK
                        </span>
                    )}
                    {player.isOverseas && (
                        <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg" title="Overseas Player">
                            ✈️
                        </span>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-950 to-transparent">
                <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-1 drop-shadow-md">
                    {player.name}
                </h3>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                        {player.role}
                    </span>
                    {player.battingStyle && (
                        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            {player.battingStyle.split('-')[0]}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
