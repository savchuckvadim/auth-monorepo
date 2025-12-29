'use client';

import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Send } from 'lucide-react';

interface ChatInputWidgetProps {
    messageText: string;
    onMessageTextChange: (text: string) => void;
    onSendMessage: () => void;
    isPending: boolean;
}

export const ChatInputWidget = ({
    messageText,
    onMessageTextChange,
    onSendMessage,
    isPending,
}: ChatInputWidgetProps) => {
    return (
        <div className="border-t p-4 bg-card flex-shrink-0">
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Введите сообщение..."
                    value={messageText}
                    onChange={(e) => onMessageTextChange(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onSendMessage();
                        }
                    }}
                    className="flex-1"
                />
                <Button
                    onClick={onSendMessage}
                    disabled={!messageText.trim() || isPending}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

