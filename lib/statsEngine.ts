import { getAllTeams, getMatchesBySeason, getTeamSeasonStats, updateTeamSeasonStats, initializeTeamStats } from "./mockDb";
import { Team, Match, TeamSeasonStats } from "./types";
import { calculateSeasonNRR } from "./nrrCalculator";

export const updatePointsTable = async (seasonId: string) => {
    // 1. Fetch Teams and Matches
    const matches = await getMatchesBySeason(seasonId);
    const completedMatches = matches.filter(m => m.status === 'Completed');

    // Fetch existing stats for the season
    let seasonStats = await getTeamSeasonStats(seasonId);

    // 2. Initialize Stats Map (Resetting logic)
    // Identify all teams involved in this season (via matches or existing stats or team.seasonId)
    const allTeams = await getAllTeams();
    const teamIds = new Set<string>();

    // Add teams explicitly linked to this season
    allTeams.filter(t => t.seasonId === seasonId).forEach(t => teamIds.add(t.id));

    // Add teams that already have stats for this season
    seasonStats.forEach(s => teamIds.add(s.teamId));

    // Add teams involved in matches for this season
    matches.forEach(m => {
        teamIds.add(m.teamAId);
        teamIds.add(m.teamBId);
    });

    // Create a map for easy access and updates
    const statsMap: Record<string, TeamSeasonStats> = {};

    for (const teamId of Array.from(teamIds)) {
        let stats = seasonStats.find(s => s.teamId === teamId);
        if (!stats) {
            stats = await initializeTeamStats(seasonId, teamId);
        }

        // Reset values for recalculation
        statsMap[teamId] = {
            ...stats,
            played: 0,
            won: 0,
            lost: 0,
            tied: 0,
            noResult: 0,
            points: 0,
            nrr: 0,
            runsScored: 0,
            oversFaced: 0,
            runsConceded: 0,
            oversBowled: 0
        };
    }

    // 3. Process Matches for Points
    completedMatches.forEach(match => {
        if (!match.score) return;

        const teamAId = match.teamAId;
        const teamBId = match.teamBId;

        // Ensure stats exist (in case a team was added but not in the initial filter)
        // This handles edge cases where a team might play but not be "in" the season officially yet
        if (!statsMap[teamAId]) return;
        if (!statsMap[teamBId]) return;

        const statsA = statsMap[teamAId];
        const statsB = statsMap[teamBId];

        // Update Played
        statsA.played += 1;
        statsB.played += 1;

        // Update Points & Result
        if (match.score.teamA.runs > match.score.teamB.runs) {
            statsA.won += 1;
            statsA.points += 2;
            statsB.lost += 1;
        } else if (match.score.teamB.runs > match.score.teamA.runs) {
            statsB.won += 1;
            statsB.points += 2;
            statsA.lost += 1;
        } else {
            // Tie (assuming no Super Over logic here for points table yet)
            statsA.tied += 1;
            statsA.points += 1;
            statsB.tied += 1;
            statsB.points += 1;
        }
    });

    // 4. Calculate NRR and Update Map
    for (const teamId in statsMap) {
        const stats = statsMap[teamId];
        const nrrString = calculateSeasonNRR(teamId, completedMatches);
        stats.nrr = parseFloat(nrrString);
    }

    // 5. Save to Database
    const updatedStats: TeamSeasonStats[] = [];
    for (const teamId in statsMap) {
        const stats = statsMap[teamId];
        const updated = await updateTeamSeasonStats(stats.id, stats);
        if (updated) {
            updatedStats.push(updated);
        }
    }

    // Return sorted stats for UI consumption if needed, though usually UI fetches afresh
    return updatedStats.sort((a, b) => {
        const pointsDiff = b.points - a.points;
        if (pointsDiff !== 0) return pointsDiff;
        return b.nrr - a.nrr;
    });
};
