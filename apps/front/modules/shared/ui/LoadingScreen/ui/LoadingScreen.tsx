'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './loading.css';

import Image from 'next/image';
export const LoadingScreen = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000); // 3 секунды прелоадер

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-white">
            {isVisible &&

                (
                    <motion.div
                        className="loading-screen bg-foreground"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                        <div className="center-spinner color-primary flex flex-col justify-center items-center">

                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={120}
                                height={85}
                                className="backgound:invert"
                                priority
                            />
                            <p className='text-primary'>Loading...</p>
                        </div>


                    </motion.div>
                )}
        </div>
    );
};
