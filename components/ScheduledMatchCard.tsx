import Image from "next/image";
import { Match, Team } from "@/lib/types";
import { Calendar, MapPin } from "lucide-react";

interface ScheduledMatchCardProps {
    match: Match;
    teamA?: Team;
    teamB?: Team;
}

export default function ScheduledMatchCard({ match, teamA, teamB }: ScheduledMatchCardProps) {
    if (!teamA || !teamB) {
        return null;
    }

    const matchDate = new Date(match.date);
    const dateString = matchDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const timeString = matchDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-white/5 shadow-lg relative overflow-hidden group">
            {/* Background Pattern / Decoration (Optional) */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Main Row: Team A - VS - Team B */}
            <div className="flex items-center justify-between relative z-10">
                {/* Team A */}
                <div className="flex flex-col items-center gap-3 w-1/3">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-slate-700/50 rounded-full p-2 group-hover:scale-105 transition-transform duration-300">
                        <Image
                            src={teamA.logoUrl}
                            alt={teamA.name}
                            fill
                            className="object-cover rounded-full"
                            unoptimized
                        />
                    </div>
                    <span className="text-white font-bold text-center text-sm md:text-base leading-tight">
                        {teamA.name}
                    </span>
                </div>

                {/* VS Graphic */}
                <div className="flex flex-col items-center justify-center w-1/3">
                    <div className="text-4xl md:text-5xl font-black text-white/10 italic select-none">
                        VS
                    </div>
                </div>

                {/* Team B */}
                <div className="flex flex-col items-center gap-3 w-1/3">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-slate-700/50 rounded-full p-2 group-hover:scale-105 transition-transform duration-300">
                        <Image
                            src={teamB.logoUrl}
                            alt={teamB.name}
                            fill
                            className="object-cover rounded-full"
                            unoptimized
                        />
                    </div>
                    <span className="text-white font-bold text-center text-sm md:text-base leading-tight">
                        {teamB.name}
                    </span>
                </div>
            </div>

            {/* Footer: Date, Time & Venue */}
            <div className="mt-6 pt-4 border-t border-white/5 flex flex-col items-center gap-2 text-center relative z-10">
                <div className="flex items-center gap-2 text-primary font-bold text-lg">
                    <Calendar className="w-4 h-4 text-white" />
                    <span>{dateString} • {timeString}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    <span>{match.venue}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                    {match.round}
                </div>
            </div>
        </div>
    );
}
