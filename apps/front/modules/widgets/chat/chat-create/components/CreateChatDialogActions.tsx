'use client';

import { AppButton } from '@/modules/shared';

type CreateChatDialogActionsProps = {
    onCancel: () => void;
    onCreateChat: () => void;
    createDisabled: boolean;
};

export function CreateChatDialogActions({
    onCancel,
    onCreateChat,
    createDisabled,
}: CreateChatDialogActionsProps) {
    return (
        <div className="flex w-full gap-2">
            <AppButton
                type="button"
                variant="outline"
                appSize="md"
                className="min-w-0 flex-1"
                onClick={onCancel}
            >
                Отмена
            </AppButton>
            <AppButton
                type="button"
                variant="default"
                appSize="md"
                className="min-w-0 flex-1"
                disabled={createDisabled}
                onClick={onCreateChat}
            >
                Создать
            </AppButton>
        </div>
    );
}
