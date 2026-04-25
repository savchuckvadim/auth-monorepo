import { PushProvider } from 'generated/prisma';

/** APNS `reason` values that mean the device token must not be used again. */
const APNS_FATAL_REASONS = new Set([
    'Unregistered',
    'BadDeviceToken',
    'DeviceTokenNotForTopic',
]);

/** Substrings that appear in FCM / Firebase Admin errors for dead tokens. */
const FCM_FATAL_CODE_FRAGMENTS = [
    'invalid-registration-token',
    'registration-token-not-registered',
] as const;

/**
 * Returns true when the error indicates the push credential is permanently
 * invalid and the corresponding `push_devices` row should be deactivated.
 */
export function isInvalidPushCredentialError(
    provider: PushProvider,
    error: unknown,
): boolean {
    if (provider === PushProvider.FCM) {
        const err = error as { code?: string; message?: string };
        const code =
            typeof err?.code === 'string' ? err.code.toLowerCase() : '';
        const msg =
            typeof err?.message === 'string' ? err.message.toLowerCase() : '';
        return FCM_FATAL_CODE_FRAGMENTS.some(
            frag => code.includes(frag) || msg.includes(frag),
        );
    }

    if (error instanceof Error) {
        const m = error.message;
        if (m.startsWith('APNS:')) {
            const reason = m.slice('APNS:'.length);
            return APNS_FATAL_REASONS.has(reason);
        }
        return APNS_FATAL_REASONS.has(m);
    }

    return false;
}

export function apnsFatalReason(reason: string | undefined): boolean {
    if (!reason) return false;
    return APNS_FATAL_REASONS.has(reason);
}
