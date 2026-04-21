'use client';

import { MessageCircle } from 'lucide-react';

export function NoChatSelectedPlaceholder() {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="text-center">
                <MessageCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">
                    Выберите диалог или создайте новый
                </p>
            </div>
        </div>
    );
}
