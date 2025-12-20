'use client'
export const dynamic = 'force-dynamic';



import React from 'react';

import { useAuth } from '@/modules/processes';
import { LoadingScreen } from '@/modules/shared';
import { User } from '@/modules/entities/user';





export default function NetworkProfilePage() {
    const { currentUser } = useAuth();
    if (!currentUser || !currentUser?.id) {
        return <LoadingScreen />
    }

    return (
        <User userId={currentUser.id!} />
    );
}

