import { Injectable, Logger } from '@nestjs/common';
import { PushPayload } from './fcm-push.service';
import * as apn from 'apn';
import { readFileSync } from 'node:fs';

@Injectable()
export class ApnsPushService {
    private readonly logger = new Logger(ApnsPushService.name);
    private provider: apn.Provider | null = null;

    private getProvider(): apn.Provider | null {
        if (this.provider) return this.provider;

        const keyPath = process.env.APNS_KEY_PATH;
        const keyValue = process.env.APNS_KEY;
        const keyId = process.env.APNS_KEY_ID;
        const teamId = process.env.APNS_TEAM_ID;

        if ((!keyPath && !keyValue) || !keyId || !teamId) {
            this.logger.warn('APNS credentials are not configured');
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
            this.logger.error('Failed to initialize APNS provider', error);
            return null;
        }
    }

    async send(token: string, payload: PushPayload): Promise<void> {
        const provider = this.getProvider();
        if (!provider) {
            return;
        }

        const notification = new apn.Notification();
        notification.alert = {
            title: payload.title,
            body: payload.body,
        };
        notification.topic = process.env.APNS_BUNDLE_ID || 'com.sociopath.app';
        notification.sound = 'default';
        notification.payload = payload.data || {};

        await provider.send(notification, token);
    }
}
