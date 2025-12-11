import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { render } from '@react-email/components';
import { EmailVerificationTemplate } from '../templates/email-verification.template';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        @InjectQueue('mail') private readonly queue: Queue,

    ) { }




    public async sendActivationLink(email: string, name: string, activationLink: string) {
        const clientUrl = this.configService.getOrThrow<string>('CLIENT_URL')


        const html = await render(
            EmailVerificationTemplate(
                { email, name, activationLink }
            ))



        await this.sendEmail({
            subject: 'Активация аккаунта на сайте ' + clientUrl,
            html: html,
            to: [email ?? 'april-app@mail.ru'],
            context: {
                name: name,
            },
        })
        return true
    }


    async sendEmail(params: {
        subject: string;
        html: string;
        to: string[];
        context: ISendMailOptions['context'];
        attachments?: Array<{
            filename: string;
            content: Buffer;
            cid?: string;
            contentType: string;
        }>;
    }) {
        try {
            const from = `"Test" <${process.env.SMTP_FROM || 'manager@april-app.ru'}>`

            const emailsList: string[] = params.to;

            if (!emailsList) {
                throw new Error(
                    `No recipients found in SMTP_TO env var, please check your .env file`,
                );
            }

            const sendMailParams: ISendMailOptions = {
                to: emailsList,
                from: from,
                subject: params.subject,
                html: params.html,
                attachments: params.attachments,
            };
            const response = await this.mailerService.sendMail(sendMailParams);
            this.logger.log(
                `Email sent successfully to recipients with the following parameters : ${JSON.stringify(
                    sendMailParams,
                )}`,
                response,
            );
            return {
                ...response,

                message: 'Email sent successfully',
            };
        } catch (error) {
            this.logger.error(
                `Error while sending mail with the following parameters : ${JSON.stringify(
                    params,
                )}`,
                error,
            );
        }
    }

}
