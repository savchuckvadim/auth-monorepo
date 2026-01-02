'use client'
import React from 'react';

import { cn } from '@workspace/ui/lib/utils';
import { useAuth } from '@/modules/processes/auth';
import { LoadingScreen } from '@/modules/shared';
import { Header } from '@/modules/widgetes';


export default function NetworkLayout({ children }: { children: React.ReactNode }) {
    const { currentUser } = useAuth();
    if (!currentUser || !currentUser.id) {
        return <LoadingScreen />
    }
    return (
        <div className="min-h-screen flex flex-col scrollbar-hide bg-background">
            <Header />
            <main className="flex-grow">

                <section id="hero" className={
                    cn(
                        "relative min-h-screen flex items-center justify-center overflow-hidden"
                    )
                }

                >

                    <div className="container mx-auto px-4 sm:px-6 lg:px-4 relative z-10">

                        {children}

                    </div>
                </section>

            </main>

        </div>
    );
}

