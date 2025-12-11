import { JobNames, QueueNames } from "@/core/queue";
import { Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { MailService } from "../services/mail.service";
import { SendMailActivationLinkDto } from "../dtos/activation-link.dto";
import { Injectable } from "@nestjs/common";


@Injectable()
@Processor(QueueNames.MAIL)
export class MailProcessor {
    constructor(
        private readonly mailService: MailService,

    ) { }

    @Process(JobNames.MAIL_VERIFICATION)
    async handleSendActivationLink(job: Job<SendMailActivationLinkDto>) {
        console.log('handleSendActivationLink', job.data);
        await this.mailService.sendActivationLink(
            job.data
        );
    }
}
