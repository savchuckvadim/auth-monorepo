'use client';

import { AppDialog } from '@/modules/shared';
import type { UserWithFollowStatusDto } from '@workspace/nest-api';

import { CreateChatDialogActions } from './components/CreateChatDialogActions';
import { CreateChatSecurePrivateOption } from './components/CreateChatSecurePrivateOption';
import { CreateChatUserList } from './components/CreateChatUserList';

export type CreateChatDialogWidgetProps = {
    isOpen: boolean;
    currentUserId: string;
    allUsers: UserWithFollowStatusDto[] | undefined;
    selectedUserIds: string[];
    onUserToggle: (userId: string) => void;
    onCreateChat: () => void;
    onCancel: () => void;
    isPending: boolean;
    /** When exactly one user is selected: create private chat with Signal E2EE. */
    securePrivateChat?: boolean;
    onSecurePrivateChatChange?: (value: boolean) => void;
};

export function CreateChatDialogWidget({
    isOpen,
    currentUserId,
    allUsers,
    selectedUserIds,
    onUserToggle,
    onCreateChat,
    onCancel,
    isPending,
    securePrivateChat = false,
    onSecurePrivateChatChange,
}: CreateChatDialogWidgetProps) {
    const isPrivate1to1 = selectedUserIds.length === 1;
    const showSecureOption = isPrivate1to1 && !!onSecurePrivateChatChange;

    return (
        <AppDialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onCancel();
            }}
            title="Создать диалог"
            description="Выберите пользователей для создания чата"
            contentClassName="sm:max-w-lg"
            footer={
                <CreateChatDialogActions
                    onCancel={onCancel}
                    onCreateChat={onCreateChat}
                    createDisabled={selectedUserIds.length === 0 || isPending}
                />
            }
        >
            <CreateChatUserList
                currentUserId={currentUserId}
                allUsers={allUsers}
                selectedUserIds={selectedUserIds}
                onUserToggle={onUserToggle}
            />
            {showSecureOption && onSecurePrivateChatChange ? (
                <CreateChatSecurePrivateOption
                    checked={securePrivateChat}
                    onCheckedChange={onSecurePrivateChatChange}
                />
            ) : null}
        </AppDialog>
    );
}
