'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useUploadAvatar } from '@/modules/entities/profile';
import { ProfileDto } from '@workspace/nest-api';

interface ProfileAvatarProps {
    profile: ProfileDto;
    isOwnProfile: boolean;
    userName: string;
}

export function ProfileAvatar({ userName, profile, isOwnProfile }: ProfileAvatarProps) {
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadAvatar = useUploadAvatar();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await uploadAvatar.mutateAsync(file);
            } catch (error) {
                console.error('Failed to upload avatar:', error);
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
            className="relative w-[100px] h-[100px] rounded-full border-4 border-white shadow-lg cursor-pointer group"
            onMouseEnter={() => isOwnProfile && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            {profile.avatar ? (
                <Image
                    src={profile.avatar}
                    alt="avatar"
                    fill
                    className="object-cover rounded-full"
                    unoptimized={true}
                />
            ) : (
                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                        {(profile.name || userName)?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                </div>
            )}

            {/* Overlay при наведении для собственного профиля */}
            {isOwnProfile && isHovered && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium text-center px-2">
                        {profile.avatar ? 'Изменить' : 'Добавить'}
                    </span>
                </div>
            )}

            {/* Индикатор загрузки */}
            {uploadAvatar.isPending && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

