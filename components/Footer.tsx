export default function Footer() {
    return (
        <footer className="w-full py-8 bg-slate-950 border-t border-white/10 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-display text-2xl text-white mb-2">BPL</h2>
                <p className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Buddama Premier League. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
