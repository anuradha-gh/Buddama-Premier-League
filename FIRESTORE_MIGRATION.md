# Firestore Migration Guide

This guide will help you migrate your team and season data to Firestore.

## Option 1: Using the Admin Panel (Recommended)

The easiest way is to manually create teams through the Admin Panel:

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/admin/matches`
3. Click **"New Season"** and create "BPL Season 5"
4. Navigate to `http://localhost:3000/admin/teams`
5. Click **"Create New Team"** for each team:

   - **Buddama Capitals**
     - Short Name: BC
     - Coach: Mahela Jayawardene
     - Owner: Capital Sports Group
     - Home Venue: Buddama Cricket Stadium
     - Primary Color: #ef4444
     - Championship Years: 2021, 2023

   - **Buddama Challengers**
     - Short Name: BCH
     - Coach: Kumar Sangakkara
     - Owner: Challenger Corp
     - Home Venue: Pallekele International Stadium
     - Primary Color: #eab308
     - Championship Years: 2022

   - **Buddama Falcons**
     - Short Name: BF
     - Coach: Sanath Jayasuriya
     - Owner: Falcon United
     - Home Venue: Galle International Stadium
     - Primary Color: #fbbf24

   - **Buddama Kings**
     - Short Name: BK
     - Coach: Tom Moody
     - Owner: Kings Empire
     - Home Venue: Rangiri Dambulla Stadium
     - Primary Color: #2dd4bf
     - Championship Years: 2020

   - **Buddama Royals**
     - Short Name: BR
     - Coach: Shane Watson
     - Owner: Royal Family Trust
     - Home Venue: R. Premadasa Stadium
     - Primary Color: #a855f7

   - **Buddama Titans**
     - Short Name: BT
     - Coach: Aravinda de Silva
     - Owner: Titans Consortium
     - Home Venue: Mahinda Rajapaksa Stadium
     - Primary Color: #3b82f6

## Option 2: Using Firebase Console

You can also add teams directly via Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **bpl-web-9a688**
3. Navigate to **Firestore Database** from the left menu
4. Create collections and documents manually using the data from Option 1

## Option 3: Using the Migration Script (Advanced)

**Note**: This requires Firebase Admin SDK and a service account key.

1. Download your Firebase service account key:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save as `firebase-service-account.json` in your project root

2. Run the migration script:
   ```bash
   node scripts/seedFirestore.js
   ```

## Verification

After adding teams, verify by:
1. Visiting `http://localhost:3000/admin/teams` - should show your teams
2. Visiting `http://localhost:3000/teams` - should show your teams on public page
3. Changes should now sync between admin and public pages!

## Next Steps

- Add players to each team via the Admin Panel
- Create matches for the season
- Start scoring matches!
