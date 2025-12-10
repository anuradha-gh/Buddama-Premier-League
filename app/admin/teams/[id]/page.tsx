"use client";

import { useState, useEffect } from "react";
import { Team, Player } from "@/lib/types";
import { Save, ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PlayerModal from "@/components/admin/PlayerModal";

export default function TeamEditorPage() {
    const params = useParams();
    const router = useRouter();
    const [team, setTeam] = useState<Team | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [seasons, setSeasons] = useState<any[]>([]);

    // Modal State
    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

    useEffect(() => {
        // Fetch seasons for dropdown
        const fetchSeasons = async () => {
            const { getAllSeasons } = await import("@/lib/services/teamSeasonService");
            const fetchedSeasons = await getAllSeasons();
            setSeasons(fetchedSeasons);
        };
        fetchSeasons();

        if (!params?.id) return;

        if (params.id === 'new') {
            setTeam({
                id: 'new',
                name: '',
                shortName: '',
                logoUrl: '',
                primaryColor: '#000000',
                secondaryColor: '#ffffff',
                seasonId: 'season-5',
                homeVenue: '',
                coach: '',
                owner: '',
                championshipYears: []
            });
            setLoading(false);
            return;
        }

        // Fetch team from Firestore
        const fetchTeam = async () => {
            const { getTeamById } = await import("@/lib/services/teamSeasonService");
            const foundTeam = await getTeamById(params.id as string);

            if (foundTeam) {
                setTeam(foundTeam);
                // TODO: Fetch players from Firestore when player service is ready
                // const teamPlayers = await getPlayersByTeamId(params.id);
                // setPlayers(teamPlayers);
            }
            setLoading(false);
        };

        fetchTeam();
    }, [params?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { collection, addDoc, doc, updateDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            if (!db || !team) return;

            const teamData = {
                name: team.name,
                shortName: team.shortName,
                logoUrl: team.logoUrl,
                primaryColor: team.primaryColor,
                secondaryColor: team.secondaryColor,
                seasonId: team.seasonId,
                homeVenue: team.homeVenue,
                coach: team.coach,
                owner: team.owner,
                championshipYears: team.championshipYears
            };

            if (params.id === 'new') {
                // Create New Team
                const docRef = await addDoc(collection(db, 'teams'), teamData);
                alert("Team created successfully!");
                router.push(`/admin/teams/${docRef.id}`);
            } else {
                // Update Existing Team
                await updateDoc(doc(db, 'teams', team.id), teamData);
                alert("Team updated successfully!");
            }
        } catch (error) {
            console.error("Error saving team:", error);
            alert("Failed to save team.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddPlayer = () => {
        setEditingPlayer(null);
        setIsPlayerModalOpen(true);
    };

    const handleEditPlayer = (player: Player) => {
        setEditingPlayer(player);
        setIsPlayerModalOpen(true);
    };

    const handleDeletePlayer = (playerId: string) => {
        if (confirm("Are you sure you want to remove this player?")) {
            setPlayers(players.filter(p => p.id !== playerId));
        }
    };

    const handleSavePlayer = (playerData: Partial<Player>) => {
        if (editingPlayer) {
            // Update existing
            setPlayers(players.map(p => p.id === editingPlayer.id ? { ...p, ...playerData } : p));
        } else {
            // Add new
            const newPlayer: Player = {
                id: `new-${Date.now()}`,
                teamId: team?.id || "",
                ...playerData as any // Type assertion for mock
            };
            setPlayers([...players, newPlayer]);
        }
        setIsPlayerModalOpen(false);
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (!team) return <div className="text-white">Team not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/teams" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-white">{params?.id === 'new' ? 'Create New Team' : 'Edit Team'}</h2>
                    <p className="text-gray-400 mt-1">{team.name || 'Enter team details'}</p>
                </div>
            </div>

            {/* Metadata Form */}
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-white/10 rounded-xl p-8 space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Team Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Team Name</label>
                        <input
                            type="text"
                            value={team.name}
                            onChange={(e) => setTeam({ ...team, name: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Team Logo URL</label>
                        <input
                            type="text"
                            value={team.logoUrl}
                            onChange={(e) => setTeam({ ...team, logoUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Short Name (3 chars)</label>
                        <input
                            type="text"
                            value={team.shortName}
                            onChange={(e) => setTeam({ ...team, shortName: e.target.value })}
                            maxLength={3}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Season</label>
                        <select
                            value={team.seasonId}
                            onChange={(e) => setTeam({ ...team, seasonId: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="">Select Season</option>
                            {seasons.map(season => (
                                <option key={season.id} value={season.id}>
                                    {season.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Coach</label>
                        <input
                            type="text"
                            value={team.coach}
                            onChange={(e) => setTeam({ ...team, coach: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Owner</label>
                        <input
                            type="text"
                            value={team.owner}
                            onChange={(e) => setTeam({ ...team, owner: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Home Venue</label>
                        <input
                            type="text"
                            value={team.homeVenue}
                            onChange={(e) => setTeam({ ...team, homeVenue: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Primary Color</label>
                        <div className="flex gap-4">
                            <input
                                type="color"
                                value={team.primaryColor}
                                onChange={(e) => setTeam({ ...team, primaryColor: e.target.value })}
                                className="h-12 w-20 bg-transparent cursor-pointer"
                            />
                            <input
                                type="text"
                                value={team.primaryColor}
                                onChange={(e) => setTeam({ ...team, primaryColor: e.target.value })}
                                className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Championship Years (comma separated)</label>
                    <input
                        type="text"
                        value={team.championshipYears.join(", ")}
                        onChange={(e) => setTeam({ ...team, championshipYears: e.target.value.split(",").map(y => Number(y.trim())).filter(n => !isNaN(n)) })}
                        placeholder="e.g. 2023, 2024"
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
                    >
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>
            </form>

            {/* Roster Management */}
            <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white">Current Squad</h3>
                    <button
                        onClick={handleAddPlayer}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Add Player
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Player</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Batting Style</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {players.map((player) => (
                                <tr key={player.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                                                {player.photoUrl ? (
                                                    <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-bold text-gray-500">{player.name.substring(0, 2).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white flex items-center gap-2">
                                                    {player.name}
                                                    {player.isCaptain && (
                                                        <span className="text-xs bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30" title="Captain">©</span>
                                                    )}
                                                    {player.isOverseas && (
                                                        <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30" title="Overseas">✈️</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">{player.bowlingStyle}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{player.role}</td>
                                    <td className="px-6 py-4 text-gray-300">{player.battingStyle}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEditPlayer(player)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePlayer(player.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {players.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No players found. Add players to build the squad.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PlayerModal
                isOpen={isPlayerModalOpen}
                onClose={() => setIsPlayerModalOpen(false)}
                onSave={handleSavePlayer}
                player={editingPlayer}
            />
        </div>
    );
}
