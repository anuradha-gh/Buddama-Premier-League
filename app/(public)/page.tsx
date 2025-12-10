import Link from 'next/link';
import Image from 'next/image';
import HeroScoreWidget from '@/components/HeroScoreWidget';

export default function Home() {


    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 bg-[url('/cricket-hero.jpg')] bg-cover bg-center">
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 text-center px-4 flex flex-col items-center">
                <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 animate-fade-in">
                    <Image
                        src="/logo-white.png"
                        alt="BPL Logo"
                        fill
                        className="object-contain drop-shadow-[0_0_15px_rgba(0,74,173,0.5)]"
                        priority
                    />
                </div>

                <p className="font-display text-4xl md:text-6xl lg:text-7xl text-white mb-8 tracking-widest font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    BUDDAMA PREMIER LEAGUE
                </p>

                <HeroScoreWidget />

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link
                        href="/about"
                        className="px-8 py-3 bg-primary text-slate-950 font-bold rounded hover:bg-primary/90 transition-colors uppercase tracking-wider"
                    >
                        About BPL
                    </Link>
                    <Link
                        href="/teams"
                        className="px-8 py-3 bg-white/10 text-white font-bold rounded border border-white/20 hover:bg-white/20 transition-colors uppercase tracking-wider"
                    >
                        View Teams
                    </Link>
                    <Link
                        href="/match-history"
                        className="px-8 py-3 bg-white/10 text-white font-bold rounded border border-white/20 hover:bg-white/20 transition-colors uppercase tracking-wider"
                    >
                        Match History
                    </Link>
                    <Link
                        href="/points-table"
                        className="px-8 py-3 bg-white/10 text-white font-bold rounded border border-white/20 hover:bg-white/20 transition-colors uppercase tracking-wider"
                    >
                        Points Table
                    </Link>
                </div>
            </div>
        </div>
    );
}
