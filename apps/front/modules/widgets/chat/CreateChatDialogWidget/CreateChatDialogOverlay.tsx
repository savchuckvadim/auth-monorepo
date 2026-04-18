'use client';

import type { ReactNode } from 'react';

type CreateChatDialogOverlayProps = {
    children: ReactNode;
};

export function CreateChatDialogOverlay({
    children,
}: CreateChatDialogOverlayProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            {children}
        </div>
    );
}
