"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/about', label: 'About' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/teams', label: 'Teams' },
        { href: '/match-history', label: 'Matches' },
        { href: '/points-table', label: 'Points Table' },
    ];

    return (
        <>
            <nav className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-slate-950/90 to-slate-950/50 border-b border-slate-800 backdrop-blur-sm">
                <Link href="/" className="flex items-center gap-2 group relative z-50">
                    <div className="relative w-16 h-16">
                        <Image
                            src="/logo-white.png"
                            alt="BPL Logo"
                            fill
                            className="object-contain group-hover:scale-110 transition-transform"
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6 md:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-bold text-gray-300 hover:text-primary uppercase tracking-wider transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden relative z-50 p-2 text-white hover:text-primary transition-colors"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Slide-out Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-slate-900 border-l border-white/10 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col gap-2 p-6 pt-24">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-bold text-gray-300 hover:text-primary hover:bg-white/5 uppercase tracking-wider transition-all py-3 px-4 rounded-lg"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
