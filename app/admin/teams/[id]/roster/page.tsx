import RosterClient from "@/components/admin/RosterClient";

interface AdminRosterPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AdminRosterPage({ params }: AdminRosterPageProps) {
    const { id } = await params;
    return <RosterClient teamId={id} />;
}
