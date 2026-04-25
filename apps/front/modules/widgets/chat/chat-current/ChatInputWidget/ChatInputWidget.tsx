'use client';

import { MAX_CHAT_MESSAGE_LENGTH } from '@/modules/entities/messages';
import {
    useChatInputComposer,
    useChatInput,
} from '../lib/hooks';
import { AttachmentDraftsPreview } from './AttachmentDraftsPreview';
import { VideoCircleRecorderModal } from './VideoCircleRecorderModal';
import { ChatAttachmentActions } from './ChatAttachmentActions';
import { ChatComposerNoticeBar } from './ChatComposerNoticeBar';
import { ChatComposerTextArea } from './ChatComposerTextArea';
import { ChatSendButton } from './ChatSendButton';

type ChatInputWidgetProps = {
    chatId?: string | null;
    currentUserId?: string | null;
    messageText: string;
    onMessageTextChange: (text: string) => void;
    onSendMessage: () => void;
    isPending: boolean;
};

/**
 * Поле ввода текущего чата: кроме обычной отправки умеет reply (читает цель из
 * composer-контекста, бар-превью + replyToId передаётся в `onSendMessage` через
 * тот же контекст) и edit (собственный локальный стейт + `useUpdateMessage`).
 * Edit-ветка полностью изолирована от parent-стейта `messageText`, чтобы не
 * стирать черновик ответа.
 */
export function ChatInputWidget({
    chatId,
    currentUserId,
    messageText,
    onMessageTextChange,
    onSendMessage,
    isPending,
}: ChatInputWidgetProps) {
    const {
        isSignal,
        replyTarget,
        editTarget,
        attachmentDrafts,
        setReplyTarget,
        clearComposer,
        removeAttachmentDraft,
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
    } = useChatInput({
        chatId,
        currentUserId,
        messageText,
        onMessageTextChange,
        onSendMessage,
        isPending,
    });

    const { textareaRef, handleKeyDown } = useChatInputComposer({
        messageText: activeText,
        onSendMessage: handlePrimaryAction,
        isPending: isPrimaryBusy,
    });

    return (
        <div className="flex-shrink-0 border-t border-background/90 bg-card p-4">
            {replyTarget && !isEditMode ? (
                <ChatComposerNoticeBar
                    tone="reply"
                    title={`Ответ: ${replyTarget.senderName || 'Пользователь'}`}
                    text={replyTarget.snippet}
                    onClear={() => setReplyTarget(null)}
                />
            ) : null}

            {hasAnyDraft && !isEditMode ? (
                <AttachmentDraftsPreview
                    drafts={attachmentDrafts}
                    onRemove={removeAttachmentDraft}
                />
            ) : null}

            {editTarget ? (
                <ChatComposerNoticeBar
                    tone="edit"
                    title="Редактирование сообщения"
                    text={editTarget.originalContent}
                    onClear={clearComposer}
                />
            ) : null}

            <div className="flex items-end gap-2">
                {!isEditMode && !isSignal ? (
                    <ChatAttachmentActions
                        fileInputRef={fileInputRef}
                        disabled={isPrimaryBusy}
                        onPickFiles={handlePickFiles}
                        onFilesSelected={handleFilesSelected}
                        onCircleOpen={() => setCircleModalOpen(true)}
                        onUploaded={addAttachmentDraft}
                        onDraftUpdate={updateAttachmentDraft}
                    />
                ) : null}
                <ChatComposerTextArea
                    textareaRef={textareaRef}
                    value={activeText}
                    isEditMode={isEditMode}
                    onChange={handleActiveTextChange}
                    onKeyDown={handleKeyDown}
                />
                {!isEditMode && !activeText.trim() && !hasUploadedAttachments ? (
                    null
                ) : (
                    <ChatSendButton
                        isEditMode={isEditMode}
                        disabled={primaryDisabled}
                        onClick={handlePrimaryAction}
                    />
                )}
            </div>
            <p className="mt-1 text-right text-[11px] text-muted-foreground">
                {activeText.length}/{MAX_CHAT_MESSAGE_LENGTH}
            </p>

            <VideoCircleRecorderModal
                open={circleModalOpen}
                onClose={() => setCircleModalOpen(false)}
                onUploaded={addAttachmentDraft}
                onDraftUpdate={updateAttachmentDraft}
            />

        </div>
    );
}
