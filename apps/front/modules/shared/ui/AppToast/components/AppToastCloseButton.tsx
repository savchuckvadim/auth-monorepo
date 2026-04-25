import { X } from 'lucide-react';

type AppToastCloseButtonProps = {
    onDismiss: () => void;
};

export function AppToastCloseButton({ onDismiss }: AppToastCloseButtonProps) {
    return (
        <button
            type="button"
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDismiss();
            }}
            className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Закрыть уведомление"
        >
            <X className="h-3.5 w-3.5" />
        </button>
    );
}
