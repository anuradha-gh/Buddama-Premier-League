/**
 * Migration Script: Seed Teams and Seasons to Firestore
 * 
 * Run this script once to populate your Firestore database with the initial
 * team and season data from mockData.ts
 * 
 * Usage: node scripts/seedFirestore.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../firebase-service-account.json'); // You'll need to download this from Firebase Console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Team data from mockData.ts (without players)
const teams = [
    {
        id: "team-1",
        name: "Buddama Capitals",
        shortName: "BC",
        logoUrl: "/teams/buddama-capitals.png",
        primaryColor: "#ef4444",
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
        primaryColor: "#eab308",
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
        primaryColor: "#fbbf24",
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
        primaryColor: "#2dd4bf",
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
        primaryColor: "#a855f7",
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
        primaryColor: "#3b82f6",
        secondaryColor: "#ef4444",
        seasonId: "season-5",
        homeVenue: "Mahinda Rajapaksa Stadium",
        coach: "Aravinda de Silva",
        owner: "Titans Consortium",
        championshipYears: [],
    }
];

const seasons = [
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

async function seedData() {
    try {
        console.log('Starting Firestore seeding...');

        // Seed Seasons
        console.log('\nSeeding Seasons...');
        for (const season of seasons) {
            await db.collection('seasons').doc(season.id).set(season);
            console.log(`✓ Seeded season: ${season.name}`);
        }

        // Seed Teams
        console.log('\nSeeding Teams...');
        for (const team of teams) {
            await db.collection('teams').doc(team.id).set(team);
            console.log(`✓ Seeded team: ${team.name}`);
        }

        console.log('\n✅ Seeding completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Add players to teams via the Admin Panel');
        console.log('2. Create matches for the season');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
