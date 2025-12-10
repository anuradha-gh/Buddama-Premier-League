import { Match, Season, Team, Player } from "./types";
import { mockMatches as initialMatches, mockSeasons as initialSeasons, mockTeams, mockPlayers } from "./mockData";

// In-memory store (simulating a database)
let seasons: Season[] = [...initialSeasons];
let matches: Match[] = [...initialMatches];
const teams: Team[] = [...mockTeams];

export const getAllSeasons = async (): Promise<Season[]> => {
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => resolve([...seasons]), 100);
    });
};

export const getMatchById = async (matchId: string): Promise<Match | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const match = matches.find(m => m.id === matchId);
            resolve(match);
        }, 100);
    });
};

export const getMatchesBySeason = async (seasonId: string): Promise<Match[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filtered = matches.filter(m => m.seasonId === seasonId);
            resolve([...filtered]);
        }, 100);
    });
};

export const createSeason = async (seasonData: Partial<Season>): Promise<Season> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newSeason: Season = {
                id: `season-${Date.now()}`,
                name: seasonData.name || "New Season",
                year: seasonData.year || new Date().getFullYear(),
                startDate: seasonData.startDate || new Date().toISOString(),
                endDate: seasonData.endDate || "",
                status: 'Upcoming',
                isCurrent: false,
                ...seasonData
            };
            seasons = [...seasons, newSeason];
            resolve(newSeason);
        }, 200);
    });
};

export const createMatch = async (matchData: Partial<Match>): Promise<Match> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newMatch: Match = {
                id: `match-${Date.now()}`,
                seasonId: matchData.seasonId || "",
                teamAId: matchData.teamAId || "",
                teamBId: matchData.teamBId || "",
                date: matchData.date || new Date().toISOString(),
                status: 'Scheduled',
                round: matchData.round || 'League Stage',
                venue: matchData.venue || 'Buddama Cricket Ground',
                currentOver: 0,
                totalOvers: 20,
                ...matchData
            };
            matches = [...matches, newMatch];
            resolve(newMatch);
        }, 200);
    });
};

export const updateMatch = async (matchId: string, updates: Partial<Match>): Promise<Match | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = matches.findIndex(m => m.id === matchId);
            if (index !== -1) {
                matches[index] = { ...matches[index], ...updates };
                resolve(matches[index]);
            } else {
                resolve(null);
            }
        }, 200);
    });
};

export const deleteMatch = async (matchId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const initialLength = matches.length;
            matches = matches.filter(m => m.id !== matchId);
            resolve(matches.length < initialLength);
        }, 200);
    });
};



// Match State Store
let matchStates: Record<string, any> = {};

export const getMatchState = async (matchId: string): Promise<any | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(matchStates[matchId] || null);
        }, 100);
    });
};

export const saveMatchState = async (matchId: string, state: any): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            matchStates[matchId] = state;
            resolve(true);
        }, 100);
    });
};

export const getAllTeams = async (): Promise<Team[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...teams]), 100);
    });
};

export const getAllPlayers = async (): Promise<Player[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...mockPlayers]), 100);
    });
};

export const updateTeam = async (teamId: string, updates: Partial<Team>): Promise<Team | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = teams.findIndex(t => t.id === teamId);
            if (index !== -1) {
                teams[index] = { ...teams[index], ...updates };
                resolve(teams[index]);
            } else {
                resolve(null);
            }
        }, 100);
    });
};

// --- Team Season Stats ---
import { TeamSeasonStats } from "./types";

let teamSeasonStats: TeamSeasonStats[] = [];

// Initialize some mock stats for existing teams in season-5
mockTeams.forEach(team => {
    if (team.seasonId === 'season-5') {
        teamSeasonStats.push({
            id: `stats-${team.id}-season-5`,
            seasonId: 'season-5',
            teamId: team.id,
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
        });
    }
});

export const getTeamSeasonStats = async (seasonId: string): Promise<TeamSeasonStats[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const stats = teamSeasonStats.filter(s => s.seasonId === seasonId);
            resolve([...stats]);
        }, 100);
    });
};

export const initializeTeamStats = async (seasonId: string, teamId: string): Promise<TeamSeasonStats> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newStats: TeamSeasonStats = {
                id: `stats-${teamId}-${seasonId}`,
                seasonId: seasonId,
                teamId: teamId,
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
            teamSeasonStats.push(newStats);
            resolve(newStats);
        }, 100);
    });
};

export const updateTeamSeasonStats = async (statsId: string, updates: Partial<TeamSeasonStats>): Promise<TeamSeasonStats | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = teamSeasonStats.findIndex(s => s.id === statsId);
            if (index !== -1) {
                teamSeasonStats[index] = { ...teamSeasonStats[index], ...updates };
                resolve(teamSeasonStats[index]);
            } else {
                resolve(null);
            }
        }, 100);
    });
};
