/**
 * Локально сохраняем неотправленные сообщения (сеть упала и т.п.),
 * чтобы после перезагрузки показать их снова и дать «Повторить».
 */
import { MessageType, type Message } from '../types/messages.types';

const STORAGE_KEY = 'messenger-failed-outbox-v1';

type OutboxRecord = Record<
    string,
    { chatId: string; content: string; failedAt: string }
>;

function readAll(): OutboxRecord {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        return JSON.parse(raw) as OutboxRecord;
    } catch {
        return {};
    }
}

function writeAll(data: OutboxRecord) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveFailedMessageToOutbox(
    tempId: string,
    chatId: string,
    content: string,
) {
    const all = readAll();
    all[tempId] = {
        chatId,
        content,
        failedAt: new Date().toISOString(),
    };
    writeAll(all);
}

export function removeFailedMessageFromOutbox(tempId: string) {
    const all = readAll();
    if (all[tempId]) {
        delete all[tempId];
        writeAll(all);
    }
}

type OutboxUser = { id: string; name: string; email: string };

/** Восстановить в кеш сообщений как неудачные (при открытии чата). */
export function loadOutboxMessagesForChat(
    chatId: string,
    user: OutboxUser,
): Message[] {
    const all = readAll();
    const out: Message[] = [];
    for (const [tempId, row] of Object.entries(all)) {
        if (row.chatId !== chatId) continue;
        out.push({
            id: tempId,
            chatId: row.chatId,
            senderId: user.id,
            content: row.content,
            type: MessageType.TEXT,
            createdAt: row.failedAt,
            updatedAt: row.failedAt,
            isEncrypted: false,
            sender: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            _clientStatus: 'failed',
        });
    }
    return out;
}
