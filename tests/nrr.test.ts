import { calculateSeasonNRR, convertOvers } from "../lib/nrrCalculator";
import { Match } from "../lib/types";

// Mock Data for South Africa 1999 World Cup Scenario
const matches: Match[] = [
    {
        id: 'm1',
        seasonId: 's1',
        teamAId: 'SA',
        teamBId: 'IND',
        date: '1999-05-15',
        status: 'Completed',
        round: 'Group Stage',
        venue: 'Hove',
        currentOver: 50,
        totalOvers: 50,
        score: {
            teamA: { runs: 254, wickets: 6, overs: 47.2 }, // SA
            teamB: { runs: 253, wickets: 5, overs: 50 }    // IND
        }
    },
    {
        id: 'm2',
        seasonId: 's1',
        teamAId: 'SA',
        teamBId: 'SL',
        date: '1999-05-19',
        status: 'Completed',
        round: 'Group Stage',
        venue: 'Northampton',
        currentOver: 50,
        totalOvers: 50,
        score: {
            teamA: { runs: 199, wickets: 9, overs: 50 },   // SA
            teamB: { runs: 110, wickets: 10, overs: 35.2 } // SL (All Out)
        }
    },
    {
        id: 'm3',
        seasonId: 's1',
        teamAId: 'SA',
        teamBId: 'ENG',
        date: '1999-05-22',
        status: 'Completed',
        round: 'Group Stage',
        venue: 'The Oval',
        currentOver: 50,
        totalOvers: 50,
        score: {
            teamA: { runs: 225, wickets: 7, overs: 50 },   // SA
            teamB: { runs: 103, wickets: 10, overs: 41 }   // ENG (All Out)
        }
    }
];

console.log("--- NRR Verification: South Africa 1999 WC ---");

// Calculate NRR for SA
const nrr = calculateSeasonNRR('SA', matches);

// Manual Verification Steps (Logged for clarity)
let totalRunsFor = 0;
let totalOversFor = 0;
let totalRunsAgainst = 0;
let totalOversAgainst = 0;

matches.forEach((match, index) => {
    const isSA = match.teamAId === 'SA';
    const saScore = isSA ? match.score!.teamA : match.score!.teamB;
    const oppScore = isSA ? match.score!.teamB : match.score!.teamA;

    console.log(`\nMatch ${index + 1}: vs ${isSA ? match.teamBId : match.teamAId}`);

    // Runs For
    totalRunsFor += saScore.runs;

    // Overs For
    let oversFor = 0;
    if (saScore.wickets >= 10) {
        oversFor = match.totalOvers;
        console.log(`  SA Batting: ${saScore.runs}/${saScore.wickets} in ${saScore.overs} ov -> All Out Rule: ${match.totalOvers} ov`);
    } else {
        oversFor = convertOvers(saScore.overs);
        console.log(`  SA Batting: ${saScore.runs}/${saScore.wickets} in ${saScore.overs} ov -> Actual: ${oversFor.toFixed(3)} ov`);
    }
    totalOversFor += oversFor;

    // Runs Against
    totalRunsAgainst += oppScore.runs;

    // Overs Against
    let oversAgainst = 0;
    if (oppScore.wickets >= 10) {
        oversAgainst = match.totalOvers;
        console.log(`  SA Bowling: ${oppScore.runs}/${oppScore.wickets} in ${oppScore.overs} ov -> All Out Rule: ${match.totalOvers} ov`);
    } else {
        oversAgainst = convertOvers(oppScore.overs);
        console.log(`  SA Bowling: ${oppScore.runs}/${oppScore.wickets} in ${oppScore.overs} ov -> Actual: ${oversAgainst.toFixed(3)} ov`);
    }
    totalOversAgainst += oversAgainst;
});

console.log("\n--- Totals ---");
console.log(`Runs For: ${totalRunsFor} (Expected: 678)`);
console.log(`Overs For: ${totalOversFor.toFixed(3)} (Expected: 147.333)`);
console.log(`Runs Against: ${totalRunsAgainst} (Expected: 466)`);
console.log(`Overs Against: ${totalOversAgainst} (Expected: 150)`);

const runRateFor = totalRunsFor / totalOversFor;
const runRateAgainst = totalRunsAgainst / totalOversAgainst;
const calculatedNRR = runRateFor - runRateAgainst;

console.log("\n--- Final Calculation ---");
console.log(`Run Rate For: ${runRateFor.toFixed(4)}`);
console.log(`Run Rate Against: ${runRateAgainst.toFixed(4)}`);
console.log(`Calculated NRR: ${calculatedNRR.toFixed(3)}`);
console.log(`Function Output: ${nrr}`);

if (nrr === '+1.495' || nrr === '1.495') {
    console.log("\n✅ SUCCESS: NRR matches expected value.");
} else {
    console.log("\n❌ FAILURE: NRR does not match expected value.");
}
