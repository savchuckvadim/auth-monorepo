'use client';

import { useState } from 'react';
import {
    Copy,
    MoreHorizontal,
    Pencil,
    Reply,
    Trash2,
    Forward,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { cn } from '@workspace/ui/lib/utils';

export interface MessageContextMenuAction {
    key: 'reply' | 'copy' | 'edit' | 'delete' | 'forward';
    onSelect: () => void;
    disabled?: boolean;
    hidden?: boolean;
}

export interface MessageContextMenuProps {
    isOwn: boolean;
    /** Показываем меню только когда есть хотя бы одно действие. */
    actions: {
        reply?: () => void;
        copy?: () => void;
        edit?: () => void;
        delete?: () => void;
        forward?: () => void;
    };
    /** true — нельзя копировать (например, "[Не удалось расшифровать]"). */
    copyDisabled?: boolean;
    /** Переопределить side/align если нужно. */
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    className?: string;
}

export function MessageContextMenu({
    isOwn,
    actions,
    copyDisabled,
    side = 'top',
    align,
    className,
}: MessageContextMenuProps) {
    const [open, setOpen] = useState(false);
    const hasAny =
        Boolean(actions.reply) ||
        Boolean(actions.copy) ||
        Boolean(actions.edit) ||
        Boolean(actions.delete) ||
        Boolean(actions.forward);

    if (!hasAny) return null;

    const resolvedAlign = align ?? (isOwn ? 'end' : 'start');

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Действия с сообщением"
                    className={cn(
                        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground focus:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group-hover:opacity-100',
                        open && 'opacity-100',
                        className,
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={side}
                align={resolvedAlign}
                className="w-44"
                onClick={(e) => e.stopPropagation()}
            >
                {actions.reply && (
                    <DropdownMenuItem onSelect={actions.reply}>
                        <Reply className="mr-2 h-4 w-4" />
                        Ответить
                    </DropdownMenuItem>
                )}
                {actions.forward && (
                    <DropdownMenuItem onSelect={actions.forward}>
                        <Forward className="mr-2 h-4 w-4" />
                        Переслать
                    </DropdownMenuItem>
                )}
                {actions.copy && (
                    <DropdownMenuItem
                        onSelect={actions.copy}
                        disabled={copyDisabled}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Копировать
                    </DropdownMenuItem>
                )}
                {actions.edit && (
                    <DropdownMenuItem onSelect={actions.edit}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Редактировать
                    </DropdownMenuItem>
                )}
                {actions.delete && (
                    <>
                        {(actions.reply || actions.copy || actions.edit) && (
                            <DropdownMenuSeparator />
                        )}
                        <DropdownMenuItem
                            onSelect={actions.delete}
                            variant="destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
