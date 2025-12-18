'use client';

import { useEffect, useState } from 'react';
import './loading.css';

import { usePace } from '../hooks/usePace';
import GradientText from '@workspace/ui/components/GradientText';


export const LoadingScreen = () => {
    const [isVisible, setIsVisible] = useState(true);

    usePace();
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2000); // 3 секунды прелоадер

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="">

            {isVisible && (
                <div

                >
                    <div className="bg-gray-700 center-spinner flex flex-col justify-center items-center h-full w-full">


                        <GradientText
                            colors={['#bb52d4', '#30c3ef', '#bb52d4', '#30c3ef',]}
                        >   <p className="mt-1 text-md tracking-widest font-bold ">
                                Загрузка...
                            </p>
                        </GradientText>

                    </div>



                </div>
            )}
        </div>
    );
};



