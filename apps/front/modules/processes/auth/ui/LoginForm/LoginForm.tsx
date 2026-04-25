'use client';

import { useState } from 'react';
import { Alert } from '@workspace/ui/components/alert';
import { AlertDescription } from '@workspace/ui/components/alert';
import { AppButton } from '@/modules/shared';
import { Eye, EyeOff, Lock, LogIn, User, AlertTriangle } from 'lucide-react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { ILoginForm } from '../../type/auth.type';
import { useAuth } from '../../lib/hooks/auth.hook';
import { FormField } from '@/modules/shared/ui';
import { saveForgotEmailHint } from '@/modules/features/password';

export const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useAuth();
    const { control, handleSubmit } = useForm<ILoginForm>();
    const onSubmit: SubmitHandler<ILoginForm> = (data) => {
        saveForgotEmailHint(data.email);
        login(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            method="post"
            autoComplete="on"
        >
            <FormField
                control={control}
                name="email"
                id="login-email"
                type="email"
                // label="Email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                startSlot={<User className="size-4 shrink-0" strokeWidth={2} />}
            />
            <FormField
                control={control}
                name="password"
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                // label="Пароль"
                placeholder="Введите пароль"
                autoComplete="current-password"
                required
                startSlot={<Lock className="size-4 shrink-0" strokeWidth={2} />}
                endSlot={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent group-focus-within:text-primary"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                }
            />
            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <AppButton
                type="submit"
                appSize="auth"
                isLoading={isLoading}
                loadingLabel="Signing in..."
                leadIcon={<LogIn />}
            >
                Sign in
            </AppButton>
        </form>
    );
};
