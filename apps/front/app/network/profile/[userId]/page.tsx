'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const DynamicProfileInformation = dynamic(() => import('@/modules/widgetes/profile/information/ui/ProfileInformation').then(mod => mod.default), {
    ssr: false
});

const DynamicProfilePosts = dynamic(() => import('@/modules/widgetes/profile/posts/ProfilePosts').then(mod => mod.default), {
    ssr: false
});




export default async function NetworkProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const p = await params;
    const userId = p.userId;


    return (
        <div className='w-full flex flex-col gap-4 pt-25'>
            <DynamicProfileInformation userId={userId} />
            <DynamicProfilePosts userId={userId} />

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

