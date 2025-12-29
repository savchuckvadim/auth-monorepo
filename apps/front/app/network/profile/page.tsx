'use client'
export const dynamic = 'force-dynamic';



import React from 'react';

import { useAuth } from '@/modules/processes';
import { LoadingScreen } from '@/modules/shared';
import { User } from '@/modules/entities/user';
import { useApp } from '@/modules/app';





export default function NetworkProfilePage() {
    const { currentUser } = useAuth();
    const { isClient } = useApp();
    if (!currentUser || !currentUser?.id || !isClient) {
        return <LoadingScreen />
    }

    return (
        <User userId={currentUser.id!} />
    );
}

