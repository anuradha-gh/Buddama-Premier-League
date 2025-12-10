import { Trophy, Users, Calendar, Target, Heart, TrendingUp, Facebook, Instagram, Youtube, Mail, Globe, MessageCircle } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="font-display text-5xl md:text-7xl text-white mb-4 tracking-wide">
                        ABOUT <span className="text-primary">BPL</span>
                    </h1>
                    <p className="text-xl text-gray-400">Buddama Premier League</p>
                </div>

                {/* Introduction */}
                <section className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 border border-white/10">
                    <p className="text-lg text-gray-300 leading-relaxed mb-6">
                        The <span className="text-primary font-bold">Buddama Premier League (BPL)</span> is an annual softball cricket tournament proudly organized by <span className="font-semibold text-white">United Sport Club Buddama</span>, in collaboration with the <span className="font-semibold text-white">Buddama Youth Association</span> and <span className="font-semibold text-white">Isuru Youth Club Buddama</span>.
                    </p>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Launched in <span className="text-primary font-bold">April 2022</span>, BPL has become a signature sporting event in the village, celebrating young cricketing talent and strengthening community spirit year after year.
                    </p>
                </section>

                {/* Our Beginning */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Heart className="text-primary" size={32} />
                        <h2 className="font-display text-4xl text-white">OUR BEGINNING</h2>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-8 border border-white/5">
                        <p className="text-gray-300 leading-relaxed mb-4">
                            BPL was created with a clear purpose: <span className="text-white font-semibold">to discover and promote young cricket players in Buddama</span> while bringing joy, unity, and entertainment to all villagers.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            What started as a local initiative has now grown into an inspiring youth-driven sports festival enjoyed by families, supporters, and cricket fans across the area.
                        </p>
                    </div>
                </section>

                {/* Tournament Format */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Trophy className="text-primary" size={32} />
                        <h2 className="font-display text-4xl text-white">TOURNAMENT FORMAT</h2>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-8 border border-white/5">
                        <p className="text-gray-300 mb-6">
                            The BPL follows a competitive and exciting structure designed to give every team a fair chance to showcase their skills:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-slate-800/50 rounded-lg p-6 border border-white/5">
                                <h3 className="text-primary font-bold mb-2 uppercase tracking-wider">Teams</h3>
                                <p className="text-white text-2xl font-bold">4 to 6</p>
                            </div>

                            <div className="bg-slate-800/50 rounded-lg p-6 border border-white/5">
                                <h3 className="text-primary font-bold mb-2 uppercase tracking-wider">Cricket Type</h3>
                                <p className="text-white text-2xl font-bold">Softball Cricket</p>
                            </div>

                            <div className="bg-slate-800/50 rounded-lg p-6 border border-white/5">
                                <h3 className="text-primary font-bold mb-2 uppercase tracking-wider">Duration</h3>
                                <p className="text-white text-2xl font-bold">2-Day Tournament</p>
                            </div>

                            <div className="bg-slate-800/50 rounded-lg p-6 border border-white/5">
                                <h3 className="text-primary font-bold mb-2 uppercase tracking-wider">Season</h3>
                                <p className="text-white text-2xl font-bold">Annually in April</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <h3 className="text-xl font-bold text-white mb-4">Match Format:</h3>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-primary font-bold">1</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Round-robin stage</h4>
                                    <p className="text-gray-400">Each team plays against one another</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-primary font-bold">2</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Semi-finals</h4>
                                    <p className="text-gray-400">Top four teams qualify</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-primary font-bold">3</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Grand Final</h4>
                                    <p className="text-gray-400">Winners of the semi-finals compete for the BPL championship</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="text-primary" size={32} />
                        <h2 className="font-display text-4xl text-white">OUR MISSION</h2>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 border border-primary/20">
                        <p className="text-lg text-white leading-relaxed">
                            To uplift and empower the youth through sports, encourage healthy competition, enhance cricketing skills, and build a strong sense of unity within the Buddama community.
                        </p>
                    </div>
                </section>

                {/* Community Impact */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-primary" size={32} />
                        <h2 className="font-display text-4xl text-white">COMMUNITY IMPACT</h2>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-8 border border-white/5">
                        <p className="text-gray-300 mb-6">
                            BPL has become a highlight of village life, creating positive change through:
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Developing young cricketing talent",
                                "Encouraging teamwork, discipline, and leadership",
                                "Bringing families and friends together",
                                "Creating a festive, energetic environment every year",
                                "Strengthening bonds between village youth clubs and communities"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                    <span className="text-gray-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-gray-300 mt-6 italic">
                            The tournament has steadily grown in popularity as more villagers join the crowd to cheer, celebrate, and support their local players.
                        </p>
                    </div>
                </section>

                {/* Organizers */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="text-primary" size={32} />
                        <h2 className="font-display text-4xl text-white">ORGANIZERS</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            "United Sport Club Buddama",
                            "Buddama Youth Association",
                            "Isuru Youth Club Buddama"
                        ].map((org, index) => (
                            <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-white/10 text-center hover:border-primary/50 transition-colors">
                                <Users className="text-primary mx-auto mb-4" size={40} />
                                <h3 className="text-white font-bold">{org}</h3>
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-400 mt-6 text-center">
                        Their combined efforts ensure fair play, proper management, and a memorable tournament each year.
                    </p>
                </section>

                {/* Looking Ahead */}
                <section className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/30">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="text-primary" size={32} />
                        <h2 className="font-display text-4xl text-white">LOOKING AHEAD</h2>
                    </div>
                    <p className="text-gray-200 leading-relaxed mb-4">
                        Since <span className="text-primary font-bold">2022</span>, the BPL has expanded in spirit and participation. With each new season, the tournament becomes stronger, more organized, and more engaging.
                    </p>
                    <p className="text-gray-200 leading-relaxed">
                        The organizing team is committed to continuing this journey and offering young players a respected platform to shine.
                    </p>
                </section>

                {/* Contact & Connect */}
                <section className="mt-16 mb-8">
                    <div className="flex items-center gap-3 mb-6 justify-center">
                        <MessageCircle className="text-primary" size={32} />
                        <h2 className="font-display text-4xl text-white">CONNECT WITH US</h2>
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-slate-900/50 rounded-xl p-8 border border-white/5 mb-6">
                        <h3 className="text-xl font-bold text-white mb-6 text-center">Follow Us on Social Media</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <a
                                href="https://www.facebook.com/bplbuddama/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 p-6 bg-slate-800/50 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/50 rounded-lg transition-all group"
                            >
                                <Facebook className="text-blue-500 group-hover:scale-110 transition-transform" size={32} />
                                <span className="text-sm text-gray-300 group-hover:text-blue-400 font-medium">Facebook</span>
                            </a>

                            <a
                                href="https://www.instagram.com/bplbuddama/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 p-6 bg-slate-800/50 hover:bg-pink-600/20 border border-white/5 hover:border-pink-500/50 rounded-lg transition-all group"
                            >
                                <Instagram className="text-pink-500 group-hover:scale-110 transition-transform" size={32} />
                                <span className="text-sm text-gray-300 group-hover:text-pink-400 font-medium">Instagram</span>
                            </a>

                            <a
                                href="https://www.youtube.com/@BUDDAMAPREMIERLEAGUE"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 p-6 bg-slate-800/50 hover:bg-red-600/20 border border-white/5 hover:border-red-500/50 rounded-lg transition-all group"
                            >
                                <Youtube className="text-red-500 group-hover:scale-110 transition-transform" size={32} />
                                <span className="text-sm text-gray-300 group-hover:text-red-400 font-medium">YouTube</span>
                            </a>

                            <a
                                href="https://www.tiktok.com/@bplbuddama"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 p-6 bg-slate-800/50 hover:bg-cyan-600/20 border border-white/5 hover:border-cyan-500/50 rounded-lg transition-all group"
                            >
                                <svg className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                                <span className="text-sm text-gray-300 group-hover:text-cyan-400 font-medium">TikTok</span>
                            </a>

                            <a
                                href="https://wa.me/message/RB4HDBBWLAMNP1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 p-6 bg-slate-800/50 hover:bg-green-600/20 border border-white/5 hover:border-green-500/50 rounded-lg transition-all group"
                            >
                                <MessageCircle className="text-green-500 group-hover:scale-110 transition-transform" size={32} />
                                <span className="text-sm text-gray-300 group-hover:text-green-400 font-medium">WhatsApp</span>
                            </a>

                            <a
                                href="https://whatsapp.com/channel/0029VbBXmeiAojZ1jmPcL73W"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 p-6 bg-slate-800/50 hover:bg-green-600/20 border border-white/5 hover:border-green-500/50 rounded-lg transition-all group"
                            >
                                <svg className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span className="text-sm text-gray-300 group-hover:text-green-400 font-medium">WhatsApp Channel</span>
                            </a>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <a
                            href="mailto:buddamapremierleague@gmail.com"
                            className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-primary/20 hover:to-primary/10 border border-white/10 hover:border-primary/50 rounded-xl transition-all group"
                        >
                            <Mail className="text-primary group-hover:scale-110 transition-transform" size={32} />
                            <div>
                                <h3 className="text-white font-bold mb-1">Email Us</h3>
                                <p className="text-gray-400 text-sm group-hover:text-primary transition-colors">buddamapremierleague@gmail.com</p>
                            </div>
                        </a>

                        <a
                            href="https://cricclubs.com/BuddamaPremierLeague"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-primary/20 hover:to-primary/10 border border-white/10 hover:border-primary/50 rounded-xl transition-all group"
                        >
                            <Globe className="text-primary group-hover:scale-110 transition-transform" size={32} />
                            <div>
                                <h3 className="text-white font-bold mb-1">Tournament Management</h3>
                                <p className="text-gray-400 text-sm group-hover:text-primary transition-colors">cricclubs.com/BuddamaPremierLeague</p>
                            </div>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
