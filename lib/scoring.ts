import { MatchState, BallEvent } from "./types";

export function processBall(currentState: MatchState, event: BallEvent, ballsPerOver: number = 6): MatchState {
    // Deep copy to avoid mutating state directly
    const newState: MatchState = JSON.parse(JSON.stringify(currentState));

    // 1. Calculate Runs & Extras
    let totalBallRuns = event.runsScored;
    let isLegalDelivery = true;

    // Handle Extras
    if (event.extrasType !== 'None') {
        if (event.extrasType === 'Wide') {
            newState.score.extras.wides += (1 + event.runsScored); // Wide + any runs run
            totalBallRuns += 1; // 1 run for the wide itself
            isLegalDelivery = false;
        } else if (event.extrasType === 'NoBall') {
            newState.score.extras.noBalls += (1 + event.runsScored); // NB + any runs run
            totalBallRuns += 1; // 1 run for the NB itself
            isLegalDelivery = false;
        } else if (event.extrasType === 'Bye') {
            newState.score.extras.byes += event.runsScored;
            // Byes don't count to batsman, but count to total
        } else if (event.extrasType === 'LegBye') {
            newState.score.extras.legByes += event.runsScored;
            // Leg Byes don't count to batsman, but count to total
        }
    }

    // Update Total Score
    newState.score.totalRuns += totalBallRuns;

    // 2. Update Overs & Ball Count
    if (isLegalDelivery) {
        newState.ballsBowledInOver += 1;

        // Update decimal overs (e.g., 0.1 -> 0.2 ... 0.5 -> 1.0)
        if (newState.ballsBowledInOver === ballsPerOver) {
            newState.overs = Math.floor(newState.overs) + 1;
            newState.ballsBowledInOver = 0;
        } else {
            newState.overs += 0.1;
            // Fix floating point math (0.1 + 0.2 = 0.300000004)
            newState.overs = Math.round(newState.overs * 10) / 10;
        }
    }

    // 3. Generate Ball Code for "This Over"
    let ballCode = `${event.runsScored}`;
    if (event.isWicket) ballCode = 'W';
    else if (event.extrasType === 'Wide') ballCode = `wd${event.runsScored > 0 ? '+' + event.runsScored : ''}`;
    else if (event.extrasType === 'NoBall') ballCode = `nb${event.runsScored > 0 ? '+' + event.runsScored : ''}`;
    else if (event.extrasType === 'Bye') ballCode = `b${event.runsScored}`;
    else if (event.extrasType === 'LegBye') ballCode = `lb${event.runsScored}`;

    newState.thisOver.push(ballCode);

    // 4. Handle Wickets
    if (event.isWicket) {
        newState.score.wickets += 1;
        if (event.playerDismissedId) {
            newState.dismissedPlayers.push(event.playerDismissedId);
        } else {
            // Default to striker if not specified (except for Run Out at non-striker end, which needs specific handling in UI)
            newState.dismissedPlayers.push(newState.strikerId);
        }
    }

    // 5. Strike Rotation
    // Swap if runs scored is odd (1, 3, 5)
    // IMPORTANT: For Wides/NoBalls, the runsScored (runs run) determines crossing, not the extra run.
    const runsToCheckForCrossing = event.runsScored;

    if (runsToCheckForCrossing % 2 !== 0) {
        const temp = newState.strikerId;
        newState.strikerId = newState.nonStrikerId;
        newState.nonStrikerId = temp;
    }

    // End of Over Rotation
    // If legal balls == 0 (meaning we just finished an over), swap ends.
    // MCC Law 2025 Compliance: For catches, the new batter takes strike.
    // Since we swap ends here at the end of the over, if a wicket fell on the last ball,
    // the dismissed player (now in non-striker slot) will be replaced by the new batter,
    // ensuring the *other* batter takes strike for the new over.
    if (isLegalDelivery && newState.ballsBowledInOver === 0) {
        const temp = newState.strikerId;
        newState.strikerId = newState.nonStrikerId;
        newState.nonStrikerId = temp;

        // Reset "This Over" array for the new over
        newState.thisOver = [];
    }

    return newState;
}

export function generateCommentary(bowlerName: string, batsmanName: string, event: BallEvent): string {
    if (event.isWicket) {
        return `${bowlerName} to ${batsmanName}, OUT! ${event.wicketType || 'Dismissed'}.`;
    }

    if (event.runsScored === 4) {
        return `${bowlerName} to ${batsmanName}, FOUR! Beautiful shot.`;
    }

    if (event.runsScored === 6) {
        return `${bowlerName} to ${batsmanName}, SIX! That's huge!`;
    }

    if (event.extrasType !== 'None') {
        const extraText = event.extrasType === 'NoBall' ? 'No Ball' : event.extrasType;
        const runs = event.runsScored > 0 ? ` + ${event.runsScored} runs` : '';
        return `${bowlerName} to ${batsmanName}, ${extraText}${runs}.`;
    }

    if (event.runsScored === 0) {
        return `${bowlerName} to ${batsmanName}, no run.`;
    }

    return `${bowlerName} to ${batsmanName}, ${event.runsScored} run${event.runsScored > 1 ? 's' : ''}.`;
}
