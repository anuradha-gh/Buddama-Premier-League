import { Team } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface TeamCardProps {
    team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
    return (
        <Link href={`/teams/${team.id}`} className="block group">
            <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] border border-white/5 hover:border-primary/50">
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-slate-800 p-2 border-2 border-white/10 group-hover:border-primary transition-colors">
                    {/* Using a placeholder if logoUrl is external/mock */}
                    <Image
                        src={team.logoUrl}
                        alt={team.name}
                        fill
                        className="object-cover rounded-full"
                        unoptimized // For mock data URLs
                    />
                </div>
                <h3 className="font-display text-2xl tracking-wide text-center group-hover:text-primary transition-colors">
                    {team.name}
                </h3>
            </div>
        </Link>
    );
}
