'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Lock, LogIn } from 'lucide-react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AppButton } from '@/modules/shared';
import { FormField } from '@/modules/shared/ui';

import { useResetPasswordMutation } from '../lib/hooks/usePasswordMutations';
import { getPasswordErrorMessage } from '../lib/utils/password-errors.util';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

type ResetPasswordFormValues = {
    password: string;
    confirmPassword: string;
};

type ResetPasswordFormProps = {
    /** Одноразовый токен из `?token=` в query. */
    token: string | null;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { control, handleSubmit, getValues } = useForm<ResetPasswordFormValues>({
        defaultValues: { password: '', confirmPassword: '' },
    });
    const mutation = useResetPasswordMutation();
    const passwordValue = useWatch({ control, name: 'password' }) ?? '';

    const onSubmit: SubmitHandler<ResetPasswordFormValues> = ({ password }) => {
        if (!token) return;
        mutation.mutate({ token, password });
    };

    if (!token) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    Ссылка неполная — в URL отсутствует токен. Запросите новое письмо.
                </AlertDescription>
            </Alert>
        );
    }

    if (mutation.isSuccess) {
        return (
            <div className="space-y-4">
                <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                        Пароль обновлён. Все предыдущие сессии завершены — войдите
                        заново с новым паролем.
                    </AlertDescription>
                </Alert>
                <AppButton
                    appSize="auth"
                    leadIcon={<LogIn />}
                    onClick={() => router.push('/auth/login')}
                >
                    Перейти ко входу
                </AppButton>
            </div>
        );
    }

    const passwordToggle = (
        <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent group-focus-within:text-primary"
        >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" method="post">
            <FormField
                control={control}
                name="password"
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Новый пароль (мин. 8 символов)"
                autoComplete="new-password"
                required
                startSlot={<Lock className="size-4 shrink-0" strokeWidth={2} />}
                endSlot={passwordToggle}
                rules={{
                    required: 'Укажите новый пароль',
                    minLength: { value: 8, message: 'Минимум 8 символов' },
                    maxLength: { value: 32, message: 'Максимум 32 символа' },
                }}
            />
            <PasswordStrengthMeter value={passwordValue} />
            <FormField
                control={control}
                name="confirmPassword"
                id="reset-confirm"
                type={showPassword ? 'text' : 'password'}
                placeholder="Повторите пароль"
                autoComplete="new-password"
                required
                startSlot={<Lock className="size-4 shrink-0" strokeWidth={2} />}
                rules={{
                    required: 'Повторите пароль',
                    validate: (value) =>
                        value === getValues('password') || 'Пароли не совпадают',
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
                isLoading={mutation.isPending}
                loadingLabel="Сохраняем..."
                leadIcon={<Lock />}
            >
                Сохранить новый пароль
            </AppButton>
        </form>
    );
}
