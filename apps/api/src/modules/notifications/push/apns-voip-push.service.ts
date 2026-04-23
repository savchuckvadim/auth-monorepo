import { Injectable, Logger } from '@nestjs/common';
import { PushPayload } from './fcm-push.service';
import * as apn from 'apn';
import { readFileSync } from 'node:fs';

@Injectable()
export class ApnsVoipPushService {
    private readonly logger = new Logger(ApnsVoipPushService.name);
    private provider: apn.Provider | null = null;

    private getProvider(): apn.Provider | null {
        if (this.provider) return this.provider;

        const keyPath =
            process.env.APNS_VOIP_KEY_PATH || process.env.APNS_KEY_PATH;
        const keyValue = process.env.APNS_VOIP_KEY || process.env.APNS_KEY;
        const keyId = process.env.APNS_VOIP_KEY_ID || process.env.APNS_KEY_ID;
        const teamId =
            process.env.APNS_VOIP_TEAM_ID || process.env.APNS_TEAM_ID;

        if ((!keyPath && !keyValue) || !keyId || !teamId) {
            this.logger.warn('APNS VoIP credentials are not configured');
            return null;
        }

        try {
            const token = {
                key: keyValue || readFileSync(keyPath as string, 'utf-8'),
                keyId,
                teamId,
            };
            this.provider = new apn.Provider({
                token,
                production: process.env.NODE_ENV === 'production',
            });
            return this.provider;
        } catch (error) {
            this.logger.error('Failed to initialize APNS VoIP provider', error);
            return null;
        }
    }

    async send(token: string, payload: PushPayload): Promise<void> {
        const provider = this.getProvider();
        if (!provider) {
            return;
        }

        const notification = new apn.Notification();
        notification.topic =
            process.env.APNS_VOIP_TOPIC ||
            `${process.env.APNS_BUNDLE_ID || ''}.voip`;
        notification.priority = 10;
        notification.expiry = Math.floor(Date.now() / 1000) + 30;
        const voipNotification = notification as apn.Notification & {
            pushType?: 'voip' | 'alert';
            headers?: Record<string, string>;
        };
        voipNotification.headers = {
            ...(voipNotification.headers || {}),
            'apns-push-type': 'voip',
        };
        voipNotification.pushType = 'voip';
        notification.payload = {
            ...payload.data,
            title: payload.title,
            body: payload.body,
        };

        const response = await provider.send(notification, token);
        const failedReasons = response.failed
            .map(item => item.response?.reason || item.error?.message)
            .filter(Boolean)
            .join(',');
        this.logger.log(
            `APNS_VOIP send response tokenPrefix=${token.slice(0, 12)} sent=${response.sent.length} failed=${response.failed.length} reasons=[${failedReasons || 'none'}]`,
        );
    }
}
