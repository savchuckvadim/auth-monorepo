
'use client';
import Image from 'next/image';

;
export const ErrorComponent = ({ text }: { text?: string }) => {


    return (
        <div className="bg-background h-[80vh] w-full flex justify-center items-center">

            <div  >
                <div className=" flex-col justify-center items-center">

                    <Image
                        src="/404.svg"
                        alt="Error"
                        width={120}
                        height={120}
                        className="backgound:invert opacity-20"
                        priority
                    />
                    {text && <p className='text-primary/30  text-center'>{text}</p>}
                </div>

            </div>

        </div>
    );
};
