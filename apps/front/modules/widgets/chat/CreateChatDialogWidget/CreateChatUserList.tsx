'use client';

import { Users } from 'lucide-react';
import { UserWithFollowStatusDto } from '@workspace/nest-api';

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
    return (
        <div className="h-64 mb-4 overflow-y-auto">
            {allUsers
                ?.filter((u) => u.id !== currentUserId)
                .map((user: UserWithFollowStatusDto) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => onUserToggle(user.id)}
                    >
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                        {selectedUserIds.includes(user.id) && (
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <Users className="h-3 w-3 text-primary-foreground" />
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
}
