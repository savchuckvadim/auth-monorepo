'use client'
export const dynamic = 'force-dynamic';


import { useApp } from "@/modules/app";
import { Users } from "@/modules/entities/user";
import { useAuth } from "@/modules/processes/auth/lib/hooks/auth.hook";
import { LoadingScreen } from "@/modules/shared/ui";


export default function NetworkUsersage() {
    const { currentUser } = useAuth();
    const { isClient } = useApp();
    if (!currentUser || !currentUser?.id || !isClient) {
        return <LoadingScreen />
    }



    return <Users />;
}

