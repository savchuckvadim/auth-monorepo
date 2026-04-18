'use client';

import { useApp } from '@/modules/app';
import { LoadingScreen } from '@/modules/shared';
import { AuthHeader } from '@/modules/shared/ui/AuthHeader';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isClient } = useApp();
    if (!isClient) {
        return <LoadingScreen />;
    }
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-mainBackground">
            <Image
                className="pointer-events-none absolute inset-0 z-0 object-contain opacity-10"
                src="/logo.svg"
                alt=""
                fill
                priority
                sizes="100vw"
                aria-hidden
            />
            <AuthHeader />
            <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
    );
}
