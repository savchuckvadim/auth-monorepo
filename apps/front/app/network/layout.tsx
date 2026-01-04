'use client'
import React from 'react';

import { cn } from '@workspace/ui/lib/utils';
import { useAuth } from '@/modules/processes/auth';
import { LoadingScreen } from '@/modules/shared';
import { Header, Navigation } from '@/modules/widgetes';



export default function NetworkLayout({ children }: { children: React.ReactNode }) {
    const { currentUser } = useAuth();
    if (!currentUser || !currentUser.id) {
        return <LoadingScreen />
    }
    return (
        <div className="h-screen flex flex-col scrollbar-hide bg-background">
            <Header />
            <main className="flex-grow ">

                <div
                    className={"relative min-h-screen flex items-center justify-center overflow-hidden"}

                >
                    <div className={
                        cn(
                            'container mx-auto p-0 sm:px-6 lg:px-4 md:p-4 flex flex-row md:gap-4',
                        )
                    }>

                        <div className='w-0 md:block md:w-1/6 h-screen  pt-20'>
                            <Navigation />
                        </div>

                        <div className='w-full md:w-5/6 flex flex-col gap-4 pt-20 pb-20 md:pb-4'>
                            <div className="container mx-auto p-2 sm:px-6 lg:px-0 ">

                                {children}

                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}

