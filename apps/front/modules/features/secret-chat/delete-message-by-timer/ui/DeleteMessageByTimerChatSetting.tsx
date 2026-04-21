'use client';

import { useId } from 'react';
import { Hourglass } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { AppConfirmDialog, AppDialog } from '@/modules/shared';
import { PolicyToggleMenuRow } from '../../shared/ui/PolicyToggleMenuRow';
import { useDeleteMessageByTimerChatSetting } from '../lib/hooks/useDeleteMessageByTimerChatSetting';
import { formatDisappearingDetail } from '../lib/utils/delete-message-by-timer.utils';

export type DeleteMessageByTimerChatSettingProps = {
    chatId: string;
};

export function DeleteMessageByTimerChatSetting({
    chatId,
}: DeleteMessageByTimerChatSettingProps) {
    const uid = useId();
    const h = useDeleteMessageByTimerChatSetting(chatId);

    if (!h.chat) {
        return null;
    }

    const detail =
        h.active && h.chat.disappearingMessageSeconds
            ? formatDisappearingDetail(h.chat.disappearingMessageSeconds)
            : undefined;

    return (
        <>
            <PolicyToggleMenuRow
                icon={<Hourglass className="h-3.5 w-3.5" />}
                label="Удалять сообщения по таймеру"
                active={h.active}
                detail={detail}
                onActivate={h.onMenuActivate}
            />

            <AppDialog
                open={h.durationOpen}
                onOpenChange={h.setDurationOpen}
                title="Через сколько удалять новые сообщения"
                description="Каждое новое сообщение получит время жизни; по истечении оно скрывается."
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
                        <Label htmlFor={`${uid}-msg-h`}>Часы</Label>
                        <Input
                            id={`${uid}-msg-h`}
                            type="number"
                            min={0}
                            max={168}
                            value={h.hours}
                            onChange={e => h.setHours(Number(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${uid}-msg-m`}>Минуты</Label>
                        <Input
                            id={`${uid}-msg-m`}
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
                description="Исчезающие сообщения будут отключены для новых сообщений."
                confirmLabel="Отключить"
                onCancel={() => h.setDisableOpen(false)}
                onConfirm={() => void h.confirmDisable()}
                isConfirming={h.updateChatPending}
            />
        </>
    );
}
