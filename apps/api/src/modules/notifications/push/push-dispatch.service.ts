import { Injectable } from '@nestjs/common';
import { PushProvider } from 'generated/prisma';
import { NotificationsService } from '../notifications.service';
import { FcmPushService, PushPayload } from './fcm-push.service';
import { ApnsPushService } from './apns-push.service';
import { ApnsVoipPushService } from './apns-voip-push.service';

@Injectable()
export class PushDispatchService {
    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly fcmPushService: FcmPushService,
        private readonly apnsPushService: ApnsPushService,
        private readonly apnsVoipPushService: ApnsVoipPushService,
    ) {}

    async sendToUser(userId: string, payload: PushPayload): Promise<void> {
        const devices =
            await this.notificationsService.getActiveDevicesForUser(userId);
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
        await Promise.all(
            devices.map(device =>
                this.sendWithProvider(
                    PushProvider.APNS_VOIP,
                    device.token,
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
        } catch {
            await this.notificationsService.deactivateToken(token);
        }
    }
}
