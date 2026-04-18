'use client';

import {
    AppCard,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/modules/shared/ui';
import { UserWithFollowStatusDto } from '@workspace/nest-api';

import { CreateChatDialogActions } from './CreateChatDialogActions';
import { CreateChatDialogOverlay } from './CreateChatDialogOverlay';
import { CreateChatSecurePrivateOption } from './CreateChatSecurePrivateOption';
import { CreateChatUserList } from './CreateChatUserList';

interface CreateChatDialogWidgetProps {
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
}

export const CreateChatDialogWidget = ({
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
}: CreateChatDialogWidgetProps) => {
    if (!isOpen) return null;

    const isPrivate1to1 = selectedUserIds.length === 1;
    const showSecureOption = isPrivate1to1 && !!onSecurePrivateChatChange;

    return (
        <CreateChatDialogOverlay>
            <AppCard>
                <CardHeader>
                    <CardTitle>Создать диалог</CardTitle>
                    <CardDescription>
                        Выберите пользователей для создания чата
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateChatUserList
                        currentUserId={currentUserId}
                        allUsers={allUsers}
                        selectedUserIds={selectedUserIds}
                        onUserToggle={onUserToggle}
                    />
                    {showSecureOption && onSecurePrivateChatChange && (
                        <CreateChatSecurePrivateOption
                            checked={securePrivateChat}
                            onCheckedChange={onSecurePrivateChatChange}
                        />
                    )}
                    <CreateChatDialogActions
                        onCancel={onCancel}
                        onCreateChat={onCreateChat}
                        createDisabled={
                            selectedUserIds.length === 0 || isPending
                        }
                    />
                </CardContent>
            </AppCard>
        </CreateChatDialogOverlay>
    );
};
