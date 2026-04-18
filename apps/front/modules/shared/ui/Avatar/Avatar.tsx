'use client';

import Image from 'next/image';
import { cn } from '@workspace/ui/lib/utils';
import { AvatarFallback, AvatarImage, Avatar as AvatarRoot } from '@workspace/ui/components/avatar';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'userCard';
    isOnline?: boolean;
    className?: string;
}

const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    /** Карточка пользователя: 93×93 */
    userCard: 'h-[93px] w-[93px]',
};

const indicatorSizeMap = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
    /** Чуть меньше относительно 93px, чтобы сидел на дуге, а не на углу бокса */
    userCard: 'h-4 w-4',
};

/** Угол квадратного бокса не на дуге круга — сдвиг к центру дуги */
const indicatorPositionMap: Partial<
    Record<NonNullable<AvatarProps['size']>, string>
> = {
    userCard: 'bottom-1 right-1',
};

const initialsClassMap = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-2xl',
    userCard: 'text-2xl',
} as const;

export const Avatar = ({ src, alt, name, size = 'md', isOnline, className }: AvatarProps) => {
    const sizeClass = sizeMap[size];
    const indicatorClass = indicatorSizeMap[size];
    const indicatorPosition = indicatorPositionMap[size] ?? 'bottom-0 right-0';
    const initials = name?.charAt(0)?.toUpperCase() || '?';
    const initialsClass = initialsClassMap[size];
    const isUserCard = size === 'userCard';
    return (
        <div className={cn('relative', sizeClass, className)}>
            <div
                className={cn(
                    'relative h-full w-full overflow-hidden rounded-full',
                    isUserCard && 'ring-2 ring-inset ring-background',
                )}
            >
                {src ? (
                    <Image
                        src={src}
                        alt={alt || name || 'Avatar'}
                        fill
                        className="rounded-full object-cover"
                        unoptimized={true}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20">
                        <span className={cn('text-primary font-semibold', initialsClass)}>
                            {initials}
                        </span>
                    </div>
                )}
            </div>
            {isOnline !== undefined && (
                <div
                    className={cn(
                        'absolute rounded-full border-2 border-background',
                        indicatorPosition,
                        indicatorClass,
                        isOnline ? 'bg-[#F44848]' : 'bg-gray-400',
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

