"use client";

import { useState, useEffect } from "react";
import { getPointsTableBySeason, updatePointsTableEntry, initializePointsTable, PointsTableEntry } from "@/lib/services/pointsTableService";
import { getAllSeasons } from "@/lib/services/teamSeasonService";
import { getAllTeams } from "@/lib/services/teamSeasonService";
import { Season } from "@/lib/types";
import { Edit, Save, X, RefreshCw } from "lucide-react";

export default function AdminPointsTablePage() {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState("");
    const [pointsTable, setPointsTable] = useState<PointsTableEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<PointsTableEntry>>({});

    useEffect(() => {
        const fetchSeasons = async () => {
            const fetchedSeasons = await getAllSeasons();
            setSeasons(fetchedSeasons);
            if (fetchedSeasons.length > 0) {
                const current = fetchedSeasons.find(s => s.isCurrent) || fetchedSeasons[0];
                setSelectedSeasonId(current.id);
            }
            setLoading(false);
        };
        fetchSeasons();
    }, []);

    useEffect(() => {
        if (selectedSeasonId) {
            fetchPointsTable();
        }
    }, [selectedSeasonId]);

    const fetchPointsTable = async () => {
        setLoading(true);
        const table = await getPointsTableBySeason(selectedSeasonId);
        setPointsTable(table);
        setLoading(false);
    };

    const handleInitialize = async () => {
        if (!confirm("This will reset the points table for this season. Are you sure?")) return;

        try {
            console.log("Initializing points table for season:", selectedSeasonId);

            const teams = await getAllTeams();
            console.log("All teams fetched:", teams);

            const seasonTeams = teams.filter(t => t.seasonId === selectedSeasonId);
            console.log("Teams for selected season:", seasonTeams);

            if (seasonTeams.length === 0) {
                alert(`No teams found for this season. Please add teams first.`);
                return;
            }

            const success = await initializePointsTable(
                selectedSeasonId,
                seasonTeams.map(t => ({ id: t.id, name: t.name }))
            );

            console.log("Initialize result:", success);

            if (success) {
                await fetchPointsTable();
                alert("Points table initialized successfully!");
            } else {
                alert("Failed to initialize points table. Check console for errors.");
            }
        } catch (error) {
            console.error("Error in handleInitialize:", error);
            alert("An error occurred while initializing the points table.");
        }
    };

    const handleEdit = (entry: PointsTableEntry) => {
        setEditingId(entry.id);
        setEditForm(entry);
    };

    const handleSave = async () => {
        if (!editingId) return;

        const success = await updatePointsTableEntry(editingId, editForm);
        if (success) {
            await fetchPointsTable();
            setEditingId(null);
            setEditForm({});
        } else {
            alert("Failed to update entry");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 p-8 pt-24 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-display text-white">Points Table Editor</h1>
                    <div className="flex items-center gap-4">
                        <select
                            value={selectedSeasonId}
                            onChange={(e) => setSelectedSeasonId(e.target.value)}
                            className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                        >
                            {seasons.map(season => (
                                <option key={season.id} value={season.id}>
                                    {season.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleInitialize}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <RefreshCw size={18} /> Initialize Table
                        </button>
                    </div>
                </div>

                {pointsTable.length === 0 ? (
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-12 text-center">
                        <p className="text-gray-400 text-lg mb-4">No points table found for this season.</p>
                        <button
                            onClick={handleInitialize}
                            className="bg-primary text-black font-bold px-6 py-3 rounded-lg hover:brightness-110"
                        >
                            Initialize Points Table
                        </button>
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-800 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-gray-400 font-semibold uppercase text-sm">Pos</th>
                                        <th className="px-6 py-4 text-left text-gray-400 font-semibold uppercase text-sm">Team</th>
                                        <th className="px-6 py-4 text-center text-gray-400 font-semibold uppercase text-sm">P</th>
                                        <th className="px-6 py-4 text-center text-gray-400 font-semibold uppercase text-sm">W</th>
                                        <th className="px-6 py-4 text-center text-gray-400 font-semibold uppercase text-sm">L</th>
                                        <th className="px-6 py-4 text-center text-gray-400 font-semibold uppercase text-sm">T</th>
                                        <th className="px-6 py-4 text-center text-gray-400 font-semibold uppercase text-sm">NR</th>
                                        <th className="px-6 py-4 text-center text-gray-400 font-semibold uppercase text-sm">Pts</th>
                                        <th className="px-6 py-4 text-center text-gray-400 font-semibold uppercase text-sm">NRR</th>
                                        <th className="px-6 py-4 text-center text-gray-400 font-semibold uppercase text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pointsTable.map((entry) => (
                                        <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5">
                                            {editingId === entry.id ? (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            value={editForm.position || 0}
                                                            onChange={e => setEditForm({ ...editForm, position: parseInt(e.target.value) })}
                                                            className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-white text-center"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-white font-medium">{entry.teamName}</td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            value={editForm.played || 0}
                                                            onChange={e => setEditForm({ ...editForm, played: parseInt(e.target.value) })}
                                                            className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-white text-center"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            value={editForm.won || 0}
                                                            onChange={e => setEditForm({ ...editForm, won: parseInt(e.target.value) })}
                                                            className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-white text-center"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            value={editForm.lost || 0}
                                                            onChange={e => setEditForm({ ...editForm, lost: parseInt(e.target.value) })}
                                                            className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-white text-center"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            value={editForm.tied || 0}
                                                            onChange={e => setEditForm({ ...editForm, tied: parseInt(e.target.value) })}
                                                            className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-white text-center"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            value={editForm.noResult || 0}
                                                            onChange={e => setEditForm({ ...editForm, noResult: parseInt(e.target.value) })}
                                                            className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-white text-center"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            value={editForm.points || 0}
                                                            onChange={e => setEditForm({ ...editForm, points: parseInt(e.target.value) })}
                                                            className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-white text-center"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            step="0.001"
                                                            value={editForm.nrr || 0}
                                                            onChange={e => setEditForm({ ...editForm, nrr: parseFloat(e.target.value) })}
                                                            className="w-20 bg-slate-800 border border-white/10 rounded px-2 py-1 text-white text-center"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={handleSave}
                                                                className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded transition-colors"
                                                            >
                                                                <Save size={16} />
                                                            </button>
                                                            <button
                                                                onClick={handleCancel}
                                                                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded transition-colors"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 text-white font-bold">{entry.position}</td>
                                                    <td className="px-6 py-4 text-white font-medium">{entry.teamName}</td>
                                                    <td className="px-6 py-4 text-center text-gray-300">{entry.played}</td>
                                                    <td className="px-6 py-4 text-center text-green-400">{entry.won}</td>
                                                    <td className="px-6 py-4 text-center text-red-400">{entry.lost}</td>
                                                    <td className="px-6 py-4 text-center text-gray-400">{entry.tied}</td>
                                                    <td className="px-6 py-4 text-center text-gray-400">{entry.noResult}</td>
                                                    <td className="px-6 py-4 text-center text-primary font-bold">{entry.points}</td>
                                                    <td className="px-6 py-4 text-center text-white">{entry.nrr.toFixed(3)}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center">
                                                            <button
                                                                onClick={() => handleEdit(entry)}
                                                                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
