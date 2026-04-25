'use client';

import { AlertTriangle, CheckCircle2, Lock, LogIn } from 'lucide-react';
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
                    Link is incomplete — token is missing in the URL. Request a new email.
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
                        Password updated.
                        All previous sessions are ended — sign in again with the new password.
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" method="post">
            <FormField
                control={control}
                name="password"
                id="reset-password"
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
            <PasswordStrengthMeter value={passwordValue} />
            <FormField
                control={control}
                name="confirmPassword"
                id="reset-confirm"
                type="password"
                passwordRevealToggle
                placeholder="Repeat password"
                autoComplete="new-password"
                required
                startSlot={<Lock className="size-4 shrink-0" strokeWidth={2} />}
                rules={{
                    required: 'Repeat password',
                    validate: (value) =>
                        value === getValues('password') || 'Passwords do not match',
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
                loadingLabel="Saving..."
                leadIcon={<Lock />}
            >
                Save new password
            </AppButton>
        </form>
    );
}
