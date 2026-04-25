export type AppToastVariant = 'info' | 'success' | 'error';

export type AppToastInput = {
    title: string;
    description?: string;
    variant?: AppToastVariant;
    dedupeKey?: string;
    href?: string;
    onClick?: () => void;
};

export type AppToastItem = AppToastInput & {
    id: string;
    variant: AppToastVariant;
};

export type AppToastContextValue = {
    showToast: (toast: AppToastInput) => void;
};
