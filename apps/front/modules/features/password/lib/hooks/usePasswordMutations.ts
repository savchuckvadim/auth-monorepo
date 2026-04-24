'use client';

import { useMutation } from '@tanstack/react-query';

import { PasswordService } from '../api/PasswordService';

const service = new PasswordService();

export function useForgotPasswordMutation() {
    return useMutation({
        mutationKey: ['auth', 'forgot-password'],
        mutationFn: (email: string) => service.forgotPassword({ email }),
    });
}

export function useResetPasswordMutation() {
    return useMutation({
        mutationKey: ['auth', 'reset-password'],
        mutationFn: (payload: { token: string; password: string }) =>
            service.resetPassword(payload),
    });
}

export function useChangePasswordMutation() {
    return useMutation({
        mutationKey: ['auth', 'change-password'],
        mutationFn: (payload: { oldPassword: string; newPassword: string }) =>
            service.changePassword(payload),
    });
}
