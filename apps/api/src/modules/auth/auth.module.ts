import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '@/modules/user';
import { TokenModule } from '@/modules/token';
import { MailModule } from '@/modules/mail';
import { AuthService } from './services/auth.service';
import { SessionsService } from './services/sessions.service';
import { CookieModule, CookieService } from '@/core/cookie';
import { AuthMobileController } from './controllers/auth-mobile.controller';
import { PasswordResetService } from './password-reset/password-reset.service';
import { PasswordResetRepository } from './password-reset/password-reset.repository';
import { PasswordResetPrismaRepository } from './password-reset/password-reset.prisma.repository';
import { NotificationsModule } from '@/modules/notifications/notifications.module';

@Module({
    imports: [
        UserModule,
        TokenModule,
        MailModule,
        CookieModule,
        NotificationsModule,
    ],
    controllers: [AuthController, AuthMobileController],
    providers: [
        AuthService,
        SessionsService,
        PasswordResetService,
        CookieService,
        {
            provide: PasswordResetRepository,
            useClass: PasswordResetPrismaRepository,
        },
    ],
})
export class AuthModule {}
