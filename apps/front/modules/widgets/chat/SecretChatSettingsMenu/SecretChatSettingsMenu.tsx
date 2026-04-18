'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { useChatById } from '@/modules/entities/chats';
import {
    AppDropdownMenu,
    DropdownMenuSeparator,
} from '@/modules/shared';
import {
    DeleteChatByTimerChatSetting,
    DeleteChatSetting,
    DeleteMessageByTimerChatSetting,
} from '@/modules/features/secret-chat';

export type SecretChatSettingsMenuProps = {
    chatId: string;
};

/**
 * Виджет меню защищённого чата: только состав фич и состояние открытия dropdown.
 */
export function SecretChatSettingsMenu({ chatId }: SecretChatSettingsMenuProps) {
    const { data: chat } = useChatById(chatId);
    const [menuOpen, setMenuOpen] = useState(false);

    if (!chat) {
        return null;
    }

    return (
        <>
            <AppDropdownMenu
                open={menuOpen}
                onOpenChange={setMenuOpen}
                trigger={
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        aria-label="Настройки защищённого чата"
                        aria-expanded={menuOpen}
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                }
            >
                <DeleteChatByTimerChatSetting chatId={chatId} />
                <DeleteMessageByTimerChatSetting chatId={chatId} />
                <DropdownMenuSeparator />
                <DeleteChatSetting chatId={chatId} />
            </AppDropdownMenu>
        </>
    );
}
