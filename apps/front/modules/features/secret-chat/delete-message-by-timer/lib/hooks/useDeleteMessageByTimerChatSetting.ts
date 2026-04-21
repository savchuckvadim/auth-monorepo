'use client';

import { useCallback, useMemo, useState } from 'react';
import { useChatById, useUpdateChat } from '@/modules/entities/chats';
import {
    canApplyDisappearingSeconds,
    clampHoursMinutes,
    durationToSeconds,
} from '../../../shared/lib/utils/duration-input.utils';
import {
    defaultHoursMinutesForDisappearing,
    isDisappearingMessagesOn,
} from '../utils/delete-message-by-timer.utils';

export function useDeleteMessageByTimerChatSetting(chatId: string) {
    const { data: chat } = useChatById(chatId);
    const updateChat = useUpdateChat();

    const [durationOpen, setDurationOpen] = useState(false);
    const [disableOpen, setDisableOpen] = useState(false);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(30);

    const active = useMemo(
        () => (chat ? isDisappearingMessagesOn(chat) : false),
        [chat],
    );

    const openDurationDialog = useCallback(() => {
        const d = defaultHoursMinutesForDisappearing();
        setHours(d.h);
        setMinutes(d.m);
        setDurationOpen(true);
    }, []);

    const { h: hClamped, m: mClamped } = clampHoursMinutes(hours, minutes);
    const secTotal = durationToSeconds(hClamped, mClamped);
    const canApply = canApplyDisappearingSeconds(secTotal);

    const applyDuration = useCallback(async () => {
        if (!canApplyDisappearingSeconds(secTotal)) return;
        await updateChat.mutateAsync({
            id: chatId,
            data: { disappearingMessageSeconds: secTotal },
        });
        setDurationOpen(false);
    }, [chatId, secTotal, updateChat]);

    const confirmDisable = useCallback(async () => {
        await updateChat.mutateAsync({
            id: chatId,
            data: { disappearingMessageSeconds: null },
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
