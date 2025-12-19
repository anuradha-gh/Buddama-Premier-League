import PlayerCard from "@/components/PlayerCard";
import { getAllTeams, getTeamById } from "@/lib/services/teamSeasonService";
import { getPlayersByTeamId } from "@/lib/services/playerService";
import Image from "next/image";
import { notFound } from "next/navigation";

interface TeamDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate static params for all teams
export async function generateStaticParams() {
    const teams = await getAllTeams();
    return teams.map((team) => ({
        id: team.id,
    }));
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
    const { id } = await params;
    const team = await getTeamById(id);

    if (!team) {
        notFound();
    }

    const teamPlayers = await getPlayersByTeamId(team.id);

    // Group players by role
    const batters = teamPlayers.filter(p => p.role === 'Batter');
    const allRounders = teamPlayers.filter(p => p.role === 'All Rounder');
    const bowlers = teamPlayers.filter(p => p.role === 'Bowler');
    const wicketKeepers = teamPlayers.filter(p => p.role === 'Wicket Keeper');

    return (
        <div className="min-h-screen pb-12 bg-slate-950">
            {/* Hero Header */}
            <div className="relative h-[500px] overflow-hidden">
                {/* Background with Team Color Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800">
                    <div
                        className="absolute top-0 right-0 w-2/3 h-full opacity-20 blur-3xl"
                        style={{ background: `radial-gradient(circle at center, ${team.primaryColor}, transparent 70%)` }}
                    />
                </div>

                <div className="container mx-auto px-4 h-full relative z-10 flex flex-col md:flex-row items-center justify-between">
                    {/* Left: Floating Logo */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 animate-float">
                        <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl transform scale-90" />
                        <Image
                            src={team.logoUrl}
                            alt={team.name}
                            fill
                            className="object-contain drop-shadow-2xl"
                            unoptimized
                        />
                    </div>

                    {/* Center/Right: Team Info */}
                    <div className="flex-1 md:ml-12 text-center md:text-left mt-8 md:mt-0">
                        <h1 className="font-display text-6xl md:text-8xl text-white tracking-wider mb-2 uppercase drop-shadow-lg">
                            {team.name}
                        </h1>

                        {/* Championship Years */}
                        {team.championshipYears && team.championshipYears.length > 0 && (
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                                <span className="text-2xl">🏆</span>
                                <div className="flex gap-2">
                                    {team.championshipYears.map(year => (
                                        <span key={year} className="text-yellow-400 font-display text-2xl tracking-wide">
                                            {year}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Key Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Coach</p>
                                <p className="text-white font-bold text-lg">{team.coach || 'TBA'}</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Home Venue</p>
                                <p className="text-white font-bold text-lg">{team.homeVenue || 'TBA'}</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Owner</p>
                                <p className="text-white font-bold text-lg">{team.owner || 'TBA'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Squad Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center gap-4 mb-12">
                    <h2 className="font-display text-4xl text-white tracking-wide">SQUAD</h2>
                    <div className="h-1 flex-1 bg-gradient-to-r from-primary to-transparent opacity-50" />
                </div>

                <div className="space-y-16">
                    {/* Batters Section */}
                    {batters.length > 0 && (
                        <section>
                            <h3 className="font-display text-2xl text-gray-400 mb-6 pl-4 border-l-4 border-primary">Batters</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {batters.map(player => (
                                    <PlayerCard key={player.id} player={player} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Wicket Keepers Section */}
                    {wicketKeepers.length > 0 && (
                        <section>
                            <h3 className="font-display text-2xl text-gray-400 mb-6 pl-4 border-l-4 border-blue-500">Wicket Keepers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {wicketKeepers.map(player => (
                                    <PlayerCard key={player.id} player={player} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* All Rounders Section */}
                    {allRounders.length > 0 && (
                        <section>
                            <h3 className="font-display text-2xl text-gray-400 mb-6 pl-4 border-l-4 border-purple-500">All Rounders</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {allRounders.map(player => (
                                    <PlayerCard key={player.id} player={player} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Bowlers Section */}
                    {bowlers.length > 0 && (
                        <section>
                            <h3 className="font-display text-2xl text-gray-400 mb-6 pl-4 border-l-4 border-red-500">Bowlers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {bowlers.map(player => (
                                    <PlayerCard key={player.id} player={player} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {teamPlayers.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl italic">Squad details coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
