import { Match } from "@/lib/types";
import { mockMatches } from "@/lib/mockData";
import Link from "next/link";

export default function LiveScoreWidget() {
    // In a real app, this would fetch live data.
    // For now, we'll simulate finding a live or scheduled match.
    const liveMatch = mockMatches.find((m) => m.status === "Live") || mockMatches.find((m) => m.status === "Scheduled");

    if (!liveMatch) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-md p-4">
            <div className="glass-card rounded-xl p-4 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary animate-pulse">
                        {liveMatch.status === 'Live' ? '● Live Now' : 'Upcoming Match'}
                    </span>
                    <Link href="/scoring" className="text-xs text-gray-400 hover:text-white transition-colors">
                        View Full Scoreboard &rarr;
                    </Link>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-center">
                        <h3 className="font-display text-xl tracking-wide">COLOMBO</h3>
                        <p className="text-2xl font-bold">145/3</p>
                        <p className="text-xs text-gray-400">15.4 Ov</p>
                    </div>

                    <div className="text-center px-4">
                        <span className="text-sm font-bold text-gray-500">VS</span>
                    </div>

                    <div className="text-center">
                        <h3 className="font-display text-xl tracking-wide">KANDY</h3>
                        <p className="text-2xl font-bold">--/--</p>
                        <p className="text-xs text-gray-400">Yet to Bat</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
