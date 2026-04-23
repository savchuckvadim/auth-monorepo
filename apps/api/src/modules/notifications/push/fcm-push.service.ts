import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { readFileSync } from 'node:fs';

export interface PushPayload {
    title: string;
    body: string;
    data?: Record<string, string>;
}

@Injectable()
export class FcmPushService {
    private readonly logger = new Logger(FcmPushService.name);
    private messaging: admin.messaging.Messaging | null = null;

    private getMessaging(): admin.messaging.Messaging | null {
        if (this.messaging) return this.messaging;

        const serviceAccountJson = process.env.FCM_SERVICE_ACCOUNT_JSON;
        const serviceAccountPath = process.env.FCM_SERVICE_ACCOUNT_PATH;

        if (!serviceAccountJson && !serviceAccountPath) {
            this.logger.warn('FCM credentials are not configured');
            return null;
        }

        try {
            const raw = serviceAccountJson
                ? serviceAccountJson
                : readFileSync(serviceAccountPath as string, 'utf-8');
            const parsed: unknown = JSON.parse(raw);
            if (!this.isServiceAccount(parsed)) {
                this.logger.error('Invalid FCM service account JSON structure');
                return null;
            }
            const appName = `push-fcm-${Date.now()}`;
            const app = admin.initializeApp(
                {
                    credential: admin.credential.cert(parsed),
                },
                appName,
            );
            this.messaging = app.messaging();
            return this.messaging;
        } catch (error) {
            this.logger.error('Failed to initialize FCM client', error);
            return null;
        }
    }

    private isServiceAccount(value: unknown): value is admin.ServiceAccount {
        if (!value || typeof value !== 'object') return false;
        const maybe = value as Partial<admin.ServiceAccount>;
        return (
            typeof maybe.projectId === 'string' &&
            typeof maybe.clientEmail === 'string' &&
            typeof maybe.privateKey === 'string'
        );
    }

    async send(token: string, payload: PushPayload): Promise<void> {
        const messaging = this.getMessaging();
        if (!messaging) {
            return;
        }

        try {
            const messageId = await messaging.send({
                token,
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
                data: payload.data,
                android: {
                    priority: 'high',
                },
                apns: {
                    headers: {
                        'apns-priority': '10',
                    },
                },
            });
            this.logger.log(
                `FCM send success tokenPrefix=${token.slice(0, 12)} messageId=${messageId}`,
            );
        } catch (error) {
            const firebaseError = error as admin.FirebaseError;
            this.logger.error(
                `FCM send failed tokenPrefix=${token.slice(0, 12)} code=${firebaseError?.code ?? 'unknown'} message=${firebaseError?.message ?? String(error)}`,
            );
            throw error;
        }
    }
}
