'use client';

import { useId } from 'react';
import { Timer } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { AppConfirmDialog, AppDialog } from '@/modules/shared';
import { PolicyToggleMenuRow } from '../../shared/ui/PolicyToggleMenuRow';
import { useDeleteChatByTimerChatSetting } from '../lib/hooks/useDeleteChatByTimerChatSetting';
import {
    formatScheduledDeletionRu,
} from '../lib/utils/delete-chat-by-timer.utils';

export type DeleteChatByTimerChatSettingProps = {
    chatId: string;
};

export function DeleteChatByTimerChatSetting({ chatId }: DeleteChatByTimerChatSettingProps) {
    const id = useId();
    const h = useDeleteChatByTimerChatSetting(chatId);

    if (!h.chat) {
        return null;
    }

    const detail =
        h.active && h.chat.scheduledDeletionAt
            ? formatScheduledDeletionRu(h.chat.scheduledDeletionAt)
            : undefined;

    return (
        <>
            <PolicyToggleMenuRow
                icon={<Timer className="h-3.5 w-3.5" />}
                label="Удалить чат по таймеру"
                active={h.active}
                detail={detail}
                onActivate={h.onMenuActivate}
            />

            <AppDialog
                open={h.durationOpen}
                onOpenChange={h.setDurationOpen}
                title="Когда удалить чат"
                description="Чат будет удалён у всех участников в выбранный момент."
                footer={
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => h.setDurationOpen(false)}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="button"
                            onClick={() => void h.applyDuration()}
                            disabled={!h.canApply || h.updateChatPending}
                        >
                            Принять
                        </Button>
                    </>
                }
            >
                <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-del-chat-h`}>Часы</Label>
                        <Input
                            id={`${id}-del-chat-h`}
                            type="number"
                            min={0}
                            max={168}
                            value={h.hours}
                            onChange={e => h.setHours(Number(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-del-chat-m`}>Минуты</Label>
                        <Input
                            id={`${id}-del-chat-m`}
                            type="number"
                            min={0}
                            max={59}
                            value={h.minutes}
                            onChange={e => h.setMinutes(Number(e.target.value))}
                        />
                    </div>
                </div>
            </AppDialog>

            <AppConfirmDialog
                open={h.disableOpen}
                onOpenChange={h.setDisableOpen}
                title="Отключить функцию?"
                description="Автоудаление чата будет снято."
                confirmLabel="Отключить"
                onCancel={() => h.setDisableOpen(false)}
                onConfirm={() => void h.confirmDisable()}
                isConfirming={h.updateChatPending}
            />
        </>
    );
}
