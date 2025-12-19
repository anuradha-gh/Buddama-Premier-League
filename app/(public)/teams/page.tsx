import TeamCard from "@/components/TeamCard";
import { getAllTeams } from "@/lib/services/teamSeasonService";

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeamsPage() {
    const teams = await getAllTeams();

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="font-display text-5xl text-white mb-8 text-center">Participating Teams</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {teams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                ))}
            </div>
        </div>
    );
}
