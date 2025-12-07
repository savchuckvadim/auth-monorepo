'use client'
import React from 'react';

import Orb from '@workspace/ui/components/Orb';
import { cn } from '@workspace/ui/lib/utils';



export const Hero2: React.FC = () => {

    return (
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
            <div className="absolute inset-0">
                <Orb hoverIntensity={0.2} />
            </div>


            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white">   Auth Monorepo App </h1>
                </div>
            </div>
        </section>
    );
};

