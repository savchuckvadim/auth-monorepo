'use client';

import { Trash2 } from 'lucide-react';
import { AppConfirmDialog, DropdownMenuItem } from '@/modules/shared';
import { useDeleteChatSetting } from '../lib/hooks/useDeleteChatSetting';

export type DeleteChatSettingProps = {
    chatId: string;
};

export function DeleteChatSetting({ chatId }: DeleteChatSettingProps) {
    const h = useDeleteChatSetting(chatId);

    return (
        <>
            <DropdownMenuItem
                className="text-destructive focus:text-destructive gap-2"
                onSelect={e => {
                    e.preventDefault();
                    h.setConfirmOpen(true);
                }}
            >
                <Trash2 className="h-4 w-4" />
                Удалить чат
            </DropdownMenuItem>

            <AppConfirmDialog
                open={h.confirmOpen}
                onOpenChange={h.setConfirmOpen}
                title="Удалить чат?"
                description="Переписка будет удалена для вас и собеседника. Это действие нельзя отменить."
                confirmLabel="Удалить"
                confirmVariant="destructive"
                onCancel={() => h.setConfirmOpen(false)}
                onConfirm={() => void h.confirmDelete()}
                isConfirming={h.deleteChatPending}
            />
        </>
    );
}
