import { AlertCircle, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

type MessageDeliveryStatusProps = {
    messageId: string;
    failed: boolean;
    pending: boolean;
    readByPeer: boolean;
    showDeliveryTicks: boolean;
    onRetryFailed?: (tempMessageId: string) => void;
};

export function MessageDeliveryStatus({
    messageId,
    failed,
    pending,
    readByPeer,
    showDeliveryTicks,
    onRetryFailed,
}: MessageDeliveryStatusProps) {
    return (
        <span className="inline-flex items-center gap-1">
            {failed && onRetryFailed ? (
                <>
                    <AlertCircle className="h-3.5 w-3.5 text-amber-200" />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[11px] text-primary-foreground hover:bg-primary-foreground/15"
                        onClick={() => onRetryFailed(messageId)}
                    >
                        Повторить
                    </Button>
                </>
            ) : null}
            {pending ? (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin opacity-80" />
            ) : null}
            {showDeliveryTicks ? (
                readByPeer ? (
                    <CheckCheck
                        className="h-3.5 w-3.5 shrink-0 text-white drop-shadow-sm"
                        aria-hidden
                        aria-label="Прочитано"
                    />
                ) : (
                    <Check
                        className="h-3.5 w-3.5 shrink-0 text-primary-foreground/80"
                        aria-hidden
                        aria-label="Отправлено"
                    />
                )
            ) : null}
        </span>
    );
}
