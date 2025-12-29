'use client'
export const dynamic = 'force-dynamic';



import React from 'react';

import { useAuth } from '@/modules/processes';
import { LoadingScreen } from '@/modules/shared';

import { useApp } from '@/modules/app';
import { ProfileInformation, Post } from '@/modules/widgetes';
import { div } from 'framer-motion/client';





export default function NetworkProfilePage() {
    const { currentUser } = useAuth();
    const { isClient } = useApp();
    if (!currentUser || !currentUser?.id || !isClient) {
        return <LoadingScreen />
    }

    return (
        <div className='w-full flex flex-col gap-4 pt-25'>
            <ProfileInformation />
            <div className='mt-10 '>
                <Post />
                <Post />
                <Post />
            </div>

        </div>

        // <div className='flex flex-row gap-4'>
        //     <div className='w-1/3 flex flex-col gap-4 pt-15'>
        //     навигация слева
        //     </div>
        //     <div className='w-full flex flex-col gap-4 pt-25'>
        //         <ProfileInformation />
        //         <div className='mt-10 '>
        //             <Post />
        //             <Post />
        //             <Post />
        //         </div>

        //     </div>
        // </div>

    );
}

