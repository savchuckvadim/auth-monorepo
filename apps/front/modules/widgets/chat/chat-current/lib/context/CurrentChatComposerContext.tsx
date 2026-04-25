'use client';

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

/**
 * Контекст composer'а текущего чата — хранит, отвечаем ли мы на сообщение или
 * редактируем своё. Потребляют `MessageContextMenu` (устанавливает цель) и
 * `ChatInputWidget` (читает цель, рендерит reply/edit-бар, шлёт нужный запрос).
 */

export type ComposerReplyTarget = {
    messageId: string;
    senderName: string;
    /** Преживой превью текста (уже расшифрованный / для системных — content). */
    snippet: string;
    /** true — исходник E2EE, тогда снапшотить plaintext в forward-snapshots запрещено. */
    isEncrypted: boolean;
};

export type ComposerEditTarget = {
    messageId: string;
    /** Уже расшифрованный текст, который пользователь видит в бабле. */
    originalContent: string;
};

/**
 * Локальный элемент очереди загрузки аттача. Пока файл грузится — нет `id`;
 * как только upload завершился, сохраняем `id` и показываем превью без спиннера.
 */
export type ComposerAttachmentDraft = {
    /** Клиентский ключ — стабильный для одного drag/pick’a. */
    localId: string;
    kind: 'IMAGE' | 'VIDEO' | 'FILE' | 'VOICE' | 'CIRCLE' | 'AUDIO';
    file: File;
    /** object URL для превью — освобождаем при удалении. */
    previewUrl?: string;
    /** ID с сервера (MessageAttachment.id) после успешного upload’а. */
    uploadedId?: string;
    /** Пока идёт upload. */
    uploading: boolean;
    /** Текст ошибки, если загрузка провалилась — UI показывает «Повторить». */
    error?: string;
};

/** Прикреплённый пост (POST_SHARE) в черновике сообщения. */
export type ComposerSharedPost = {
    postId: string;
    /** Для превью в композере — текст и автор. */
    authorName?: string;
    text?: string;
    thumbnail?: string;
};

type ComposerState = {
    replyTarget: ComposerReplyTarget | null;
    editTarget: ComposerEditTarget | null;
    attachmentDrafts: ComposerAttachmentDraft[];
    sharedPost: ComposerSharedPost | null;
};

type ComposerActions = {
    setReplyTarget: (target: ComposerReplyTarget | null) => void;
    setEditTarget: (target: ComposerEditTarget | null) => void;
    clearComposer: () => void;
    addAttachmentDraft: (draft: ComposerAttachmentDraft) => void;
    updateAttachmentDraft: (
        localId: string,
        patch: Partial<ComposerAttachmentDraft>,
    ) => void;
    removeAttachmentDraft: (localId: string) => void;
    clearAttachmentDrafts: () => void;
    setSharedPost: (post: ComposerSharedPost | null) => void;
};

type ComposerContextValue = ComposerState & ComposerActions;

const CurrentChatComposerContext = createContext<ComposerContextValue | null>(
    null,
);

export function CurrentChatComposerProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [replyTarget, setReplyTargetState] =
        useState<ComposerReplyTarget | null>(null);
    const [editTarget, setEditTargetState] =
        useState<ComposerEditTarget | null>(null);
    const [attachmentDrafts, setAttachmentDrafts] = useState<
        ComposerAttachmentDraft[]
    >([]);
    const [sharedPost, setSharedPostState] =
        useState<ComposerSharedPost | null>(null);

    const setReplyTarget = useCallback((target: ComposerReplyTarget | null) => {
        setReplyTargetState(target);
        if (target) setEditTargetState(null);
    }, []);

    const setEditTarget = useCallback((target: ComposerEditTarget | null) => {
        setEditTargetState(target);
        if (target) setReplyTargetState(null);
    }, []);

    const revokePreview = (draft: ComposerAttachmentDraft) => {
        if (draft.previewUrl) {
            try {
                URL.revokeObjectURL(draft.previewUrl);
            } catch {
                // ignore
            }
        }
    };

    const clearAttachmentDrafts = useCallback(() => {
        setAttachmentDrafts((prev) => {
            prev.forEach(revokePreview);
            return [];
        });
    }, []);

    const setSharedPost = useCallback((post: ComposerSharedPost | null) => {
        setSharedPostState(post);
    }, []);

    const clearComposer = useCallback(() => {
        setReplyTargetState(null);
        setEditTargetState(null);
        setSharedPostState(null);
        clearAttachmentDrafts();
    }, [clearAttachmentDrafts]);

    const addAttachmentDraft = useCallback(
        (draft: ComposerAttachmentDraft) => {
            setAttachmentDrafts((prev) => [...prev, draft]);
        },
        [],
    );

    const updateAttachmentDraft = useCallback(
        (
            localId: string,
            patch: Partial<ComposerAttachmentDraft>,
        ) => {
            setAttachmentDrafts((prev) =>
                prev.map((d) => (d.localId === localId ? { ...d, ...patch } : d)),
            );
        },
        [],
    );

    const removeAttachmentDraft = useCallback((localId: string) => {
        setAttachmentDrafts((prev) => {
            const target = prev.find((d) => d.localId === localId);
            if (target) revokePreview(target);
            return prev.filter((d) => d.localId !== localId);
        });
    }, []);

    const value = useMemo<ComposerContextValue>(
        () => ({
            replyTarget,
            editTarget,
            attachmentDrafts,
            sharedPost,
            setReplyTarget,
            setEditTarget,
            clearComposer,
            addAttachmentDraft,
            updateAttachmentDraft,
            removeAttachmentDraft,
            clearAttachmentDrafts,
            setSharedPost,
        }),
        [
            replyTarget,
            editTarget,
            attachmentDrafts,
            sharedPost,
            setReplyTarget,
            setEditTarget,
            clearComposer,
            addAttachmentDraft,
            updateAttachmentDraft,
            removeAttachmentDraft,
            clearAttachmentDrafts,
            setSharedPost,
        ],
    );

    return (
        <CurrentChatComposerContext.Provider value={value}>
            {children}
        </CurrentChatComposerContext.Provider>
    );
}

/**
 * Возвращает стейт composer'а. Если провайдера нет (например, рендеримся
 * вне маршрута чата) — возвращает безопасный no-op, чтобы не ломать
 * старые места.
 */
export function useCurrentChatComposer(): ComposerContextValue {
    const ctx = useContext(CurrentChatComposerContext);
    if (ctx) return ctx;
    return {
        replyTarget: null,
        editTarget: null,
        attachmentDrafts: [],
        sharedPost: null,
        setReplyTarget: () => {},
        setEditTarget: () => {},
        clearComposer: () => {},
        addAttachmentDraft: () => {},
        updateAttachmentDraft: () => {},
        removeAttachmentDraft: () => {},
        clearAttachmentDrafts: () => {},
        setSharedPost: () => {},
    };
}
