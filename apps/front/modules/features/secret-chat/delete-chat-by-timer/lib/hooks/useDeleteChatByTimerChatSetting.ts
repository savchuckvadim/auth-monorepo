'use client';

import { useCallback, useMemo, useState } from 'react';
import { useChatById, useUpdateChat } from '@/modules/entities/chats';
import {
    canApplyChatDeletionMs,
    clampHoursMinutes,
    durationToMs,
} from '../../../shared/lib/utils/duration-input.utils';
import {
    defaultHoursMinutesForChatDeletion,
    isChatDeletionScheduled,
} from '../utils/delete-chat-by-timer.utils';

export function useDeleteChatByTimerChatSetting(chatId: string) {
    const { data: chat } = useChatById(chatId);
    const updateChat = useUpdateChat();

    const [durationOpen, setDurationOpen] = useState(false);
    const [disableOpen, setDisableOpen] = useState(false);
    const [hours, setHours] = useState(1);
    const [minutes, setMinutes] = useState(0);

    const active = useMemo(
        () => (chat ? isChatDeletionScheduled(chat) : false),
        [chat],
    );

    const openDurationDialog = useCallback(() => {
        const d = defaultHoursMinutesForChatDeletion();
        setHours(d.h);
        setMinutes(d.m);
        setDurationOpen(true);
    }, []);

    const { h: hClamped, m: mClamped } = clampHoursMinutes(hours, minutes);
    const msTotal = durationToMs(hClamped, mClamped);
    const canApply = canApplyChatDeletionMs(msTotal);

    const applyDuration = useCallback(async () => {
        if (!canApplyChatDeletionMs(msTotal)) return;
        const when = new Date(Date.now() + msTotal).toISOString();
        await updateChat.mutateAsync({
            id: chatId,
            data: { scheduledDeletionAt: when },
        });
        setDurationOpen(false);
    }, [chatId, msTotal, updateChat]);

    const confirmDisable = useCallback(async () => {
        await updateChat.mutateAsync({
            id: chatId,
            data: { scheduledDeletionAt: null },
        });
        setDisableOpen(false);
    }, [chatId, updateChat]);

    const onMenuActivate = useCallback(() => {
        if (active) {
            setDisableOpen(true);
        } else {
            openDurationDialog();
        }
    }, [active, openDurationDialog]);

    return {
        chat,
        active,
        durationOpen,
        setDurationOpen,
        disableOpen,
        setDisableOpen,
        hours,
        setHours,
        minutes,
        setMinutes,
        canApply,
        applyDuration,
        confirmDisable,
        onMenuActivate,
        updateChatPending: updateChat.isPending,
    };
}
