'use client';
import { AlertTriangle, CheckCircle2, KeyRound, Lock } from 'lucide-react';
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" method="post">
            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">Change password</h2>
                <p className="text-sm text-muted-foreground">
                    After changing the password, we will end all other sessions, except this one.
                </p>
            </div>

            <FormField
                control={control}
                name="oldPassword"
                id="change-old-password"
                type="password"
                passwordRevealToggle
                placeholder="Current password"
                autoComplete="current-password"
                required
                startSlot={<KeyRound className="size-4 shrink-0" strokeWidth={2} />}
                rules={{ required: 'Specify current password' }}
            />
            <FormField
                control={control}
                name="newPassword"
                id="change-new-password"
                type="password"
                passwordRevealToggle
                placeholder="New password (minimum 8 characters)"
                autoComplete="new-password"
                required
                startSlot={<Lock className="size-4 shrink-0" strokeWidth={2} />}
                rules={{
                    required: 'Specify new password',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                    maxLength: { value: 32, message: 'Maximum 32 characters' },
                }}
            />
            <PasswordStrengthMeter value={newPasswordValue} />
            <FormField
                control={control}
                name="confirmPassword"
                id="change-confirm-password"
                type="password"
                passwordRevealToggle
                placeholder="Repeat new password"
                autoComplete="new-password"
                required
                startSlot={<Lock className="size-4 shrink-0" strokeWidth={2} />}
                rules={{
                    required: 'Repeat new password',
                    validate: (value) =>
                        value === getValues('newPassword') || 'Passwords do not match',
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
                        Password updated. All other sessions are ended.
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
                Update password
            </AppButton>
        </form>
    );
}
