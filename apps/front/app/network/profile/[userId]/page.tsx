
export const dynamic = 'force-dynamic';



import React from 'react';
import { ProfileInformation, ProfilePosts } from '@/modules/widgetes';






export default async function NetworkProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const p = await params;
    const userId = p.userId;


    return (
        <div className='w-full flex flex-col gap-4 pt-25'>
            <ProfileInformation userId={userId} />
            <ProfilePosts userId={userId} />

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

