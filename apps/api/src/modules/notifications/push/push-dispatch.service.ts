import { Injectable, Logger } from '@nestjs/common';
import { PushProvider } from 'generated/prisma';
import { NotificationsService } from '../notifications.service';
import { FcmPushService, PushPayload } from './fcm-push.service';
import { ApnsPushService } from './apns-push.service';
import { ApnsVoipPushService } from './apns-voip-push.service';

@Injectable()
export class PushDispatchService {
    private readonly logger = new Logger(PushDispatchService.name);

    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly fcmPushService: FcmPushService,
        private readonly apnsPushService: ApnsPushService,
        private readonly apnsVoipPushService: ApnsVoipPushService,
    ) {}

    private tokenPrefix(token: string): string {
        return token.slice(0, 12);
    }

    async sendToUser(userId: string, payload: PushPayload): Promise<void> {
        const devices =
            await this.notificationsService.getActiveDevicesForUser(userId);
        this.logger.log(
            `sendToUser userId=${userId} devices=${devices.length} providers=[${devices.map(d => d.provider).join(',')}]`,
        );
        await Promise.all(
            devices.map(device =>
                this.sendWithProvider(device.provider, device.token, payload),
            ),
        );
    }

    async sendIncomingCallVoip(
        userId: string,
        payload: PushPayload,
    ): Promise<void> {
        const devices =
            await this.notificationsService.getActiveVoipDevicesForUser(userId);
        if (devices.length === 0) {
            this.logger.warn(
                `sendIncomingCallVoip no devices userId=${userId} (expected APNS_VOIP or voipToken)`,
            );
        }
        this.logger.log(
            `sendIncomingCallVoip userId=${userId} devices=${devices.length} providers=[${devices.map(d => d.provider).join(',')}]`,
        );
        await Promise.all(
            devices.map(device =>
                this.sendWithProvider(
                    PushProvider.APNS_VOIP,
                    device.voipToken || device.token,
                    payload,
                ),
            ),
        );
    }

    private async sendWithProvider(
        provider: PushProvider,
        token: string,
        payload: PushPayload,
    ): Promise<void> {
        try {
            if (provider === PushProvider.FCM) {
                await this.fcmPushService.send(token, payload);
                return;
            }

            if (provider === PushProvider.APNS) {
                await this.apnsPushService.send(token, payload);
                return;
            }

            if (provider === PushProvider.APNS_VOIP) {
                await this.apnsVoipPushService.send(token, payload);
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            this.logger.error(
                `sendWithProvider failed provider=${provider} tokenPrefix=${this.tokenPrefix(token)} message=${errorMessage}`,
            );
            await this.notificationsService.deactivateToken(token);
        }
    }
}
