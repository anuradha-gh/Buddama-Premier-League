"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/services/authService";
import { Loader } from "lucide-react";

export default function AdminProtection({ children }: { children: React.ReactNode }) {
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            if (!isAdminAuthenticated()) {
                router.push("/admin/login");
            } else {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return <>{children}</>;
}
