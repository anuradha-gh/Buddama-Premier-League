"use client";

import { useState, useEffect } from "react";
import { getAllSeasons } from "@/lib/services/teamSeasonService";
import { getPointsTableBySeason } from "@/lib/services/pointsTableService";
import { Season, PointsTableEntry } from "@/lib/types";
import Image from "next/image";
import { Filter } from "lucide-react";

export default function PointsTablePage() {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
    const [pointsTable, setPointsTable] = useState<PointsTableEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            const fetchedSeasons = await getAllSeasons();
            setSeasons(fetchedSeasons);

            // Default to current season
            const currentSeason = fetchedSeasons.find(s => s.isCurrent) || fetchedSeasons[0];
            if (currentSeason) {
                setSelectedSeasonId(currentSeason.id);
            }
            setLoading(false);
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedSeasonId) return;
            setLoading(true);

            const table = await getPointsTableBySeason(selectedSeasonId);
            setPointsTable(table);
            setLoading(false);
        };

        fetchData();
    }, [selectedSeasonId]);

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <h1 className="font-display text-4xl text-white">POINTS TABLE</h1>

                {/* Season Selector */}
                <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-white/10">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={selectedSeasonId}
                        onChange={(e) => setSelectedSeasonId(e.target.value)}
                        className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
                    >
                        {seasons.map(season => (
                            <option key={season.id} value={season.id} className="bg-slate-900">
                                {season.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-white">
                        <thead className="bg-slate-900/50 uppercase text-xs font-bold text-gray-400 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Pos</th>
                                <th className="px-6 py-4">Team</th>
                                <th className="px-6 py-4 text-center">P</th>
                                <th className="px-6 py-4 text-center">W</th>
                                <th className="px-6 py-4 text-center">L</th>
                                <th className="px-6 py-4 text-center">NRR</th>
                                <th className="px-6 py-4 text-center">Pts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                                        Loading standings...
                                    </td>
                                </tr>
                            ) : pointsTable.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                                        No points table data available for this season.
                                    </td>
                                </tr>
                            ) : (
                                pointsTable.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-400">
                                            {entry.position}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {entry.teamLogo && (
                                                    <div className="relative w-12 h-12 flex-shrink-0">
                                                        <Image
                                                            src={entry.teamLogo}
                                                            alt={entry.teamName}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <span className="font-bold">{entry.teamName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">{entry.played}</td>
                                        <td className="px-6 py-4 text-center text-green-400">{entry.won}</td>
                                        <td className="px-6 py-4 text-center text-red-400">{entry.lost}</td>
                                        <td className="px-6 py-4 text-center font-mono text-sm">{entry.nrr.toFixed(3)}</td>
                                        <td className="px-6 py-4 text-center font-bold text-xl text-primary">{entry.points}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
