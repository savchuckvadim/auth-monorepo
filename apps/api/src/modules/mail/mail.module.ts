import { Global, Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailerConfig } from '@/core/config/mail/mailer.config';
import { SendMailActivationLinkUseCase } from './use-cases/send-activation-link.use-case';
import { SendMailPasswordResetUseCase } from './use-cases/send-password-reset.use-case';
import { QueueModule } from '@/core/queue';
import { MailProcessor } from './queue/mail.processor';
@Global()
@Module({
    imports: [
        QueueModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: getMailerConfig,
            inject: [ConfigService],
        }),
    ],
    providers: [
        MailService,
        SendMailActivationLinkUseCase,
        SendMailPasswordResetUseCase,
        MailProcessor,
    ],
    exports: [SendMailActivationLinkUseCase, SendMailPasswordResetUseCase],
})
export class MailModule {}
