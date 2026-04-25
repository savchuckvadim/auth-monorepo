import { Injectable, Logger } from '@nestjs/common';
import { PushPlatform, PushProvider } from 'generated/prisma';
import { NotificationsService } from '../notifications.service';
import { FcmPushService, PushPayload } from './fcm-push.service';
import { ApnsPushService } from './apns-push.service';
import { ApnsVoipPushService } from './apns-voip-push.service';
import { isInvalidPushCredentialError } from './push-token-error.util';

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

    /**
     * Always-on push for an incoming call. Delivers to every registered
     * mobile device of the user regardless of online/offline status:
     * - iOS  → APNS VoIP (PushKit) so CallKit can wake the device
     * - Android → FCM with high priority
     *
     * Web clients receive the call through the calls WS gateway instead.
     */
    async sendIncomingCall(
        userId: string,
        payload: PushPayload,
    ): Promise<void> {
        const devices =
            await this.notificationsService.getActiveMobilePushDevicesForUser(
                userId,
            );
        if (devices.length === 0) {
            this.logger.warn(
                `sendIncomingCall no mobile devices registered userId=${userId}`,
            );
            return;
        }
        this.logger.log(
            `sendIncomingCall userId=${userId} devices=${devices.length} platforms=[${devices.map(d => d.platform).join(',')}] providers=[${devices.map(d => d.provider).join(',')}]`,
        );

        await Promise.all(
            devices.map(device => {
                if (device.platform === PushPlatform.IOS) {
                    const voipToken =
                        device.voipToken ||
                        (device.provider === PushProvider.APNS_VOIP
                            ? device.token
                            : null);
                    if (!voipToken) {
                        this.logger.warn(
                            `sendIncomingCall iOS device without voipToken userId=${userId} pushDeviceId=${device.id} provider=${device.provider}`,
                        );
                        return Promise.resolve();
                    }
                    return this.sendWithProvider(
                        PushProvider.APNS_VOIP,
                        voipToken,
                        payload,
                    );
                }

                if (device.platform === PushPlatform.ANDROID) {
                    if (device.provider !== PushProvider.FCM) {
                        this.logger.warn(
                            `sendIncomingCall Android device with non-FCM provider userId=${userId} pushDeviceId=${device.id} provider=${device.provider}`,
                        );
                    }
                    return this.sendWithProvider(
                        PushProvider.FCM,
                        device.token,
                        payload,
                    );
                }

                return Promise.resolve();
            }),
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
            if (isInvalidPushCredentialError(provider, error)) {
                await this.notificationsService.deactivateByPushCredential(
                    token,
                );
            }
        }
    }

    /**
     * Dismisses incoming-call UI on the user's other mobile devices (same
     * installation may ignore if it already handled the event locally).
     */
    async sendCancelCallToMobileUsers(
        userIds: string[],
        params: { callId: string; chatId?: string; reason: string },
    ): Promise<void> {
        const unique = [...new Set(userIds.filter(Boolean))];
        const data: Record<string, string> = {
            type: 'cancel_call',
            callId: params.callId,
            reason: params.reason,
            chatId: params.chatId ?? '',
        };
        const payload: PushPayload = {
            title: 'Call',
            body: 'Call update',
            data,
        };
        await Promise.all(
            unique.map(userId => this.sendIncomingCall(userId, payload)),
        );
    }
}
