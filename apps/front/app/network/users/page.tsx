'use client'
import { Users } from "@/modules/entities/user";
import { useAuth } from "@/modules/processes";
import { LoadingScreen } from "@/modules/shared";


export default function NetworkUsersage() {
    const { currentUser } = useAuth();
    if (!currentUser || !currentUser.id) {
        return <LoadingScreen />
    }



    return (
        <Users userId={currentUser?.id!} />
    );
}

