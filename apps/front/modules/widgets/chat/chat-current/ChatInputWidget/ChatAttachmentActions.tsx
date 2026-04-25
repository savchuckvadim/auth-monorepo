import { Paperclip, Video } from 'lucide-react';
import { AppButton } from '@/modules/shared';
import type { ComposerAttachmentDraft } from '../lib/context';
import { VoiceRecordButton } from './VoiceRecordButton';

type ChatAttachmentActionsProps = {
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    disabled: boolean;
    onPickFiles: () => void;
    onFilesSelected: (files: FileList | null) => void;
    onCircleOpen: () => void;
    onUploaded: (draft: ComposerAttachmentDraft) => void;
    onDraftUpdate: (
        localId: string,
        patch: Partial<ComposerAttachmentDraft>,
    ) => void;
};

export function ChatAttachmentActions({
    fileInputRef,
    disabled,
    onPickFiles,
    onFilesSelected,
    onCircleOpen,
    onUploaded,
    onDraftUpdate,
}: ChatAttachmentActionsProps) {
    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.txt"
                className="hidden"
                onChange={(e) => onFilesSelected(e.target.files)}
            />
            <AppButton
                type="button"
                appSize="md"
                className="mb-0 h-10 w-10 shrink-0 p-0"
                onClick={onPickFiles}
                aria-label="Прикрепить"
                variant="ghost"
            >
                <Paperclip className="h-4 w-4" />
            </AppButton>
            <AppButton
                type="button"
                appSize="md"
                className="mb-0 h-10 w-10 shrink-0 p-0"
                onClick={onCircleOpen}
                aria-label="Видеокружок"
                variant="ghost"
            >
                <Video className="h-4 w-4" />
            </AppButton>
            <VoiceRecordButton
                disabled={disabled}
                onUploaded={onUploaded}
                onDraftUpdate={onDraftUpdate}
                onError={(message) => {
                    console.warn('Voice record error:', message);
                }}
            />
        </>
    );
}
