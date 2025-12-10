import { Match } from "./types";

/**
 * Converts overs (e.g., 14.2) to decimal overs (e.g., 14.3333).
 * The decimal part represents balls, not a fraction of 10.
 * 
 * @param overs - The overs value (e.g., 14.2)
 * @param ballsPerOver - The number of balls in an over (default: 6)
 * @returns The decimal representation (e.g., 14.3333)
 */
export const convertOvers = (overs: number, ballsPerOver: number = 6): number => {
    const wholeOvers = Math.floor(overs);
    const balls = Math.round((overs - wholeOvers) * 10);
    return wholeOvers + (balls / ballsPerOver);
};

/**
 * Calculates the Net Run Rate (NRR) for a team across a season.
 * 
 * NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)
 * 
 * Rules:
 * 1. If a team is "All Out" (10 wickets), the overs faced is considered as the full quota (e.g., 20 or 50).
 * 2. For DLS matches, the "Runs For" is calculated using the target score - 1.
 * 
 * @param teamId - The ID of the team to calculate NRR for.
 * @param matches - Array of completed matches for the season involving this team.
 * @returns The calculated NRR formatted to 3 decimal places.
 */
export const calculateSeasonNRR = (teamId: string, matches: Match[]): string => {
    let totalRunsScored = 0;
    let totalOversFaced = 0;
    let totalRunsConceded = 0;
    let totalOversBowled = 0;

    matches.forEach(match => {
        if (match.status !== 'Completed' || !match.score) return;

        const isTeamA = match.teamAId === teamId;
        const isTeamB = match.teamBId === teamId;

        if (!isTeamA && !isTeamB) return; // Match doesn't involve this team

        // Determine Team Stats
        const teamScore = isTeamA ? match.score.teamA : match.score.teamB;
        const opponentScore = isTeamA ? match.score.teamB : match.score.teamA;

        // Default to 6 if not specified
        const ballsPerOver = match.ballsPerOver || 6;

        // --- Batting Side (Runs For / Overs Faced) ---

        let runsScored = teamScore.runs;
        // Check if this team was chasing (batting second) in a DLS match
        const isChasing = match.battingFirstId && match.battingFirstId !== teamId;

        if (match.method === 'DLS' && match.targetScore && isChasing) {
            runsScored = match.targetScore - 1;
        }

        totalRunsScored += runsScored;

        // All Out Rule for Overs Faced
        if (teamScore.wickets >= 10) {
            totalOversFaced += match.totalOvers;
        } else {
            totalOversFaced += convertOvers(teamScore.overs, ballsPerOver);
        }


        // --- Bowling Side (Runs Conceded / Overs Bowled) ---

        totalRunsConceded += opponentScore.runs;

        // All Out Rule for Overs Bowled (Opponent All Out)
        if (opponentScore.wickets >= 10) {
            totalOversBowled += match.totalOvers;
        } else {
            totalOversBowled += convertOvers(opponentScore.overs, ballsPerOver);
        }
    });

    // Calculate NRR
    let runsPerOverFor = 0;
    if (totalOversFaced > 0) {
        runsPerOverFor = totalRunsScored / totalOversFaced;
    }

    let runsPerOverAgainst = 0;
    if (totalOversBowled > 0) {
        runsPerOverAgainst = totalRunsConceded / totalOversBowled;
    }

    const nrr = runsPerOverFor - runsPerOverAgainst;

    // Return formatted to 3 decimal places
    return nrr.toFixed(3);
};
