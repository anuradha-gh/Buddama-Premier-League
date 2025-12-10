export default function ScoringPageDisabled() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
            <div className="max-w-2xl text-center space-y-6">
                <h1 className="text-4xl font-bold text-red-500">⚠️ Feature Disabled</h1>
                <p className="text-xl text-gray-300">
                    The live ball-by-ball scoring console has been disabled.
                </p>
                <p className="text-gray-400">
                    Please use the match management page to update basic match results,
                    and the points table editor to manually update team standings.
                </p>
                <div className="flex gap-4 justify-center pt-8">
                    <a
                        href="/admin/matches"
                        className="bg-primary text-black px-6 py-3 rounded-lg font-bold hover:brightness-110 transition-all"
                    >
                        Go to Matches
                    </a>
                    <a
                        href="/admin/dashboard"
                        className="bg-white/10 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition-all"
                    >
                        Back to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
