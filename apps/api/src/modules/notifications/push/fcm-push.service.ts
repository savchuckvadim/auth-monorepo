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
            const serviceAccount = this.normalizeServiceAccount(parsed);
            if (!serviceAccount) {
                const source = serviceAccountJson
                    ? 'FCM_SERVICE_ACCOUNT_JSON'
                    : `FCM_SERVICE_ACCOUNT_PATH=${serviceAccountPath}`;
                const keys =
                    parsed && typeof parsed === 'object'
                        ? Object.keys(parsed as Record<string, unknown>).join(
                              ',',
                          )
                        : 'none';
                this.logger.error(
                    `Invalid FCM service account JSON structure source=${source} keys=[${keys}]`,
                );
                return null;
            }
            const appName = `push-fcm-${Date.now()}`;
            const app = admin.initializeApp(
                {
                    credential: admin.credential.cert(serviceAccount),
                },
                appName,
            );
            this.messaging = app.messaging();
            this.logger.log(
                `FCM client initialized projectId=${serviceAccount.projectId} clientEmailPrefix=${serviceAccount.clientEmail?.split('@')[0] ?? 'unknown'}`,
            );
            return this.messaging;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            this.logger.error(
                `Failed to initialize FCM client message=${message}`,
            );
            return null;
        }
    }

    /**
     * Accepts both snake_case (raw Google service account JSON) and camelCase shapes
     * and normalises them to firebase-admin's ServiceAccount interface. Also unescapes
     * `\n` sequences frequently introduced by env-var pipelines.
     */
    private normalizeServiceAccount(
        value: unknown,
    ): admin.ServiceAccount | null {
        if (!value || typeof value !== 'object') return null;
        const source = value as Record<string, unknown>;

        const projectId =
            (typeof source.project_id === 'string' && source.project_id) ||
            (typeof source.projectId === 'string' && source.projectId) ||
            '';
        const clientEmail =
            (typeof source.client_email === 'string' && source.client_email) ||
            (typeof source.clientEmail === 'string' && source.clientEmail) ||
            '';
        let privateKey =
            (typeof source.private_key === 'string' && source.private_key) ||
            (typeof source.privateKey === 'string' && source.privateKey) ||
            '';

        if (!projectId || !clientEmail || !privateKey) {
            return null;
        }

        if (privateKey.includes('\\n') && !privateKey.includes('\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        return { projectId, clientEmail, privateKey };
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
