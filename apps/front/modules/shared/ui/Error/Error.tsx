
'use client';

import ErrorIcon from '../icons/ui/ErrorIcon';
import { EIconColor } from '../icons';
import { useTheme } from 'next-themes';

export const ERROR_TEXT = 'Oh shit... Something went wrong';

export const ErrorComponent = ({ text }: { text?: string }) => {
    const { theme } = useTheme()
    const isDarkMode = theme?.includes('dark')
    const color = isDarkMode ? EIconColor.RED : EIconColor.GRAY
    const errorText = text || ERROR_TEXT;
    return (
        <div className="bg-background h-[80vh] w-full flex justify-center items-center">

            <div  >
                <div className=" flex-col justify-center items-center">

                    <ErrorIcon />
                    <p
                        style={{ color }}
                        className='text-center opacity-70'>{errorText}</p>

                </div>

            </div>

        </div>
    );
};
