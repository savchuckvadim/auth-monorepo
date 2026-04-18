'use client';

import { Button } from '@workspace/ui/components/button';

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
        <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
                Отмена
            </Button>
            <Button
                onClick={onCreateChat}
                disabled={createDisabled}
                className="flex-1"
            >
                Создать
            </Button>
        </div>
    );
}
