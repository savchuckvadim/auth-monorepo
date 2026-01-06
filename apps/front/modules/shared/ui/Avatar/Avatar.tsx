'use client';

import Image from 'next/image';
import { cn } from '@workspace/ui/lib/utils';
import { AvatarFallback, AvatarImage, Avatar as AvatarRoot } from '@workspace/ui/components/avatar';
import { usePresence } from '@/modules/entities';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    isOnline?: boolean;
    className?: string;
}

const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
};

const indicatorSizeMap = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
};

export const Avatar = ({ src, alt, name, size = 'md', isOnline, className }: AvatarProps) => {
    const sizeClass = sizeMap[size];
    const indicatorClass = indicatorSizeMap[size];
    const initials = name?.charAt(0)?.toUpperCase() || '?';
    const { getIsUserOnline } = usePresence();
    return (
        <div className={cn('relative', sizeClass, className)}>
            {src ? (
                <Image
                    src={src}
                    alt={alt || name || 'Avatar'}
                    fill
                    className="rounded-full object-cover"
                    unoptimized={true}
                />
            ) : (
                <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">{initials}</span>
                </div>
            )}
            {isOnline !== undefined && (
                <div
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full border-2 border-background',
                        indicatorClass,
                        isOnline ? 'bg-[#F44848]' : 'bg-gray-400'
                    )}
                />
            )}
        </div>
        // <div className={cn('relative', sizeClass, className)}>
        //     <AvatarRoot>
        //         <AvatarImage src={src as string || ''} />
        //         <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        //     </AvatarRoot>
        //     {isOnline !== undefined && (
        //         <div className={cn(
        //             'absolute bottom-0 right-0 rounded-full border-2 border-background',
        //             indicatorClass,
        //             isOnline ? 'bg-[#F44848]' : 'bg-gray-400'
        //         )} />
        //     )}
        // </div>
    );
};

