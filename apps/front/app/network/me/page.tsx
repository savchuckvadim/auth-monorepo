'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '@/modules/processes';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';



const DynamicProfileInformation = dynamic(() => import('@/modules/widgetes/profile/information/ui/ProfileInformation').then(mod => mod.default), {
    ssr: false
});

const DynamicProfilePosts = dynamic(() => import('@/modules/widgetes/profile/posts/ProfilePosts').then(mod => mod.default), {
    ssr: false,
    loading: () => <LoadingComponent />
});


export default function NetworkProfilePage() {

    const { currentUser } = useAuth();
    if (!currentUser || !currentUser.id) {
        return <LoadingComponent />
    }

    return (
        <div className='w-full flex flex-col gap-4 '>
            <DynamicProfileInformation userId={currentUser.id!} />
            <DynamicProfilePosts userId={currentUser.id!} />

        </div>
    );
}

