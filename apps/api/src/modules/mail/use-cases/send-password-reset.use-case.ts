import { JobNames, QueueDispatcherService, QueueNames } from '@/core/queue';
import { Injectable } from '@nestjs/common';
import { SendMailPasswordResetDto } from '../dtos/password-reset.dto';

@Injectable()
export class SendMailPasswordResetUseCase {
    constructor(private readonly dispatcher: QueueDispatcherService) {}

    async passwordReset(dto: SendMailPasswordResetDto) {
        return await this.dispatcher.dispatch(
            QueueNames.MAIL,
            JobNames.MAIL_PASSWORD_RESET,
            dto,
        );
    }
}
