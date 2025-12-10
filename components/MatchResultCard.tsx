import Link from "next/link";
import Image from "next/image";
import { Match, Team } from "@/lib/types";

interface MatchResultCardProps {
    match: Match;
    teamA?: Team;
    teamB?: Team;
}

export default function MatchResultCard({ match, teamA, teamB }: MatchResultCardProps) {
    if (!teamA || !teamB || !match.score) {
        return null; // Or a skeleton/fallback
    }

    const { teamA: scoreA, teamB: scoreB } = match.score;

    return (
        <Link href={`/match-center/${match.id}`} className="block">
            <div className="bg-slate-800 rounded-xl p-6 cursor-pointer hover:scale-[1.02] transition-transform duration-200 border border-white/5 hover:border-white/10 shadow-lg">
                {/* Main Row: Team A - Scores - Team B */}
                <div className="flex items-center justify-between">
                    {/* Team A */}
                    <div className="flex flex-col items-center gap-3 w-1/3">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-slate-700/50 rounded-full p-2">
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

                    {/* Scores */}
                    <div className="flex flex-col items-center justify-center w-1/3">
                        <div className="text-2xl md:text-3xl font-bold text-white whitespace-nowrap">
                            {scoreA.runs}/{scoreA.wickets} <span className="text-gray-500 mx-1">-</span> {scoreB.runs}/{scoreB.wickets}
                        </div>
                        <div className="text-sm text-gray-400 mt-1 font-mono">
                            ({scoreA.overs}) <span className="mx-1">-</span> ({scoreB.overs})
                        </div>
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center gap-3 w-1/3">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-slate-700/50 rounded-full p-2">
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

                {/* Footer: Result & Context */}
                <div className="mt-6 text-center border-t border-white/5 pt-4">
                    <div className="text-blue-400 font-bold text-lg">
                        {match.result || "Match Completed"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                        {match.round} • {match.venue}
                    </div>
                </div>
            </div>
        </Link>
    );
}
