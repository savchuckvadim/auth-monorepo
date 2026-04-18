type FormFieldErrorMessageProps = {
    message?: string;
};

export function FormFieldErrorMessage({
    message,
}: FormFieldErrorMessageProps) {
    if (!message) return null;

    return (
        <p role="alert" className="px-3 pb-2 pt-0 text-sm text-destructive">
            {message}
        </p>
    );
}
