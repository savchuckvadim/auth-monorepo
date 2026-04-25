import { useMutation } from '@tanstack/react-query';
import { customAxios } from '@workspace/nest-api';
import {
    MessageAttachment,
    MessageAttachmentKind,
} from '../types/messages.types';

interface UploadMessageAttachmentVars {
    file: File;
    kind: MessageAttachmentKind;
    /** Для VOICE/AUDIO/VIDEO/CIRCLE. */
    durationMs?: number;
    /** Peaks 0..1; бэк хранит их в `metadata.waveform`. */
    waveform?: number[];
    width?: number;
    height?: number;
}

/**
 * Загружает файл в S3 через `POST /messages/attachments/upload` и возвращает
 * orphan-`MessageAttachment`. Его `id` потом передаётся в `CreateMessageDto.attachmentIds`
 * при отправке сообщения, иначе через час orphan-cleanup его удалит.
 */
export const useUploadMessageAttachment = () => {
    return useMutation({
        mutationFn: async ({
            file,
            kind,
            durationMs,
            waveform,
            width,
            height,
        }: UploadMessageAttachmentVars) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('kind', kind);
            if (typeof durationMs === 'number') {
                formData.append('durationMs', String(Math.round(durationMs)));
            }
            if (waveform && waveform.length > 0) {
                formData.append('waveform', JSON.stringify(waveform));
            }
            if (typeof width === 'number') {
                formData.append('width', String(Math.round(width)));
            }
            if (typeof height === 'number') {
                formData.append('height', String(Math.round(height)));
            }
            return customAxios<MessageAttachment>({
                url: '/api/messages/attachments/upload',
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: formData,
            });
        },
    });
};
