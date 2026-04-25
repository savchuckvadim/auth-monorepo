import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { AppToastItem } from '../app-toast.types';
import { AppToastListItem } from './AppToastListItem';

type AppToastViewportProps = {
    toasts: AppToastItem[];
    router: AppRouterInstance;
    onDismiss: (id: string) => void;
};

export function AppToastViewport({
    toasts,
    router,
    onDismiss,
}: AppToastViewportProps) {
    return (
        <div className="fixed bottom-4 right-4 z-[200] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
            {toasts.map((toast) => (
                <AppToastListItem
                    key={toast.id}
                    toast={toast}
                    router={router}
                    onDismiss={onDismiss}
                />
            ))}
        </div>
    );
}
