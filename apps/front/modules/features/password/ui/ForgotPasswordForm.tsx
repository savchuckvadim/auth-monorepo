'use client';

import { useEffect, useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Mail, Send } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AppButton } from '@/modules/shared';
import { FormField } from '@/modules/shared/ui';

import { useForgotPasswordMutation } from '../lib/hooks/usePasswordMutations';
import { getPasswordErrorMessage } from '../lib/utils/password-errors.util';
import { consumeForgotEmailHint } from '../lib/utils/forgot-prefill.util';

type ForgotPasswordFormValues = {
    email: string;
};

interface ForgotPasswordFormProps {
    /**
     * Email, подставляемый в поле при монтировании. Если не указан —
     * попробуем прочитать подсказку из `sessionStorage`, оставленную
     * `LoginForm` после неудачного логина.
     */
    initialEmail?: string;
}

/**
 * Форма «Забыли пароль?» — отправляет email, получает от бэка
 * безусловный `{ success: true }` (защита от user enumeration), и
 * показывает одно и то же сообщение вне зависимости от реальности
 * аккаунта.
 */
export function ForgotPasswordForm({ initialEmail }: ForgotPasswordFormProps = {}) {
    // `useMemo` чтобы consume подсказки сработал ровно один раз на
    // монтирование формы — в React 18 StrictMode это важно.
    const prefilledEmail = useMemo(
        () => initialEmail ?? consumeForgotEmailHint() ?? '',
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    const { control, handleSubmit, formState, setFocus } = useForm<ForgotPasswordFormValues>({
        defaultValues: { email: prefilledEmail },
    });
    const mutation = useForgotPasswordMutation();

    useEffect(() => {
        if (!prefilledEmail) {
            setFocus('email');
        }
    }, [prefilledEmail, setFocus]);

    const onSubmit: SubmitHandler<ForgotPasswordFormValues> = ({ email }) => {
        mutation.mutate(email);
    };

    if (mutation.isSuccess) {
        return (
            <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                    Если такой аккаунт существует, на указанный email уже ушло
                    письмо со ссылкой для сброса пароля. Проверьте входящие и
                    папку «Спам».
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" method="post">
            <FormField
                control={control}
                name="email"
                id="forgot-email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                startSlot={<Mail className="size-4 shrink-0" strokeWidth={2} />}
                rules={{
                    required: 'Укажите email',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Некорректный email',
                    },
                }}
            />

            {mutation.isError && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        {getPasswordErrorMessage(mutation.error)}
                    </AlertDescription>
                </Alert>
            )}

            <AppButton
                type="submit"
                appSize="auth"
                isLoading={mutation.isPending || formState.isSubmitting}
                loadingLabel="Отправляем..."
                leadIcon={<Send />}
            >
                Отправить ссылку
            </AppButton>
        </form>
    );
}
