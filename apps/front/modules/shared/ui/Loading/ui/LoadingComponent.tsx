'use client';

import { useTheme } from 'next-themes';
import './loading.css';

import Image from 'next/image';
import { cn } from '@workspace/ui/lib/utils';
export const LoadingComponent = () => {

    const { theme } = useTheme();

    const isDarkMode = theme?.includes('dark');



    return (
        <div className="bg-background h-[80vh] w-full flex justify-center items-center">

            <div  >
                <div className=" flex-col justify-center items-center">

                    <Image
                        src="/grey-logo.svg"
                        alt="Logo"
                        width={120}
                        height={120}
                        className={cn("backgound:invert", !isDarkMode && "opacity-20")}
                        priority
                    />
                    <p className='text-muted-foreground/20 text-center'>Loading...</p>
                </div>

            </div>

        </div>
    );
};
