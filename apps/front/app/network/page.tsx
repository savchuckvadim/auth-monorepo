'use client'
import React, { useEffect } from 'react';
import { Hero2 } from './components/Hero2';
import { Header } from './components/Header';
import { useAuth } from '@/modules/processes';
import LoadingScreen from '@/modules/shared/components/LoadingScreen/ui/LoadingScreen';





export default function HomePage() {
    const { currentUser } = useAuth();
    if (!currentUser || !currentUser.id) {
        return <LoadingScreen />
    }

    return (
        <div className="min-h-screen flex flex-col scrollbar-hide">
            <Header />
            <main className="flex-grow">

                <Hero2 userId={currentUser?.id!} />

            </main>

        </div>
    );
}

