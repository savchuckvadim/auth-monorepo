import { useMemo } from 'react';
import { ChatDtoEncryptionMode } from '@workspace/nest-api';
import type { Chat } from '../types/chats.types';

export function useIsSignalChat(chat: Chat | undefined): boolean {
    return useMemo(
        () => chat?.encryptionMode === ChatDtoEncryptionMode.SIGNAL,
        [chat?.encryptionMode],
    );
}
