'use client';

import { useEffect, useRef, useState } from 'react';
import {
    MAX_CHAT_MESSAGE_LENGTH,
    useUpdateMessage,
    useTypingEmit,
    useUploadMessageAttachment,
    MessageAttachmentKind,
} from '@/modules/entities/messages';
import { useCurrentChatComposer } from '../context';
import type { ComposerAttachmentDraft } from '../context/CurrentChatComposerContext';
import { useIsSignalChat } from '@/modules/entities/chats';
import { useCurrentChatSession } from './useCurrentChatSession';

type UseChatInputParams = {
    chatId?: string | null;
    currentUserId?: string | null;
    messageText: string;
    onMessageTextChange: (text: string) => void;
    onSendMessage: () => void;
    isPending: boolean;
};

/**
 * Принимаем всё подряд на picker'е; детектим kind по mime-типу.
 * Неизвестные — попадают в FILE.
 */
function detectAttachmentKind(mime: string): ComposerAttachmentDraft['kind'] {
    if (mime.startsWith('image/')) return 'IMAGE';
    if (mime.startsWith('video/')) return 'VIDEO';
    return 'FILE';
}

export function useChatInput({
    chatId,
    currentUserId,
    messageText,
    onMessageTextChange,
    onSendMessage,
    isPending,
}: UseChatInputParams) {
    const { selectedChat } = useCurrentChatSession();
    const isSignal = useIsSignalChat(selectedChat);
    const {
        replyTarget,
        editTarget,
        attachmentDrafts,
        setReplyTarget,
        setEditTarget,
        clearComposer,
        addAttachmentDraft,
        updateAttachmentDraft,
        removeAttachmentDraft,
        setSharedPost,
    } = useCurrentChatComposer();

    const [editDraft, setEditDraft] = useState('');
    const editTargetIdRef = useRef<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [circleModalOpen, setCircleModalOpen] = useState(false);

    const updateMessageMutation = useUpdateMessage();
    const uploadAttachmentMutation = useUploadMessageAttachment();
    const { notifyTyping, stopTyping } = useTypingEmit({
        chatId: chatId ?? null,
        userId: currentUserId ?? null,
    });

    useEffect(() => {
        if (!editTarget) {
            editTargetIdRef.current = null;
            setEditDraft('');
            return;
        }
        if (editTargetIdRef.current !== editTarget.messageId) {
            editTargetIdRef.current = editTarget.messageId;
            setEditDraft(editTarget.originalContent);
        }
    }, [editTarget]);

    const isEditMode = Boolean(editTarget);
    const activeText = isEditMode ? editDraft : messageText;

    const handleActiveTextChange = (v: string) => {
        const clipped =
            v.length > MAX_CHAT_MESSAGE_LENGTH
                ? v.slice(0, MAX_CHAT_MESSAGE_LENGTH)
                : v;
        if (isEditMode) {
            setEditDraft(clipped);
            return;
        }
        onMessageTextChange(clipped);
        if (clipped.trim().length > 0) {
            notifyTyping();
        } else {
            stopTyping();
        }
    };

    const handleSaveEdit = async () => {
        if (!editTarget) return;
        const trimmed = editDraft.trim();
        if (!trimmed) return;
        if (trimmed === editTarget.originalContent) {
            setEditTarget(null);
            return;
        }
        try {
            await updateMessageMutation.mutateAsync({
                id: editTarget.messageId,
                content: trimmed,
            });
            setEditTarget(null);
        } catch (error) {
            console.error('Не удалось отредактировать сообщение', error);
        }
    };

    const handlePrimaryAction = () => {
        if (isEditMode) {
            void handleSaveEdit();
            return;
        }
        stopTyping();
        onSendMessage();
    };

    const handlePickFiles = () => {
        fileInputRef.current?.click();
    };

    const handleFilesSelected = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        Array.from(files).forEach((file) => {
            const kind = detectAttachmentKind(file.type || '');
            const localId = `att-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 9)}`;
            const previewUrl =
                kind === 'IMAGE' || kind === 'VIDEO'
                    ? URL.createObjectURL(file)
                    : undefined;
            addAttachmentDraft({
                localId,
                kind,
                file,
                previewUrl,
                uploading: true,
            });
            uploadAttachmentMutation
                .mutateAsync({
                    file,
                    kind: kind as MessageAttachmentKind,
                })
                .then((attachment) => {
                    updateAttachmentDraft(localId, {
                        uploading: false,
                        uploadedId: attachment.id,
                    });
                })
                .catch((error: unknown) => {
                    console.error('Upload failed', error);
                    updateAttachmentDraft(localId, {
                        uploading: false,
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Ошибка загрузки',
                    });
                });
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const hasAnyDraft = attachmentDrafts.length > 0;
    const anyDraftUploading = attachmentDrafts.some((d) => d.uploading);
    const hasUploadedAttachments = attachmentDrafts.some(
        (d) => Boolean(d.uploadedId) && !d.error,
    );
    // const hasSharedPost = Boolean(sharedPost);

    const isPrimaryBusy =
        isEditMode ? updateMessageMutation.isPending : isPending;
    const primaryDisabled =
        isPrimaryBusy ||
        anyDraftUploading ||
        (!activeText.trim() && !hasUploadedAttachments);

    return {
        isSignal,
        replyTarget,
        editTarget,
        attachmentDrafts,
        setReplyTarget,
        clearComposer,
        removeAttachmentDraft,
        setSharedPost,
        addAttachmentDraft,
        updateAttachmentDraft,
        fileInputRef,
        circleModalOpen,
        setCircleModalOpen,
        isEditMode,
        activeText,
        hasAnyDraft,
        hasUploadedAttachments,
        isPrimaryBusy,
        primaryDisabled,
        handleActiveTextChange,
        handlePrimaryAction,
        handlePickFiles,
        handleFilesSelected,
    };
}
