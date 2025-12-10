import { createMatch, updateMatch, getTeamSeasonStats, initializeTeamStats, createSeason } from "../lib/mockDb";
import { updatePointsTable } from "../lib/statsEngine";
import { Match, TeamSeasonStats } from "../lib/types";

async function runVerification() {
    console.log("--- Starting Points Table Integration Verification ---");

    // 1. Setup: Create two seasons
    const seasonA = await createSeason({ name: "Season A", isCurrent: true });
    const seasonB = await createSeason({ name: "Season B", isCurrent: false });
    console.log(`Created Seasons: ${seasonA.name} (${seasonA.id}), ${seasonB.name} (${seasonB.id})`);

    // 2. Setup: Initialize stats for a team in both seasons
    const teamId = "team-1"; // Using existing team
    await initializeTeamStats(seasonA.id, teamId);
    await initializeTeamStats(seasonB.id, teamId);
    console.log(`Initialized stats for ${teamId} in both seasons.`);

    // 3. Create and Complete a Match in Season A
    const matchA = await createMatch({
        seasonId: seasonA.id,
        teamAId: teamId,
        teamBId: "team-2",
        status: "Scheduled"
    });

    // Simulate Match Completion (Team 1 Wins)
    await updateMatch(matchA.id, {
        status: "Completed",
        score: {
            teamA: { runs: 200, wickets: 5, overs: 20 },
            teamB: { runs: 150, wickets: 10, overs: 18 }
        }
    });
    console.log(`Completed Match in Season A: ${matchA.id}`);

    // 4. Trigger Points Table Update for Season A
    console.log("Updating Points Table for Season A...");
    await updatePointsTable(seasonA.id);

    // 5. Verify Season A Stats
    const statsA = await getTeamSeasonStats(seasonA.id);
    const teamStatsA = statsA.find(s => s.teamId === teamId);

    if (teamStatsA && teamStatsA.played === 1 && teamStatsA.points === 2) {
        console.log("✅ Season A Stats Updated Correctly: Played 1, Points 2");
    } else {
        console.error("❌ Season A Stats Incorrect:", teamStatsA);
    }

    // 6. Verify Season B Stats (Should be 0)
    const statsB = await getTeamSeasonStats(seasonB.id);
    const teamStatsB = statsB.find(s => s.teamId === teamId);

    if (teamStatsB && teamStatsB.played === 0 && teamStatsB.points === 0) {
        console.log("✅ Season B Stats Unchanged (Isolated): Played 0, Points 0");
    } else {
        console.error("❌ Season B Stats Incorrectly Modified:", teamStatsB);
    }

    console.log("--- Verification Complete ---");
}

runVerification();
