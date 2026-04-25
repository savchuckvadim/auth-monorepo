import { ExternalLink } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import type { AppToastItem } from '../app-toast.types';
import { AppToastCloseButton } from './AppToastCloseButton';

type AppToastContentProps = {
    toast: AppToastItem;
    clickable: boolean;
    onDismiss: () => void;
};

export function AppToastContent({
    toast,
    clickable,
    onDismiss,
}: AppToastContentProps) {
    return (
        <div
            className={cn(
                'rounded-lg border bg-card p-3 text-card-foreground shadow-lg transition',
                toast.variant === 'success' && 'border-primary/50',
                toast.variant === 'error' && 'border-destructive/60',
                clickable &&
                    'cursor-pointer border-primary/70 ring-1 ring-primary/20 hover:-translate-y-0.5 hover:bg-muted/70 hover:shadow-xl',
            )}
        >
            <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium">{toast.title}</p>
                        {clickable ? (
                            <ExternalLink className="h-3 w-3 shrink-0 text-primary" />
                        ) : null}
                    </div>
                    {toast.description ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                            {toast.description}
                        </p>
                    ) : null}
                </div>
                <AppToastCloseButton onDismiss={onDismiss} />
            </div>
        </div>
    );
}
