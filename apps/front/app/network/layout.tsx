'use client'
import React from 'react';
import Orb from '@workspace/ui/components/Orb';
import { cn } from '@workspace/ui/lib/utils';
// import dynamic from 'next/dynamic';
import { useAuth } from '@/modules/processes/auth';
import { LoadingScreen } from '@/modules/shared';
import { Header } from '@/modules/widgetes';


// const DynamicHeader = dynamic(() => import('../../modules/widgetes').then(mod => mod.Header), {
//     ssr: false,
// });


export default function NetworkLayout({ children }: { children: React.ReactNode }) {
    const { currentUser } = useAuth();
    if (!currentUser || !currentUser.id) {
        return <LoadingScreen />
    }
    return (
        <div className="min-h-screen flex flex-col scrollbar-hide">
            <Header />
            <main className="flex-grow">

                <section id="hero" className={
                    cn(
                        "relative min-h-screen flex items-center justify-center overflow-hidden"
                    )
                }
                    style={{
                        backgroundColor: '#292b37'
                    }}
                >
                    {/* Video Background */}
                    <div className="absolute inset-0 opacity-50">
                        <Orb hoverIntensity={0.2} />
                    </div>


                    {/* Content */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* <h1 className="text-4xl font-bold text-white">   Auth Monorepo App </h1> */}
                            {children}
                        </div>
                    </div>
                </section>

            </main>

        </div>
    );
}

