import { MessageAttachmentKind } from 'generated/prisma';

/** Допустимые для upload kind'ы — POST_SHARE/FORWARD_SNAPSHOT без файла. */
export const UPLOADABLE_MESSAGE_ATTACHMENT_KINDS = [
    MessageAttachmentKind.IMAGE,
    MessageAttachmentKind.VIDEO,
    MessageAttachmentKind.AUDIO,
    MessageAttachmentKind.VOICE,
    MessageAttachmentKind.CIRCLE,
    MessageAttachmentKind.FILE,
] as const;

export type UploadableMessageAttachmentKind =
    (typeof UPLOADABLE_MESSAGE_ATTACHMENT_KINDS)[number];

/** Размеры по kind (в байтах). Отдельный тюнинг на voice/circle (короче). */
export const MAX_BYTES_BY_MESSAGE_ATTACHMENT_KIND: Record<
    UploadableMessageAttachmentKind,
    number
> = {
    IMAGE: 20 * 1024 * 1024,
    VIDEO: 100 * 1024 * 1024,
    AUDIO: 25 * 1024 * 1024,
    VOICE: 15 * 1024 * 1024,
    CIRCLE: 40 * 1024 * 1024,
    FILE: 50 * 1024 * 1024,
};

export function isUploadableMessageAttachmentKind(
    kind: MessageAttachmentKind,
): kind is UploadableMessageAttachmentKind {
    return (
        UPLOADABLE_MESSAGE_ATTACHMENT_KINDS as readonly MessageAttachmentKind[]
    ).includes(kind);
}
