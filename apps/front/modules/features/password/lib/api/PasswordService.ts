import {
    getAuth,
    type ChangePasswordDto,
    type ForgotPasswordDto,
    type PasswordActionResultDto,
    type ResetPasswordDto,
} from '@workspace/nest-api';

/**
 * Web-обёртка над Orval-клиентом для forgot/reset/change password.
 * Держим все password-эндпоинты через один сервис, чтобы слой хуков не
 * зависел напрямую от сгенерированной `auth.ts`.
 */
export class PasswordService {
    private api = getAuth();

    async forgotPassword(dto: ForgotPasswordDto): Promise<PasswordActionResultDto> {
        return this.api.authForgotPassword(dto);
    }

    async resetPassword(dto: ResetPasswordDto): Promise<PasswordActionResultDto> {
        return this.api.authResetPassword(dto);
    }

    async changePassword(dto: ChangePasswordDto): Promise<PasswordActionResultDto> {
        return this.api.authChangePassword(dto);
    }
}
