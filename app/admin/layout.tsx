import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 ml-16 transition-all duration-300">
                {/* Top Header */}
                <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <h1 className="text-lg font-medium text-gray-200">Welcome, Admin</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-sm font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
