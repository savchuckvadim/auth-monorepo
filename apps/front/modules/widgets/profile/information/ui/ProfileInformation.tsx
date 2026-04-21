'use client';
import { useProfile } from '@/modules/entities/profile';
import { useAuth } from '@/modules/processes';
import { AppButton, AppSurfaceCard } from '@/modules/shared';
import { ProfileHero } from './ProfileHero';
import { ProfileAvatar } from './ProfileAvatar';
import { ChatDtoEncryptionMode } from '@workspace/nest-api';
import { LoadingComponent } from '@/modules/shared/ui/Loading/ui/LoadingComponent';
import { useEnsurePrivateChat } from '@/modules/entities/chats';
import {
    useFollow,
    useUnfollow,
    useUserById,
} from '@/modules/entities/followers';
import { Lock } from 'lucide-react';

export default function ProfileInformation({ userId }: { userId: string }) {
    const { currentUser } = useAuth();
    const { navigateToPrivateChat, isPending } = useEnsurePrivateChat();
    const { profile, isLoading, error, posts, followers, following, slogan } =
        useProfile(userId);
    const isOwnProfile = currentUser?.id === userId;
    const { data: followUser } = useUserById(userId, {
        enabled: !isOwnProfile,
    });
    const { mutate: followMutate, isPending: followPending } = useFollow();
    const { mutate: unfollowMutate, isPending: unfollowPending } =
        useUnfollow();

    if (!currentUser) {
        return <LoadingComponent />
    }
    if (isLoading || !profile) {
        return <LoadingComponent />
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    return (
        <AppSurfaceCard
            variant="emphasis"
            className="relative mx-auto w-full overflow-hidden rounded-3xl"
        >
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
                {!isOwnProfile && followUser && (
                    <div className="flex min-w-full max-w-md flex-col sm:flex-row gap-3 w-full">
                        {followUser.isFollowing ? (
                            <AppButton
                                type="button"
                                variant="secondary"
                                appSize="md"
                                className="w-full sm:w-1/2 font-medium text-muted-foreground"
                                isLoading={unfollowPending}
                                loadingLabel="…"
                                onClick={() => unfollowMutate(userId)}
                            >
                                Unfollow
                            </AppButton>
                        ) : (
                            <AppButton
                                type="button"
                                variant="default"
                                appSize="md"
                                className="w-full sm:w-1/2 font-semibold"
                                isLoading={followPending}
                                loadingLabel="…"
                                onClick={() => followMutate(userId)}
                            >
                                Follow
                            </AppButton>
                        )}

                        <AppButton
                            type="button"
                            variant="outline"
                            appSize="md"
                            className="w-full sm:w-1/2"
                            isLoading={isPending}
                            loadingLabel="…"
                            onClick={() =>
                                void navigateToPrivateChat(
                                    userId,
                                    ChatDtoEncryptionMode.NONE,
                                )
                            }
                        >
                            Написать
                        </AppButton>

                        {/* <AppButton
                            type="button"
                            variant="outline"
                            appSize="md"
                            className=""
                            isLoading={isPending}
                            loadingLabel="…"
                            leadIcon={<Lock className="size-4" />}
                            onClick={() =>
                                void navigateToPrivateChat(
                                    userId,
                                    ChatDtoEncryptionMode.SIGNAL,
                                )
                            }
                        >
                            Защищённый чат
                        </AppButton> */}
                    </div>
                )}

                {isOwnProfile && (
                    <div className="flex min-w-full max-w-md flex-col gap-3">
                        <AppButton
                            type="button"
                            variant="default"
                            appSize="md"
                            className="w-full"
                            onClick={() => console.log('edit profile')}
                        >
                            Edit Profile
                        </AppButton>
                    </div>
                )}
            </div>
        </AppSurfaceCard>
    );
}
