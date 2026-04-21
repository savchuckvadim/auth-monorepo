'use client';

import { Button } from '@workspace/ui/components/button';
import { AppDialog } from './AppDialog';

type AppConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    cancelLabel?: string;
    confirmLabel: string;
    onCancel: () => void;
    onConfirm: () => void | Promise<void>;
    confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    isConfirming?: boolean;
};

/**
 * Диалог подтверждения: Отмена + одна основная кнопка.
 */
export function AppConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    cancelLabel = 'Отмена',
    confirmLabel,
    onCancel,
    onConfirm,
    confirmVariant = 'default',
    isConfirming,
}: AppConfirmDialogProps) {
    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            footer={
                <>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        variant={confirmVariant}
                        onClick={() => void onConfirm()}
                        disabled={isConfirming}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        />
    );
}
