'use client';

import { useMemo, useState } from 'react';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FollowDto, UserWithFollowStatusDto } from '@workspace/nest-api';
import { useAuth } from '@/modules/processes';
import {
    useAllUsers,
    useMyFollowers,
    useMyFollowing,
} from '@/modules/entities/followers';
import { FilterSegmentStrip } from '@/modules/shared';
import { UserCard } from './UserCard';

type PeopleFilter = 'all' | 'followers' | 'following';

function enrichFromAll(
    basic: { id: string; name: string; email: string },
    map: Map<string, UserWithFollowStatusDto>,
): UserWithFollowStatusDto {
    const full = map.get(basic.id);
    if (full) {
        return full;
    }
    return {
        id: basic.id,
        name: basic.name,
        email: basic.email,
        isFollowing: false,
        isFollower: false,
        isFriend: false,
    };
}

export const Users = () => {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<PeopleFilter>('all');

    const { data: allUsers = [], isLoading: loadingAll } = useAllUsers();
    const { data: myFollowRows = [], isLoading: loadingFollowers } =
        useMyFollowers();
    const { data: myFollowingRows = [], isLoading: loadingFollowing } =
        useMyFollowing();

    const allMap = useMemo(
        () => new Map(allUsers.map((u) => [u.id, u])),
        [allUsers],
    );

    const followerUsers = useMemo((): UserWithFollowStatusDto[] => {
        if (!currentUser?.id) return [];
        return myFollowRows
            .filter((f: FollowDto) => f.followingId === currentUser.id)
            .map((f: FollowDto) => {
                const u = f.follower;
                const base = enrichFromAll(u, allMap);
                return { ...base, isFollower: true };
            });
    }, [myFollowRows, currentUser?.id, allMap]);

    const followingUsers = useMemo((): UserWithFollowStatusDto[] => {
        if (!currentUser?.id) return [];
        return myFollowingRows
            .filter((f: FollowDto) => f.followerId === currentUser.id)
            .map((f: FollowDto) => {
                const u = f.following;
                return enrichFromAll(u, allMap);
            });
    }, [myFollowingRows, currentUser?.id, allMap]);

    const sourceList = useMemo(() => {
        if (filter === 'followers') return followerUsers;
        if (filter === 'following') return followingUsers;
        return allUsers;
    }, [filter, allUsers, followerUsers, followingUsers]);

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return sourceList;
        return sourceList.filter(
            (user) =>
                user.name.toLowerCase().includes(q) ||
                user.email.toLowerCase().includes(q),
        );
    }, [sourceList, search]);

    const loading =
        loadingAll ||
        (filter === 'followers' && loadingFollowers) ||
        (filter === 'following' && loadingFollowing);

    return (
        <div className="flex flex-col gap-4 h-[75vh] min-h-0">
            <h1 className="text-2xl font-bold">Пользователи</h1>
            <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                    Назад
                </Button>
                <Input
                    type="text"
                    placeholder="Поиск"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="min-h-10 min-w-0 flex-1"
                />
            </div>
            <FilterSegmentStrip<PeopleFilter>
                value={filter}
                onChange={setFilter}
                options={[
                    { value: 'all', label: 'All people' },
                    { value: 'followers', label: 'Followers' },
                    { value: 'following', label: 'Following' },
                ]}
            />

            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto max-md:-mx-2 max-md:w-[calc(100%+1rem)] sm:mx-0 sm:w-full">
                {loading ? (
                    <p className="text-sm text-muted-foreground">Загрузка…</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {filteredUsers.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
