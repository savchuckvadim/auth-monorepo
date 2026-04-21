'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useUploadHero } from '@/modules/entities/profile';
import { ProfileDto } from '@workspace/nest-api';

interface ProfileHeroProps {
    profile: ProfileDto;
    isOwnProfile: boolean;
}

export function ProfileHero({ profile, isOwnProfile }: ProfileHeroProps) {
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadHero = useUploadHero();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await uploadHero.mutateAsync(file);
            } catch (error) {
                console.error('Failed to upload hero:', error);
            }
        }
    };

    const handleClick = () => {
        if (isOwnProfile && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div
            className="relative h-[250px] sm:h-[300px] cursor-pointer group "
            onMouseEnter={() => isOwnProfile && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            {profile.hero ? (
                <Image
                    src={profile.hero}
                    alt="profile hero"
                    fill
                    className="object-cover"
                    priority
                    unoptimized={true}
                    onError={(e) => {
                        console.error('Failed to load hero image:', profile.hero);
                        console.error('Error:', e);
                    }}
                />
            ) : (
                <div className="relative h-[250px] sm:h-[300px]">
                    <Image
                        src="/logo.svg"
                        alt="default hero"
                        fill
                        className="object-cover opacity-50"
                        priority
                    />
                </div>
            )}

            {/* Overlay при наведении для собственного профиля */}
            {isOwnProfile && isHovered && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                        {profile.hero ? 'Изменить обложку' : 'Добавить обложку'}
                    </span>
                </div>
            )}

            {/* Индикатор загрузки */}
            {uploadHero.isPending && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}

