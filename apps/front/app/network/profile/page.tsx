'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '@/modules/processes';
import { LoadingScreen } from '@/modules/shared';

// import { ProfileInformation,  ProfilePosts } from '@/modules/widgetes';


const DynamicProfileInformation = dynamic(() => import('@/modules/widgetes/profile/information/ui/ProfileInformation').then(mod => mod.default), {
    ssr: false
});

const DynamicProfilePosts = dynamic(() => import('@/modules/widgetes/profile/posts/ProfilePosts').then(mod => mod.default), {
    ssr: false
});


export default function NetworkProfilePage() {

    const { currentUser } = useAuth();
    if (!currentUser || !currentUser.id) {
        return <LoadingScreen />
    }

    return (
        <div className='w-full flex flex-col gap-4 pt-25'>
            <DynamicProfileInformation userId={currentUser.id!} />
            <DynamicProfilePosts userId={currentUser.id!} />

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

