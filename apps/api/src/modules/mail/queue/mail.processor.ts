import { JobNames, QueueNames } from '@/core/queue';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from '../services/mail.service';
import { SendMailActivationLinkDto } from '../dtos/activation-link.dto';
import { SendMailPasswordResetDto } from '../dtos/password-reset.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
@Processor(QueueNames.MAIL)
export class MailProcessor {
    constructor(private readonly mailService: MailService) {}

    @Process(JobNames.MAIL_VERIFICATION)
    async handleSendActivationLink(job: Job<SendMailActivationLinkDto>) {
        await this.mailService.sendActivationLink(job.data);
    }

    @Process(JobNames.MAIL_PASSWORD_RESET)
    async handleSendPasswordReset(job: Job<SendMailPasswordResetDto>) {
        await this.mailService.sendPasswordReset(job.data);
    }
}
