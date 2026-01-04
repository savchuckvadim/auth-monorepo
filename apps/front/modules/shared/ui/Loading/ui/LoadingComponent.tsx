'use client';

import './loading.css';

import Image from 'next/image';
export const LoadingComponent = () => {
    // const [isVisible, setIsVisible] = useState(true);

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsVisible(false);
    //     }, 3000); // 3 секунды прелоадер

    //     return () => clearTimeout(timer);
    // }, []);

    return (
        <div className="bg-white">



            <div
                className="bg-foreground"

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


            </div>

        </div>
    );
};
