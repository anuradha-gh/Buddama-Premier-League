import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen relative">
            <Navbar />
            <main className="flex-grow pt-24">
                {children}
            </main>
            <Footer />
        </div>
    );
}
