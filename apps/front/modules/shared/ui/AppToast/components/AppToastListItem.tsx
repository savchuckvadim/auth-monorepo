import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { AppToastItem } from '../app-toast.types';
import { AppToastContent } from './AppToastContent';

type AppToastListItemProps = {
    toast: AppToastItem;
    router: AppRouterInstance;
    onDismiss: (id: string) => void;
};

export function AppToastListItem({
    toast,
    router,
    onDismiss,
}: AppToastListItemProps) {
    const clickable = Boolean(toast.href || toast.onClick);
    const content = (
        <AppToastContent
            toast={toast}
            clickable={clickable}
            onDismiss={() => onDismiss(toast.id)}
        />
    );

    if (!clickable) {
        return <div>{content}</div>;
    }

    return (
        <button
            type="button"
            className="text-left"
            onClick={() => {
                if (toast.href) {
                    router.push(toast.href);
                } else {
                    toast.onClick?.();
                }
                onDismiss(toast.id);
            }}
        >
            {content}
        </button>
    );
}
