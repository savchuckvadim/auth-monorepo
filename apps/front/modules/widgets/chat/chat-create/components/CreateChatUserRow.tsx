'use client';

import { Users } from 'lucide-react';
import type { UserWithFollowStatusDto } from '@workspace/nest-api';

type CreateChatUserRowProps = {
    user: UserWithFollowStatusDto;
    selected: boolean;
    onToggle: () => void;
};

export function CreateChatUserRow({
    user,
    selected,
    onToggle,
}: CreateChatUserRowProps) {
    return (
        <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between rounded-md p-2 text-left hover:bg-accent"
            onClick={onToggle}
        >
            <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            {selected ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Users className="h-3 w-3 text-primary-foreground" />
                </div>
            ) : null}
        </button>
    );
}
