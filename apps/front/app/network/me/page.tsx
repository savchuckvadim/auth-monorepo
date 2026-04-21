'use client';

import dynamicImport from 'next/dynamic';
import { useAuth } from '@/modules/processes/auth/lib/hooks/auth.hook';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';

export const dynamic = 'force-dynamic';



const DynamicProfileInformation = dynamicImport(() => import('@/modules/widgets/profile/information/ui/ProfileInformation').then(mod => mod.default), {
    ssr: false
});

const DynamicProfilePosts = dynamicImport(() => import('@/modules/widgets/profile/posts/ProfilePosts').then(mod => mod.default), {
    ssr: false,
    loading: () => <LoadingComponent />
});


export default function NetworkProfilePage() {

    const { currentUser } = useAuth();
    if (!currentUser || !currentUser?.id) {
        return <LoadingComponent />
    }

    return (
        <div className='w-full flex flex-col gap-4 '>
            <DynamicProfileInformation userId={currentUser.id!} />
            <DynamicProfilePosts userId={currentUser.id!} />
        </div>
    );
}

