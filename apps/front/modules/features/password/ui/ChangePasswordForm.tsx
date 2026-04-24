'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';

import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AppButton } from '@/modules/shared';
import { FormField } from '@/modules/shared/ui';

import { useChangePasswordMutation } from '../lib/hooks/usePasswordMutations';
import { getPasswordErrorMessage } from '../lib/utils/password-errors.util';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

type ChangePasswordFormValues = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

/**
 * Форма «Сменить пароль» внутри настроек. Бэк при успехе ревокает все
 * refresh-сессии, КРОМЕ текущей — значит пользователь не вылетит из
 * текущей вкладки.
 */
export function ChangePasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const mutation = useChangePasswordMutation();
    const { control, handleSubmit, getValues, reset } = useForm<ChangePasswordFormValues>({
        defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    });
    const newPasswordValue = useWatch({ control, name: 'newPassword' }) ?? '';

    const onSubmit: SubmitHandler<ChangePasswordFormValues> = ({
        oldPassword,
        newPassword,
    }) => {
        mutation.mutate(
            { oldPassword, newPassword },
            {
                onSuccess: () => reset(),
            },
        );
    };

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
            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">Сменить пароль</h2>
                <p className="text-sm text-muted-foreground">
                    После смены пароля мы завершим все остальные сессии, кроме этой.
                </p>
            </div>

            <FormField
                control={control}
                name="oldPassword"
                id="change-old-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Текущий пароль"
                autoComplete="current-password"
                required
                startSlot={<KeyRound className="size-4 shrink-0" strokeWidth={2} />}
                rules={{ required: 'Укажите текущий пароль' }}
            />
            <FormField
                control={control}
                name="newPassword"
                id="change-new-password"
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
            <PasswordStrengthMeter value={newPasswordValue} />
            <FormField
                control={control}
                name="confirmPassword"
                id="change-confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Повторите новый пароль"
                autoComplete="new-password"
                required
                startSlot={<Lock className="size-4 shrink-0" strokeWidth={2} />}
                rules={{
                    required: 'Повторите новый пароль',
                    validate: (value) =>
                        value === getValues('newPassword') || 'Пароли не совпадают',
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

            {mutation.isSuccess && (
                <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                        Пароль обновлён. Все остальные сессии завершены.
                    </AlertDescription>
                </Alert>
            )}

            <AppButton
                type="submit"
                appSize="md"
                isLoading={mutation.isPending}
                loadingLabel="Сохраняем..."
                leadIcon={<Lock />}
                className="w-full sm:w-auto"
            >
                Обновить пароль
            </AppButton>
        </form>
    );
}
