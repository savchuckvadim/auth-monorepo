'use client'
import { useProfile } from '@/modules/entities/profile';
import { useAuth } from '@/modules/processes';
import { Button } from '@workspace/ui/components/button';
import { ProfileHero } from './ProfileHero';
import { ProfileAvatar } from './ProfileAvatar';

export default function ProfileInformation({ userId }: { userId: string }) {
    const { currentUser } = useAuth()
    if (!currentUser) {
        return <div>Loading...</div>
    }
    const { profile, isLoading, error, posts, followers, following, slogan } = useProfile(userId)
    const isOwnProfile = currentUser?.id === userId

    if (isLoading || !profile) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }
    return (
        <div className="relative w-full  mx-auto border rounded-3xl overflow-hidden bg-card shadow-md">
            {/* Верхняя часть с фоном */}
            <ProfileHero profile={profile} isOwnProfile={isOwnProfile} />

            {/* Аватар */}
            <div className="absolute top-[230px] sm:top-[300px] left-1/2 -translate-x-1/2 -translate-y-1/2">
                <ProfileAvatar userName={currentUser?.name || ''} profile={profile} isOwnProfile={isOwnProfile} />
            </div>

            {/* Основной контент */}
            <div className="flex flex-col items-center text-center mt-16 px-6 pb-6">
                <h2 className="text-mainBackground font-bold text-2xl mb-2">{profile?.name}</h2>
                <p className="text-gray-600 text-sm mb-4">
                    {slogan}
                </p>

                {/* Статистика */}
                <div className="flex justify-between w-full max-w-md mb-6">
                    <div className="flex flex-col items-center">
                        <p className="text-mainBackground font-bold text-md">{posts}</p>
                        <p className="text-gray-500 text-sm">Posts</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-mainBackground font-bold text-md">{following}</p>
                        <p className="text-gray-500 text-sm">Following</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-mainBackground font-bold text-md">{followers}</p>
                        <p className="text-gray-500 text-sm">Followers</p>
                    </div>
                </div>

                {/* Кнопки */}
                {!isOwnProfile && <div className="flex flex-wrap gap-4 justify-center w-full">
                    <Button
                        className="w-full sm:w-[48%] h-[50px]"
                        onClick={() => console.log('follow')}
                        variant="default"
                    >
                        Follow
                    </Button>
                    <Button
                        className="w-full sm:w-[48%] h-[50px]"
                        onClick={() => console.log('send message')}
                        variant="outline"
                    >
                        Send Message
                    </Button>
                </div>}

                {isOwnProfile && <div className="flex flex-wrap gap-4 justify-center w-full">
                    <Button
                        className="w-full  h-[50px]"
                        onClick={() => console.log('follow')}
                        variant="default"
                    >
                        Edit Profile
                    </Button>

                </div>}
            </div>
        </div>
    );
}
