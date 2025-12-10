"use client";

import { useState, useEffect } from "react";
import { Player, Team, PlayerRole } from "@/lib/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { User, Edit, Trash2, Plus, Save, X, Trophy } from "lucide-react";

interface RosterClientProps {
    teamId: string;
}

export default function RosterClient({ teamId }: RosterClientProps) {
    const [team, setTeam] = useState<Team | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditingMeta, setIsEditingMeta] = useState(false);
    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

    // Load team and players on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const { getTeamById } = await import("@/lib/services/teamSeasonService");
            const { getPlayersByTeamId } = await import("@/lib/services/playerService");

            const fetchedTeam = await getTeamById(teamId);

            if (!fetchedTeam) {
                notFound();
            }

            setTeam(fetchedTeam);

            // Fetch players from Firestore
            const fetchedPlayers = await getPlayersByTeamId(teamId);
            setPlayers(fetchedPlayers);

            setLoading(false);
        };

        loadData();
    }, [teamId]);

    // Form States
    const [metaForm, setMetaForm] = useState({
        coach: "",
        owner: "",
        championshipYears: "",
    });

    // Initialize metaForm when team data is loaded
    useEffect(() => {
        if (team) {
            setMetaForm({
                coach: team.coach || "",
                owner: team.owner || "",
                championshipYears: team.championshipYears?.join(", ") || "",
            });
        }
    }, [team]);

    const [playerForm, setPlayerForm] = useState<Partial<Player>>({
        name: "",
        role: "Batter",
        photoUrl: "",
        battingStyle: "Right-hand bat",
        bowlingStyle: "",
        isCaptain: false,
        isOverseas: false,
    });

    // Handlers
    const handleMetaSave = () => {
        if (!team) return;
        const years = metaForm.championshipYears.split(",").map(y => parseInt(y.trim())).filter(y => !isNaN(y));
        setTeam({
            ...team,
            coach: metaForm.coach,
            owner: metaForm.owner,
            championshipYears: years
        });
        setIsEditingMeta(false);
    };

    const handlePlayerSave = async () => {
        if (!playerForm.name || !playerForm.role) return;

        // Validation: Single Captain
        if (playerForm.isCaptain) {
            const existingCaptain = players.find(p => p.isCaptain && p.id !== editingPlayer?.id);
            if (existingCaptain) {
                alert(`Error: ${existingCaptain.name} is already the captain. Please remove their captaincy first.`);
                return;
            }
        }

        try {
            const { createPlayer, updatePlayer } = await import("@/lib/services/playerService");

            if (editingPlayer) {
                // Update existing player
                const updated = await updatePlayer(editingPlayer.id, playerForm);
                if (updated) {
                    setPlayers(players.map(p => p.id === editingPlayer.id ? { ...p, ...playerForm } as Player : p));
                }
            } else {
                // Add new player
                const newPlayerData: Omit<Player, "id"> = {
                    teamId: team?.id || teamId,
                    name: playerForm.name!,
                    role: playerForm.role!,
                    photoUrl: playerForm.photoUrl || "",
                    battingStyle: playerForm.battingStyle || "Right-hand bat",
                    bowlingStyle: playerForm.bowlingStyle || "",
                    isCaptain: playerForm.isCaptain || false,
                    isOverseas: playerForm.isOverseas || false,
                };

                const newPlayer = await createPlayer(newPlayerData);
                if (newPlayer) {
                    setPlayers([...players, newPlayer]);
                }
            }
            closePlayerModal();
        } catch (error) {
            console.error("Error saving player:", error);
            alert("Failed to save player. Please try again.");
        }
    };

    const handleDeletePlayer = async (id: string) => {
        if (confirm("Are you sure you want to delete this player?")) {
            try {
                const { deletePlayer } = await import("@/lib/services/playerService");
                const success = await deletePlayer(id);
                if (success) {
                    setPlayers(players.filter(p => p.id !== id));
                } else {
                    alert("Failed to delete player. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting player:", error);
                alert("Failed to delete player. Please try again.");
            }
        }
    };

    const openPlayerModal = (player?: Player) => {
        if (player) {
            setEditingPlayer(player);
            setPlayerForm(player);
        } else {
            setEditingPlayer(null);
            setPlayerForm({
                name: "",
                role: "Batter",
                photoUrl: "",
                battingStyle: "Right-hand bat",
                bowlingStyle: "",
                isCaptain: false,
                isOverseas: false,
            });
        }
        setIsPlayerModalOpen(true);
    };

    const closePlayerModal = () => {
        setIsPlayerModalOpen(false);
        setEditingPlayer(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 p-8 pt-24 flex items-center justify-center">
                <div className="text-white text-xl">Loading roster...</div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen bg-slate-950 p-8 pt-24 flex items-center justify-center">
                <div className="text-white text-xl">Team not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                {/* Header & Meta Editor */}
                <div className="bg-slate-900 rounded-xl p-6 mb-8 border border-white/10">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 bg-white/5 rounded-full p-4 border border-white/10">
                                <Image src={team.logoUrl} alt={team.name} fill className="object-contain p-2" unoptimized />
                            </div>
                            <div>
                                <h1 className="text-4xl font-display text-white mb-2">{team.name}</h1>
                                <div className="flex gap-4 text-gray-400 text-sm">
                                    <span>Venue: {team.homeVenue}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditingMeta(!isEditingMeta)}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            {isEditingMeta ? <X size={18} /> : <Edit size={18} />}
                            {isEditingMeta ? "Cancel" : "Edit Team Info"}
                        </button>
                    </div>

                    {isEditingMeta ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/20 p-6 rounded-lg">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase mb-1">Coach</label>
                                <input
                                    type="text"
                                    value={metaForm.coach}
                                    onChange={e => setMetaForm({ ...metaForm, coach: e.target.value })}
                                    className="w-full bg-slate-800 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase mb-1">Owner</label>
                                <input
                                    type="text"
                                    value={metaForm.owner}
                                    onChange={e => setMetaForm({ ...metaForm, owner: e.target.value })}
                                    className="w-full bg-slate-800 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase mb-1">Championship Years (comma sep)</label>
                                <input
                                    type="text"
                                    value={metaForm.championshipYears}
                                    onChange={e => setMetaForm({ ...metaForm, championshipYears: e.target.value })}
                                    className="w-full bg-slate-800 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                                    placeholder="e.g. 2021, 2023"
                                />
                            </div>
                            <div className="md:col-span-3 flex justify-end">
                                <button
                                    onClick={handleMetaSave}
                                    className="bg-primary text-black font-bold px-6 py-2 rounded-lg flex items-center gap-2 hover:brightness-110"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500 uppercase mb-1">Coach</p>
                                <p className="text-white font-medium">{team.coach || "Not Set"}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500 uppercase mb-1">Owner</p>
                                <p className="text-white font-medium">{team.owner || "Not Set"}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500 uppercase mb-1">Trophies</p>
                                <div className="flex flex-wrap gap-2">
                                    {team.championshipYears && team.championshipYears.length > 0 ? (
                                        team.championshipYears.map(y => (
                                            <span key={y} className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded text-sm font-bold flex items-center gap-1">
                                                <Trophy size={12} /> {y}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic">None</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Roster Management */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display text-white">Team Roster ({players.length})</h2>
                    <button
                        onClick={() => openPlayerModal()}
                        className="bg-primary text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:brightness-110"
                    >
                        <Plus size={18} /> Add Player
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {players.map(player => (
                        <div key={player.id} className="bg-slate-900 border border-white/10 rounded-lg p-4 flex items-center gap-4 group hover:border-primary/50 transition-colors">
                            <div className="relative w-16 h-16 bg-slate-800 rounded-full overflow-hidden flex-shrink-0">
                                {player.photoUrl ? (
                                    <Image src={player.photoUrl} alt={player.name} fill className="object-cover" unoptimized />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                        <User size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-white font-bold truncate">{player.name}</h3>
                                    {player.isCaptain && <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">C</span>}
                                    {player.role === 'Wicket Keeper' && <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">WK</span>}
                                    {player.isOverseas && <span className="bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">✈️</span>}
                                </div>
                                <p className="text-gray-400 text-sm">{player.role}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openPlayerModal(player)}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded text-white"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeletePlayer(player.id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Player Modal */}
            {isPlayerModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-display text-white">
                                {editingPlayer ? 'Edit Player' : 'Add New Player'}
                            </h3>
                            <button onClick={closePlayerModal} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={playerForm.name}
                                    onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })}
                                    className="w-full bg-slate-800 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                                    <select
                                        value={playerForm.role}
                                        onChange={e => setPlayerForm({ ...playerForm, role: e.target.value as PlayerRole })}
                                        className="w-full bg-slate-800 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                                    >
                                        <option value="Batter">Batter</option>
                                        <option value="Bowler">Bowler</option>
                                        <option value="All Rounder">All Rounder</option>
                                        <option value="Wicket Keeper">Wicket Keeper</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Batting Style</label>
                                    <select
                                        value={playerForm.battingStyle}
                                        onChange={e => setPlayerForm({ ...playerForm, battingStyle: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                                    >
                                        <option value="Right-hand bat">Right-hand bat</option>
                                        <option value="Left-hand bat">Left-hand bat</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Photo URL</label>
                                <input
                                    type="text"
                                    value={playerForm.photoUrl}
                                    onChange={e => setPlayerForm({ ...playerForm, photoUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-slate-800 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                                />
                            </div>

                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={playerForm.isCaptain}
                                        onChange={e => setPlayerForm({ ...playerForm, isCaptain: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-slate-800"
                                    />
                                    <span className="text-white">Is Captain?</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={playerForm.isOverseas}
                                        onChange={e => setPlayerForm({ ...playerForm, isOverseas: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-slate-800"
                                    />
                                    <span className="text-white">Overseas Player?</span>
                                </label>
                            </div>

                            <div className="pt-6 flex justify-end gap-3">
                                <button
                                    onClick={closePlayerModal}
                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePlayerSave}
                                    className="bg-primary text-black font-bold px-6 py-2 rounded-lg hover:brightness-110"
                                >
                                    {editingPlayer ? 'Update Player' : 'Add Player'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
