export interface Season {
    id: string;
    name: string;
    year: number;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Completed' | 'Upcoming';
    winnerId?: string;
    isCurrent: boolean;
    ballsPerOver?: number;
}

export interface TeamSeasonStats {
    id: string;
    seasonId: string;
    teamId: string;
    played: number;
    won: number;
    lost: number;
    tied: number;
    noResult: number;
    points: number;
    nrr: number;
    runsScored: number;
    oversFaced: number;
    runsConceded: number;
    oversBowled: number;
}

export interface PointsTableEntry {
    id: string;
    seasonId: string;
    teamId: string;
    teamName: string;
    teamLogo?: string;
    played: number;
    won: number;
    lost: number;
    tied: number;
    noResult: number;
    points: number;
    nrr: number;
    position: number;
}

export interface Team {
    id: string;
    name: string;
    shortName: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    seasonId: string; // Keeps track of current/latest season context
    homeVenue: string;
    coach: string;
    owner: string;
    championshipYears: number[];
}

export type PlayerRole = 'Batter' | 'Bowler' | 'All Rounder' | 'Wicket Keeper';

export interface Player {
    id: string;
    name: string;
    role: PlayerRole;
    teamId: string;
    photoUrl: string;
    battingStyle: string;
    bowlingStyle?: string;
    isCaptain: boolean;
    isOverseas: boolean;
}

export type MatchStatus = 'Scheduled' | 'Live' | 'Completed';

export interface Match {
    id: string;
    seasonId: string;
    teamAId: string;
    teamBId: string;
    date: string; // ISO string
    status: MatchStatus;
    round: string; // e.g., 'League Stage', 'Final'
    venue: string;
    currentOver: number;
    totalOvers: number;
    result?: string;
    score?: {
        teamA: { runs: number; wickets: number; overs: number };
        teamB: { runs: number; wickets: number; overs: number };
    };
    method?: 'Normal' | 'DLS' | 'VJD';
    targetScore?: number;
    battingFirstId?: string;
    maxOvers?: number;
    isDuckworthLewis?: boolean;
    ballsPerOver?: number;
}

export interface LiveScore {
    runs: number;
    wickets: number;
    overs: number; // e.g., 10.2
    currentBatsmanId: string;
    currentBowlerId: string;
    ballByBallArray: string[]; // e.g., ['1', '4', 'W', '0', '6']
}

export type ExtrasType = 'None' | 'Wide' | 'NoBall' | 'Bye' | 'LegBye';
export type WicketType = 'Bowled' | 'Caught' | 'LBW' | 'RunOut' | 'Stumped' | 'HitWicket' | 'Retired';

export interface BallEvent {
    runsScored: number;
    extrasType: ExtrasType;
    extrasRuns: number; // Extra runs from the extra itself (e.g., 1 for Wide)
    isWicket: boolean;
    wicketType?: WicketType;
    playerDismissedId?: string;
}

export interface MatchState {
    matchId: string;
    innings: 1 | 2;
    battingTeamId: string;
    bowlingTeamId: string;
    strikerId: string;
    nonStrikerId: string;
    currentBowlerId: string;
    score: {
        totalRuns: number;
        wickets: number;
        extras: {
            wides: number;
            noBalls: number;
            byes: number;
            legByes: number;
        };
    };
    overs: number; // Decimal: 10.2
    ballsBowledInOver: number; // 0-6 (legal balls)
    thisOver: string[]; // Event codes
    dismissedPlayers: string[];
}

export interface GalleryImage {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    thumbnailUrl?: string;
    uploadDate: string;
    uploadedBy: string;
    season?: string;
    tags?: string[];
}
