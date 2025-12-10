"use client";

import { useState, useEffect } from "react";
import { MatchState, BallEvent, ExtrasType, WicketType, Player, Team } from "@/lib/types";
import { processBall, generateCommentary } from "@/lib/scoring";
import { addCommentary } from "@/lib/services/matchService";
import WicketModal from "./WicketModal";
import BowlerSelectModal from "./BowlerSelectModal";
import InitialPlayerSelectModal from "./InitialPlayerSelectModal";
import { Undo } from "lucide-react";

// Helper to calculate CRR
const calculateCRR = (runs: number, overs: number, ballsPerOver: number = 6) => {
    if (overs === 0) return 0;
    // Convert 10.2 to 10.333 for calculation
    const totalOvers = Math.floor(overs) + (overs % 1) * 10 / ballsPerOver;
    return (runs / totalOvers).toFixed(2);
};

interface ScoringConsoleProps {
    matchId: string;
    initialState: MatchState;
    onStateUpdate: (newState: MatchState) => void;
    battingTeam: Team;
    bowlingTeam: Team;
    battingTeamPlayers: Player[];
    bowlingTeamPlayers: Player[];
    ballsPerOver?: number;
}

export default function ScoringConsole({
    matchId,
    initialState,
    onStateUpdate,
    battingTeam,
    bowlingTeam,
    battingTeamPlayers,
    bowlingTeamPlayers,
    ballsPerOver = 6
}: ScoringConsoleProps) {
    const [matchState, setMatchState] = useState<MatchState>(initialState);
    const [history, setHistory] = useState<MatchState[]>([]);
    const [selectedExtras, setSelectedExtras] = useState<ExtrasType>("None");
    const [isWicketModalOpen, setIsWicketModalOpen] = useState(false);
    const [isBowlerModalOpen, setIsBowlerModalOpen] = useState(false);

    // Sync local state with prop updates if needed (optional, but good for external resets)
    useEffect(() => {
        setMatchState(initialState);
    }, [initialState]);

    // Derived Data
    const striker = battingTeamPlayers.find(p => p.id === matchState.strikerId);
    const nonStriker = battingTeamPlayers.find(p => p.id === matchState.nonStrikerId);
    const bowler = bowlingTeamPlayers.find(p => p.id === matchState.currentBowlerId);

    // Available batsmen for next wicket (excluding current and dismissed)
    const availableBatsmen = battingTeamPlayers.filter(p =>
        p.id !== matchState.strikerId &&
        p.id !== matchState.nonStrikerId &&
        !matchState.dismissedPlayers.includes(p.id)
    );

    // Available bowlers (everyone from bowling team)
    const availableBowlers = bowlingTeamPlayers;

    const handleScore = (runs: number) => {
        const event: BallEvent = {
            runsScored: runs,
            extrasType: selectedExtras,
            extrasRuns: 0, // Simplified: extra runs are calculated in processBall based on type
            isWicket: false
        };

        // Generate Commentary
        if (bowler && striker) {
            const commentary = generateCommentary(bowler.name, striker.name, event);
            addCommentary(matchState.matchId, commentary);
        }

        // Push current state to history before updating
        setHistory([...history, matchState]);

        const newState = processBall(matchState, event, ballsPerOver);

        // Check for End of Over
        if (newState.ballsBowledInOver === 0 && newState.overs > 0) {
            setIsBowlerModalOpen(true);
        }

        setMatchState(newState);
        onStateUpdate(newState);
        setSelectedExtras("None"); // Reset extras selection
    };

    const handleWicketClick = () => {
        setIsWicketModalOpen(true);
    };

    const confirmWicket = (wicketType: WicketType, newBatsmanId: string, dismissedPlayerId?: string) => {
        const actualDismissedId = dismissedPlayerId || matchState.strikerId;

        const event: BallEvent = {
            runsScored: 0,
            extrasType: selectedExtras,
            extrasRuns: 0,
            isWicket: true,
            wicketType: wicketType,
            playerDismissedId: actualDismissedId
        };

        // Generate Commentary
        if (bowler && striker) {
            let commentaryText = "";
            if (wicketType === 'RunOut') {
                const outPlayer = actualDismissedId === striker.id ? striker : nonStriker;
                commentaryText = `RUN OUT! ${outPlayer?.name} is out.`;
            } else {
                commentaryText = generateCommentary(bowler.name, striker.name, event);
            }
            addCommentary(matchState.matchId, commentaryText);
        }

        setHistory([...history, matchState]);

        const newState = processBall(matchState, event, ballsPerOver);

        // MCC Law 2025: New batter takes strike for Caught dismissals (unless end of over).
        // processBall handles end-of-over rotation. We just need to put the new batter 
        // in the slot vacated by the dismissed player.

        if (newState.strikerId === actualDismissedId) {
            newState.strikerId = newBatsmanId;
        } else if (newState.nonStrikerId === actualDismissedId) {
            newState.nonStrikerId = newBatsmanId;
        }

        // Check for End of Over
        if (newState.ballsBowledInOver === 0 && newState.overs > 0) {
            setIsBowlerModalOpen(true);
        }

        setMatchState(newState);
        onStateUpdate(newState);
        setIsWicketModalOpen(false);
        setSelectedExtras("None");
    };

    // ... (rest of the file)

    return (
        // ... (rest of JSX)
        <WicketModal
            isOpen={isWicketModalOpen}
            onClose={() => setIsWicketModalOpen(false)}
            onConfirm={confirmWicket}
            availableBatsmen={availableBatsmen}
            striker={striker}
            nonStriker={nonStriker}
        />
        // ...
    );

    const handleUndo = () => {
        if (history.length === 0) return;
        const previousState = history[history.length - 1];
        setMatchState(previousState);
        onStateUpdate(previousState);
        setHistory(history.slice(0, -1));
    };

    const handleBowlerSelect = (bowlerId: string) => {
        const newState = { ...matchState };
        newState.currentBowlerId = bowlerId;
        setMatchState(newState);
        onStateUpdate(newState);
        setIsBowlerModalOpen(false);

        // Optional: Add commentary for new bowler
        const newBowler = bowlingTeamPlayers.find(p => p.id === bowlerId);
        if (newBowler) {
            addCommentary(matchState.matchId, `New bowler: ${newBowler.name} comes into the attack.`);
        }
    };

    const handleInitialPlayerSelect = (strikerId: string, nonStrikerId: string, bowlerId: string) => {
        const newState = { ...matchState };
        newState.strikerId = strikerId;
        newState.nonStrikerId = nonStrikerId;
        newState.currentBowlerId = bowlerId;
        setMatchState(newState);
        onStateUpdate(newState);

        // Add commentary
        const striker = battingTeamPlayers.find(p => p.id === strikerId);
        const bowler = bowlingTeamPlayers.find(p => p.id === bowlerId);
        if (striker && bowler) {
            addCommentary(matchState.matchId, `Match started. ${striker.name} on strike. ${bowler.name} to open the bowling.`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {/* Header: Scoreboard */}
            <div className="bg-slate-800 p-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-gray-400 text-sm uppercase tracking-wider">{battingTeam?.name} vs {bowlingTeam?.name}</h2>
                        <div className="flex items-baseline gap-4 mt-1">
                            <span className="text-5xl font-display text-white">
                                {matchState.score.totalRuns}/{matchState.score.wickets}
                            </span>
                            <span className="text-xl text-gray-400">
                                ({matchState.overs} ov)
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400 uppercase">CRR</div>
                        <div className="text-2xl font-bold text-primary">
                            {calculateCRR(matchState.score.totalRuns, matchState.overs, ballsPerOver)}
                        </div>
                    </div>
                </div>

                {/* This Over */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 uppercase">This Over:</span>
                    <div className="flex gap-2">
                        {matchState.thisOver.map((ball, idx) => (
                            <span key={idx} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white font-bold text-sm border border-white/10">
                                {ball}
                            </span>
                        ))}
                        {matchState.thisOver.length === 0 && <span className="text-gray-600 text-sm italic">New over</span>}
                    </div>
                </div>
            </div>

            {/* Batsmen & Bowler Area */}
            <div className="grid grid-cols-2 divide-x divide-white/5 bg-slate-800/50">
                <div className="p-4">
                    <div className="text-xs text-gray-500 uppercase mb-2">Batting</div>
                    <div className={`flex justify-between items-center p-2 rounded ${matchState.strikerId === striker?.id ? 'bg-primary/10 border border-primary/20' : ''}`}>
                        <span className={`font-bold ${matchState.strikerId === striker?.id ? 'text-primary' : 'text-white'}`}>
                            {striker?.name} *
                        </span>
                        <span className="text-xs text-gray-400">{striker?.role}</span>
                    </div>
                    <div className={`flex justify-between items-center p-2 rounded ${matchState.nonStrikerId === nonStriker?.id ? 'bg-primary/10 border border-primary/20' : ''}`}>
                        <span className={`font-bold ${matchState.nonStrikerId === nonStriker?.id ? 'text-primary' : 'text-gray-300'}`}>
                            {nonStriker?.name}
                        </span>
                        <span className="text-xs text-gray-400">{nonStriker?.role}</span>
                    </div>
                </div>
                <div className="p-4">
                    <div className="text-xs text-gray-500 uppercase mb-2">Bowling</div>
                    <div className="flex justify-between items-center p-2">
                        <span className="text-white font-bold">{bowler?.name}</span>
                        <span className="text-xs text-gray-400">{bowler?.bowlingStyle}</span>
                    </div>
                </div>
            </div>

            {/* Controls Grid */}
            <div className="p-6 bg-slate-950">
                {/* Extras Row */}
                <div className="flex gap-4 mb-6 justify-center">
                    {(['Wide', 'NoBall', 'Bye', 'LegBye'] as ExtrasType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedExtras(selectedExtras === type ? "None" : type)}
                            className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${selectedExtras === type
                                ? 'bg-yellow-500 text-black border-yellow-500'
                                : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
                                }`}
                        >
                            {type === 'NoBall' ? 'NB' : type === 'LegBye' ? 'LB' : type === 'Wide' ? 'WD' : 'B'}
                        </button>
                    ))}
                </div>

                {/* Main Run Buttons */}
                <div className="grid grid-cols-4 gap-4 mb-6 max-w-lg mx-auto">
                    {[0, 1, 2, 3, 4, 6].map((run) => (
                        <button
                            key={run}
                            onClick={() => handleScore(run)}
                            className={`h-20 rounded-2xl text-3xl font-display font-bold transition-transform active:scale-95 ${run === 4
                                ? 'bg-blue-600 text-white col-span-2'
                                : run === 6
                                    ? 'bg-purple-600 text-white col-span-2'
                                    : 'bg-slate-800 text-white hover:bg-slate-700'
                                }`}
                        >
                            {run === 0 ? '•' : run}
                        </button>
                    ))}
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-4 justify-center items-center pt-4 border-t border-white/10">
                    <button
                        onClick={handleUndo}
                        disabled={history.length === 0}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Undo size={20} /> Undo
                    </button>

                    <button
                        onClick={handleWicketClick}
                        className="flex-1 max-w-xs bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-wide transition-colors shadow-lg shadow-red-900/20"
                    >
                        OUT
                    </button>
                </div>
            </div>

            <WicketModal
                isOpen={isWicketModalOpen}
                onClose={() => setIsWicketModalOpen(false)}
                onConfirm={confirmWicket}
                availableBatsmen={availableBatsmen}
                striker={striker}
                nonStriker={nonStriker}
            />

            <BowlerSelectModal
                isOpen={isBowlerModalOpen}
                onClose={() => { }} // Prevent closing without selection
                onSelect={handleBowlerSelect}
                availableBowlers={availableBowlers}
                currentBowlerId={matchState.currentBowlerId}
            />

            <InitialPlayerSelectModal
                isOpen={!matchState.strikerId || !matchState.nonStrikerId || !matchState.currentBowlerId}
                battingTeam={battingTeam}
                bowlingTeam={bowlingTeam}
                battingTeamPlayers={battingTeamPlayers}
                bowlingTeamPlayers={bowlingTeamPlayers}
                onConfirm={handleInitialPlayerSelect}
            />
        </div>
    );
}
