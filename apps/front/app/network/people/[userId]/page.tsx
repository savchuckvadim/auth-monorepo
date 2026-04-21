'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const DynamicProfileInformation = dynamic(() => import('@/modules/widgets/profile/information/ui/ProfileInformation').then(mod => mod.default), {
    ssr: false
});

const DynamicProfilePosts = dynamic(() => import('@/modules/widgets/profile/posts/ProfilePosts').then(mod => mod.default), {
    ssr: false
});




export default function NetworkProfilePage() {
    const params = useParams();
    const userId = params.userId as string;


    return (
        <div className='w-full flex flex-col gap-4'>
            <DynamicProfileInformation userId={userId} />
            <DynamicProfilePosts userId={userId} />

        </div>



    );
}

