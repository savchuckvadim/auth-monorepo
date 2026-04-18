/**
 * Мессенджерный E2EE на базе **Signal Protocol** (библиотека `@privacyresearch/libsignal-protocol-typescript`).
 *
 * **Whisper — не отдельный продукт.** В терминологии Signal Protocol зашифрованные пакеты называются
 * *Whisper messages*: **PreKey Whisper Message** (первое сообщение в сессии или после сброса) и
 * **Whisper Message** (последующие). Оба типа создаёт `SessionCipher.encrypt()`; при приёме
 * вызываются `decryptPreKeyWhisperMessage` / `decryptWhisperMessage`. «Ratchet» (симметричное
 * продвижение ключей) внутри этих вызовов — это и есть ядро Signal, не отдельный модуль.
 *
 * **Поток данных (упрощённо):**
 * 1. `ensureLocalSignalDeviceRegistered` — генерируем identity + pre-keys, кладём в IndexedDB,
 *    регистрируем публичные ключи на сервере; сервер отдаёт `serverDeviceId` для адресации.
 * 2. **Исходящее:** для каждого устройства получателя тянем pre-key bundle с API, `SessionBuilder`
 *    строит сессию, `SessionCipher.encrypt` → ciphertext + тип (3 = pre-key и т.д.).
 * 3. **Входящее:** по `(senderId, senderClientDeviceId)` открываем `SessionCipher`, по типу
 *    сообщения выбираем decrypt; состояние сессии в IndexedDB обновляется — поэтому порядок
 *    расшифровки по одному отправителю/устройству должен быть строго последовательным
 *    (`decryptSignalMessageContentSerialized`).
 *
 * **Ключи и plaintext:** секретные ключи и сессии — в IndexedDB (`signal-idb-storage`). Кеш
 * расшифрованного/исходного текста сообщений — в `localStorage` (см. `signal-*-plaintext-cache.ts`):
 * это компромисс UX/безопасность, не часть протокола.
 */
import {
    KeyHelper,
    SessionBuilder,
    SessionCipher,
    SignalProtocolAddress,
    type DeviceType,
} from '@privacyresearch/libsignal-protocol-typescript';
import { v4 as uuidv4 } from 'uuid';
import {
    getEncryption,
    type RegisterDeviceDto,
} from '@workspace/nest-api';

/** GET /api/encryption/prekey-bundle/:userId — orval may type response as void; runtime matches this shape. */
interface PreKeyBundleDto {
    id: string;
    clientDeviceId: string;
    identityKey: string;
    registrationId: number;
    signedPreKey: {
        keyId: number;
        publicKey: string;
        signature: string;
    };
    preKey?: { keyId: number; publicKey: string };
}
import {
    b64ToBuf,
    bufToB64,
    createMessengerSignalStorage,
    persistInitialMessengerKeys,
} from './signal-idb-storage';

const LS_DEVICE_ROW = 'messenger_signal_device_row_id';
const LS_CLIENT_DEVICE = 'signal_device_id';

/**
 * ID строки устройства на сервере (не путать с `clientDeviceId`).
 * Нужен, чтобы знать, какие входящие E2EE адресованы *этому* браузеру (`toDeviceId`).
 */
export function getLocalMessengerServerDeviceId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LS_DEVICE_ROW);
}

let storeSingleton: ReturnType<typeof createMessengerSignalStorage> | null =
    null;

/** Единый адаптер хранилища для libsignal (сессии, pre-keys, identity) — см. `signal-idb-storage`. */
function getStore() {
    if (!storeSingleton) {
        storeSingleton = createMessengerSignalStorage();
    }
    return storeSingleton;
}

/**
 * Libsignal адресует устройство парой `(userId, deviceId:number)`.
 * Сервер отдаёт строковый `clientDeviceId` — маппим в стабильное положительное число (djb2-подобный хеш).
 */
export function stableDeviceNumber(clientDeviceId: string): number {
    let h = 5381;
    for (let i = 0; i < clientDeviceId.length; i++) {
        h = ((h << 5) + h) ^ clientDeviceId.charCodeAt(i);
    }
    const n = h >>> 0;
    return n === 0 ? 1 : n;
}

/** ciphertext из libsignal приходит как «binary string»; перед отправкой на API кодируем в base64. */
function binaryStringToBase64(s: string): string {
    const bytes = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i) & 0xff;
    let bin = '';
    for (let i = 0; i < bytes.length; i++) {
        const b = bytes[i];
        if (b !== undefined) bin += String.fromCharCode(b);
    }
    return btoa(bin);
}

function arrayBufferToBinaryString(ab: ArrayBuffer): string {
    const u8 = new Uint8Array(ab);
    let s = '';
    for (let i = 0; i < u8.length; i++) {
        const b = u8[i];
        if (b !== undefined) s += String.fromCharCode(b);
    }
    return s;
}

/** Pre-key bundle с сервера → структура `DeviceType` для `SessionBuilder.processPreKey`. */
function bundleToDeviceType(bundle: PreKeyBundleDto): DeviceType {
    return {
        identityKey: b64ToBuf(bundle.identityKey),
        registrationId: bundle.registrationId,
        signedPreKey: {
            keyId: bundle.signedPreKey.keyId,
            publicKey: b64ToBuf(bundle.signedPreKey.publicKey),
            signature: b64ToBuf(bundle.signedPreKey.signature),
        },
        ...(bundle.preKey
            ? {
                  preKey: {
                      keyId: bundle.preKey.keyId,
                      publicKey: b64ToBuf(bundle.preKey.publicKey),
                  },
              }
            : {}),
    };
}

/**
 * Ленивая регистрация клиента E2EE: ключи в IndexedDB, метаданные на сервере.
 * Повторные вызовы при наличии `localStorage` возвращают уже существующее устройство без повторной генерации.
 */
export async function ensureLocalSignalDeviceRegistered(): Promise<{
    serverDeviceId: string;
    clientDeviceId: string;
}> {
    if (typeof window === 'undefined') {
        throw new Error('E2EE is only available in the browser');
    }
    const row = localStorage.getItem(LS_DEVICE_ROW);
    let client = localStorage.getItem(LS_CLIENT_DEVICE);
    if (row && client) {
        return { serverDeviceId: row, clientDeviceId: client };
    }
    if (!client) {
        client = uuidv4();
        localStorage.setItem(LS_CLIENT_DEVICE, client);
    }

    const store = getStore();
    const registrationId = KeyHelper.generateRegistrationId();
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    const signedPreKeyId = 1;
    const signedPreKey = await KeyHelper.generateSignedPreKey(
        identityKeyPair,
        signedPreKeyId,
    );
    const preKeys: { keyId: number; publicKey: string }[] = [];
    const oneTimePreKeys: { keyId: number; publicKey: string }[] = [];
    for (let i = 1; i <= 5; i++) {
        const pk = await KeyHelper.generatePreKey(i);
        preKeys.push({
            keyId: pk.keyId,
            publicKey: bufToB64(pk.keyPair.pubKey),
        });
        await store.storePreKey(pk.keyId, pk.keyPair);
    }
    for (let i = 1; i <= 10; i++) {
        const pk = await KeyHelper.generatePreKey(100 + i);
        oneTimePreKeys.push({
            keyId: pk.keyId,
            publicKey: bufToB64(pk.keyPair.pubKey),
        });
        await store.storePreKey(pk.keyId, pk.keyPair);
    }

    await persistInitialMessengerKeys(
        identityKeyPair,
        registrationId,
        signedPreKeyId,
        signedPreKey.keyPair,
    );

    const api = getEncryption();
    const dto: RegisterDeviceDto = {
        clientDeviceId: client,
        name: 'Web',
        type: 'web',
        registrationId,
        identityKey: bufToB64(identityKeyPair.pubKey),
        signedPreKey: bufToB64(signedPreKey.keyPair.pubKey),
        signedPreKeySig: bufToB64(signedPreKey.signature),
        preKeys,
        oneTimePreKeys,
    };
    const res = await api.encryptionRegister(dto);

    localStorage.setItem(LS_DEVICE_ROW, res.id);
    return { serverDeviceId: res.id, clientDeviceId: client };
}

export type EncryptedOutgoingPayload = {
    content: string;
    isEncrypted: true;
    toDeviceId: string;
    senderDeviceId: string;
    signalMessageType: string;
    registrationId?: number;
};

/**
 * Шифрует один и тот же plaintext **для каждого** зарегистрированного устройства получателя
 * (отдельная сессия и отдельный ciphertext на устройство). Сервер раздаёт сообщения по `toDeviceId`.
 */
export async function encryptOutgoingForSignalChat(
    recipientUserId: string,
    plaintext: string,
    myServerDeviceId: string,
): Promise<EncryptedOutgoingPayload[]> {
    const store = getStore();
    const api = getEncryption();
    const bundles = (await api.encryptionBundleForUser(
        recipientUserId,
    )) as unknown as PreKeyBundleDto[];
    if (!bundles.length) {
        throw new Error('Recipient has no registered Signal devices');
    }
    const out: EncryptedOutgoingPayload[] = [];
    const buf = new TextEncoder().encode(plaintext).buffer;
    for (const bundle of bundles) {
        const device = bundleToDeviceType(bundle);
        const address = new SignalProtocolAddress(
            recipientUserId,
            stableDeviceNumber(bundle.clientDeviceId),
        );
        const cipher = new SessionCipher(store, address);
        if (!(await cipher.hasOpenSession())) {
            const builder = new SessionBuilder(store, address);
            await builder.processPreKey(device);
        }
        const msg = await cipher.encrypt(buf);
        const body = msg.body!;
        const b64 =
            msg.type === 3
                ? binaryStringToBase64(body)
                : binaryStringToBase64(body);
        out.push({
            content: b64,
            isEncrypted: true,
            toDeviceId: bundle.id,
            senderDeviceId: myServerDeviceId,
            signalMessageType: String(msg.type),
            registrationId: msg.registrationId,
        });
    }
    return out;
}

/**
 * Расшифровка одного входящего сообщения с сервера (base64 → binary string → libsignal).
 * Тип 3 (и алиасы) — PreKey Whisper, иначе обычный Whisper Message; состояние сессии пишется в store.
 *
 * Не вызывать параллельно для сообщений одного `(senderId, senderClientDeviceId)` — использовать
 * {@link decryptSignalMessageContentSerialized}.
 */
export async function decryptSignalMessageContent(input: {
    senderId: string;
    senderClientDeviceId?: string;
    content: string;
    signalMessageType?: string;
}): Promise<string> {
    if (!input.senderClientDeviceId) {
        throw new Error('Missing senderClientDeviceId on encrypted message');
    }
    const store = getStore();
    const address = new SignalProtocolAddress(
        input.senderId,
        stableDeviceNumber(input.senderClientDeviceId),
    );
    const cipher = new SessionCipher(store, address);
    const binStr = arrayBufferToBinaryString(b64ToBuf(input.content));
    const t = input.signalMessageType;
    const raw = String(t ?? '').trim();
    const typeNum = typeof t === 'number' ? t : Number(raw);
    const isPreKey =
        raw === '3' ||
        raw === 'PREKEY' ||
        raw === 'PREKEY_WHISPER' ||
        typeNum === 3;
    const plaintext = isPreKey
        ? await cipher.decryptPreKeyWhisperMessage(binStr, 'binary')
        : await cipher.decryptWhisperMessage(binStr, 'binary');
    return new TextDecoder().decode(new Uint8Array(plaintext));
}

/** Очередь промисов на пару (отправитель + устройство): ratchet требует строгого порядка decrypt. */
const incomingDecryptChains = new Map<string, Promise<unknown>>();

function incomingDecryptQueueKey(senderId: string, senderClientDeviceId: string) {
    return `${senderId}\u0000${senderClientDeviceId}`;
}

/**
 * Обёртка над {@link decryptSignalMessageContent}: ставит расшифровки в очередь на ключ
 * `(senderId + senderClientDeviceId)`, чтобы не ломать Double Ratchet при множественном mount/React.
 */
export function decryptSignalMessageContentSerialized(input: {
    senderId: string;
    senderClientDeviceId?: string;
    content: string;
    signalMessageType?: string;
}): Promise<string> {
    const sid = input.senderClientDeviceId;
    if (!sid) {
        return decryptSignalMessageContent(input);
    }
    const qKey = incomingDecryptQueueKey(input.senderId, sid);
    const prev = incomingDecryptChains.get(qKey) ?? Promise.resolve();
    const next = prev
        .catch(() => {})
        .then(() => decryptSignalMessageContent(input));
    incomingDecryptChains.set(
        qKey,
        next.then(
            () => undefined,
            () => undefined,
        ),
    );
    return next;
}
