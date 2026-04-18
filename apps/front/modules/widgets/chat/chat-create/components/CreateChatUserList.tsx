'use client';

import { Users } from 'lucide-react';
import type { UserWithFollowStatusDto } from '@workspace/nest-api';

import { CreateChatUserRow } from './CreateChatUserRow';

type CreateChatUserListProps = {
    currentUserId: string;
    allUsers: UserWithFollowStatusDto[] | undefined;
    selectedUserIds: string[];
    onUserToggle: (userId: string) => void;
};

export function CreateChatUserList({
    currentUserId,
    allUsers,
    selectedUserIds,
    onUserToggle,
}: CreateChatUserListProps) {
    const others = allUsers?.filter((u) => u.id !== currentUserId) ?? [];

    return (
        <div className="mb-4 h-64 overflow-y-auto">
            {others.map((user) => (
                <CreateChatUserRow
                    key={user.id}
                    user={user}
                    selected={selectedUserIds.includes(user.id)}
                    onToggle={() => onUserToggle(user.id)}
                />
            ))}
        </div>
    );
}
