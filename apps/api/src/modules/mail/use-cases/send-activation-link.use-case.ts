import { JobNames, QueueDispatcherService, QueueNames } from "@/core/queue";
import { SendMailActivationLinkDto } from "../dtos/activation-link.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SendMailActivationLinkUseCase {
    constructor(
        private readonly dispatcher: QueueDispatcherService,

    ) { }

    async activationLink(dto: SendMailActivationLinkDto) {

        return await this.dispatcher.dispatch(

            QueueNames.MAIL,
            JobNames.MAIL_VERIFICATION,
            dto
        );
    }
}
