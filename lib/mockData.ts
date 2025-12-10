import { Season, Team, Player, Match } from './types';

export const mockSeasons: Season[] = [
    {
        id: "season-5",
        name: "BPL Season 5",
        year: 2025,
        startDate: "2025-03-01",
        endDate: "2025-04-15",
        status: "Active",
        isCurrent: true,
        ballsPerOver: 6
    },
    {
        id: "season-t5",
        name: "BPL T5 League",
        year: 2025,
        startDate: "2025-05-01",
        endDate: "2025-05-10",
        status: "Upcoming",
        isCurrent: false,
        ballsPerOver: 5
    }
];

export const mockTeams: Team[] = [
    {
        id: "team-1",
        name: "Buddama Capitals",
        shortName: "BC",
        logoUrl: "/teams/buddama-capitals.png",
        primaryColor: "#ef4444", // Red
        secondaryColor: "#000000",
        seasonId: "season-5",
        homeVenue: "Buddama Cricket Stadium",
        coach: "Mahela Jayawardene",
        owner: "Capital Sports Group",
        championshipYears: [2021, 2023],
    },
    {
        id: "team-2",
        name: "Buddama Challengers",
        shortName: "BCH",
        logoUrl: "/teams/buddama-challengers.png",
        primaryColor: "#eab308", // Yellow
        secondaryColor: "#064e3b",
        seasonId: "season-5",
        homeVenue: "Pallekele International Stadium",
        coach: "Kumar Sangakkara",
        owner: "Challenger Corp",
        championshipYears: [2022],
    },
    {
        id: "team-3",
        name: "Buddama Falcons",
        shortName: "BF",
        logoUrl: "/teams/buddama-falcons.png",
        primaryColor: "#fbbf24", // Amber
        secondaryColor: "#000000",
        seasonId: "season-5",
        homeVenue: "Galle International Stadium",
        coach: "Sanath Jayasuriya",
        owner: "Falcon United",
        championshipYears: [],
    },
    {
        id: "team-4",
        name: "Buddama Kings",
        shortName: "BK",
        logoUrl: "/teams/buddama-kings.png",
        primaryColor: "#2dd4bf", // Teal
        secondaryColor: "#000000",
        seasonId: "season-5",
        homeVenue: "Rangiri Dambulla Stadium",
        coach: "Tom Moody",
        owner: "Kings Empire",
        championshipYears: [2020],
    },
    {
        id: "team-5",
        name: "Buddama Royals",
        shortName: "BR",
        logoUrl: "/teams/buddama-royals.png",
        primaryColor: "#a855f7", // Purple
        secondaryColor: "#fbbf24",
        seasonId: "season-5",
        homeVenue: "R. Premadasa Stadium",
        coach: "Shane Watson",
        owner: "Royal Family Trust",
        championshipYears: [],
    },
    {
        id: "team-6",
        name: "Buddama Titans",
        shortName: "BT",
        logoUrl: "/teams/buddama-titans.png",
        primaryColor: "#3b82f6", // Blue
        secondaryColor: "#ef4444",
        seasonId: "season-5",
        homeVenue: "Mahinda Rajapaksa Stadium",
        coach: "Chaminda Vaas",
        owner: "Titanium Sports",
        championshipYears: [],
    },
];

export const mockPlayers: Player[] = [
    // --- Buddama Capitals (Full Squad of 15) ---
    // Batters
    { id: 'p1', name: 'Dinesh Chandimal', role: 'Batter', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=DC', battingStyle: 'Right-hand bat', isCaptain: false, isOverseas: false },
    { id: 'p2', name: 'Pathum Nissanka', role: 'Batter', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=PN', battingStyle: 'Right-hand bat', isCaptain: false, isOverseas: false },
    { id: 'p3', name: 'David Warner', role: 'Batter', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=DW', battingStyle: 'Left-hand bat', isCaptain: true, isOverseas: true },
    { id: 'p4', name: 'Avishka Fernando', role: 'Batter', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=AF', battingStyle: 'Right-hand bat', isCaptain: false, isOverseas: false },
    { id: 'p5', name: 'Bhanuka Rajapaksa', role: 'Batter', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=BR', battingStyle: 'Left-hand bat', isCaptain: false, isOverseas: false },

    // Wicket Keepers
    { id: 'p6', name: 'Kusal Mendis', role: 'Wicket Keeper', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=KM', battingStyle: 'Right-hand bat', isCaptain: false, isOverseas: false },
    { id: 'p7', name: 'Nicholas Pooran', role: 'Wicket Keeper', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=NP', battingStyle: 'Left-hand bat', isCaptain: false, isOverseas: true },

    // All Rounders
    { id: 'p8', name: 'Angelo Mathews', role: 'All Rounder', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=AM', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm medium', isCaptain: false, isOverseas: false },
    { id: 'p9', name: 'Dasun Shanaka', role: 'All Rounder', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=DS', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm medium', isCaptain: false, isOverseas: false },
    { id: 'p10', name: 'Wanindu Hasaranga', role: 'All Rounder', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=WH', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm legbreak', isCaptain: false, isOverseas: false },

    // Bowlers
    { id: 'p11', name: 'Isuru Udana', role: 'Bowler', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=IU', battingStyle: 'Right-hand bat', bowlingStyle: 'Left-arm medium fast', isCaptain: false, isOverseas: false },
    { id: 'p12', name: 'Dushmantha Chameera', role: 'Bowler', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=DC', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm fast', isCaptain: false, isOverseas: false },
    { id: 'p13', name: 'Maheesh Theekshana', role: 'Bowler', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=MT', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm offbreak', isCaptain: false, isOverseas: false },
    { id: 'p14', name: 'Trent Boult', role: 'Bowler', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=TB', battingStyle: 'Right-hand bat', bowlingStyle: 'Left-arm fast', isCaptain: false, isOverseas: true },
    { id: 'p15', name: 'Kasun Rajitha', role: 'Bowler', teamId: 'team-1', photoUrl: 'https://placehold.co/150?text=KR', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm medium fast', isCaptain: false, isOverseas: false },


    // --- Other Teams (Placeholders updated to new schema) ---
    // Buddama Challengers
    { id: 'p16', name: 'Charith Asalanka', role: 'Batter', teamId: 'team-2', photoUrl: 'https://placehold.co/150?text=CA', battingStyle: 'Left-hand bat', isCaptain: true, isOverseas: false },
    { id: 'p17', name: 'Lahiru Kumara', role: 'Bowler', teamId: 'team-2', photoUrl: 'https://placehold.co/150?text=LK', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm fast', isCaptain: false, isOverseas: false },

    // Buddama Falcons
    { id: 'p18', name: 'Danushka Gunathilaka', role: 'Batter', teamId: 'team-3', photoUrl: 'https://placehold.co/150?text=DG', battingStyle: 'Left-hand bat', isCaptain: false, isOverseas: false },
    { id: 'p19', name: 'Nuwan Thushara', role: 'Bowler', teamId: 'team-3', photoUrl: 'https://placehold.co/150?text=NT', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm medium', isCaptain: false, isOverseas: false },

    // Buddama Kings
    { id: 'p20', name: 'Thisara Perera', role: 'All Rounder', teamId: 'team-4', photoUrl: 'https://placehold.co/150?text=TP', battingStyle: 'Left-hand bat', bowlingStyle: 'Right-arm medium', isCaptain: true, isOverseas: false },

    // Buddama Royals
    { id: 'p21', name: 'Kusal Perera', role: 'Wicket Keeper', teamId: 'team-5', photoUrl: 'https://placehold.co/150?text=KP', battingStyle: 'Left-hand bat', isCaptain: false, isOverseas: false },

    // Buddama Titans
    { id: 'p22', name: 'Matheesha Pathirana', role: 'Bowler', teamId: 'team-6', photoUrl: 'https://placehold.co/150?text=MP', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm fast', isCaptain: false, isOverseas: false },
];

export const mockMatches: Match[] = [
    {
        id: 'm1',
        seasonId: 'season-5',
        teamAId: 'team-1',
        teamBId: 'team-2',
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: 'Scheduled',
        round: 'League Stage',
        venue: 'Buddama Cricket Stadium',
        currentOver: 0,
        totalOvers: 20,
        ballsPerOver: 6
    },
    {
        id: 'm2',
        seasonId: 'season-5',
        teamAId: 'team-3',
        teamBId: 'team-4',
        date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        status: 'Scheduled',
        round: 'League Stage',
        venue: 'Galle International Stadium',
        currentOver: 0,
        totalOvers: 20,
        ballsPerOver: 6
    },
    {
        id: 'm3',
        seasonId: 'season-t5',
        teamAId: 'team-1',
        teamBId: 'team-3',
        date: new Date(Date.now() + 259200000).toISOString(), // 3 days later
        status: 'Scheduled',
        round: 'League Stage',
        venue: 'R. Premadasa Stadium',
        currentOver: 0,
        totalOvers: 10,
        ballsPerOver: 5
    }
];
