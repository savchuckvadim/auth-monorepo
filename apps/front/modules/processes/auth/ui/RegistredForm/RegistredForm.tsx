'use client';

import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AppButton } from '@/modules/shared';
import {
    AlertTriangle,
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../lib/hooks/auth.hook';
import { IRegisterForm } from '../../type/auth.type';
import { FormField } from '@/modules/shared/ui';

export const RegistrationForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register: registerUser, isLoading, error } = useAuth();

    const { control, handleSubmit } = useForm<IRegisterForm>();
    const onSubmit: SubmitHandler<IRegisterForm> = (data) =>
        registerUser(data);

    const passwordToggle = (
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
    );

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            method="post"
            autoComplete="on"
        >
            <FormField
                control={control}
                name="name"
                id="register-name"
                type="text"
                // label="Имя"
                placeholder="Имя"
                autoComplete="name"
                required
                startSlot={<User className="size-4 shrink-0" strokeWidth={2} />}
            />
            <FormField
                control={control}
                name="email"
                id="register-email"
                type="email"
                // label="Email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                startSlot={<Mail className="size-4 shrink-0" strokeWidth={2} />}
            />
            <FormField
                control={control}
                name="password"
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                // label="Пароль"
                placeholder="Введите пароль"
                autoComplete="new-password"
                required
                startSlot={<Lock className="size-4 shrink-0" strokeWidth={2} />}
                endSlot={passwordToggle}
            />
            <FormField
                control={control}
                name="confirmPassword"
                id="register-confirm"
                type={showPassword ? 'text' : 'password'}
                // label="Подтвердите пароль"
                placeholder="Подтвердите пароль"
                autoComplete="new-password"
                required
                startSlot={<Lock className="size-4 shrink-0" strokeWidth={2} />}
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
                loadingLabel="Регистрация..."
                leadIcon={<UserPlus />}
            >
                Зарегистрироваться
            </AppButton>
        </form>
    );
};
