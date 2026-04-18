/**
 * Хранилище для **libsignal** (Signal Protocol): сессии, identity, pre-keys.
 *
 * **`openDB`** — функция из пакета [`idb`](https://github.com/jakearchibald/idb): обёртка над
 * браузерным **IndexedDB** (асинхронная БД в браузере, не то же самое, что `localStorage`).
 * Открывает/создаёт БД `messenger-signal-v1`, object store `kv` (ключ → строка). Сессии Signal
 * сериализуются строками и кладутся под ключами вида `session_${encodedAddress}`.
 *
 * Реализует интерфейс `StorageType` из libsignal: библиотека сама читает/пишет ключи при encrypt/decrypt.
 *
 * **Замечание:** `isTrustedIdentity` сейчас всегда `true` — для продакшена обычно добавляют
 * проверку отпечатка (TOFU или сравнение с доверенным значением), иначе возможен MITM при первом контакте.
 */
import type { StorageType } from '@privacyresearch/libsignal-protocol-typescript';
import type { KeyPairType } from '@privacyresearch/libsignal-protocol-typescript';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface MessengerKv extends DBSchema {
    kv: { key: string; value: string };
}

function bufToB64(buf: ArrayBuffer): string {
    const u8 = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < u8.length; i++) {
        const b = u8[i];
        if (b !== undefined) s += String.fromCharCode(b);
    }
    return btoa(s);
}

function b64ToBuf(s: string): ArrayBuffer {
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out.buffer;
}

function kpToJson(kp: KeyPairType): { pub: string; priv: string } {
    return { pub: bufToB64(kp.pubKey), priv: bufToB64(kp.privKey) };
}

function kpFromJson(j: { pub: string; priv: string }): KeyPairType {
    return { pubKey: b64ToBuf(j.pub), privKey: b64ToBuf(j.priv) };
}

let dbPromise: Promise<IDBPDatabase<MessengerKv>> | null = null;

/** Ленивое открытие одной БД на вкладку (повторные вызовы возвращают тот же промис). */
function getDb(): Promise<IDBPDatabase<MessengerKv>> {
    if (!dbPromise) {
        dbPromise = openDB<MessengerKv>('messenger-signal-v1', 1, {
            upgrade(database) {
                database.createObjectStore('kv');
            },
        });
    }
    return dbPromise;
}

async function kvGet(key: string): Promise<string | undefined> {
    const db = await getDb();
    return db.get('kv', key);
}

async function kvSet(key: string, value: string): Promise<void> {
    const db = await getDb();
    await db.put('kv', value, key);
}

async function kvDel(key: string): Promise<void> {
    const db = await getDb();
    await db.delete('kv', key);
}

/** Сохраняет локально сгенерированные identity и signed pre-key до вызова API регистрации. */
export async function persistInitialMessengerKeys(
    identityKeyPair: KeyPairType,
    registrationId: number,
    signedPreKeyId: number,
    signedKeyPair: KeyPairType,
): Promise<void> {
    await kvSet('identity_keypair', JSON.stringify(kpToJson(identityKeyPair)));
    await kvSet('registration_id', String(registrationId));
    await kvSet(
        `signed_prekey_${signedPreKeyId}`,
        JSON.stringify(kpToJson(signedKeyPair)),
    );
}

/**
 * Фабрика адаптера для libsignal: все операции идут в IndexedDB через `kvGet`/`kvSet`/`kvDel`.
 */
export function createMessengerSignalStorage(): StorageType {
    return {
        getIdentityKeyPair: async () => {
            const raw = await kvGet('identity_keypair');
            return raw ? kpFromJson(JSON.parse(raw)) : undefined;
        },
        getLocalRegistrationId: async () => {
            const raw = await kvGet('registration_id');
            return raw !== undefined ? Number(raw) : undefined;
        },
        isTrustedIdentity: async (_id, _key, _dir) => {
            void _id;
            void _key;
            void _dir;
            return true;
        },
        saveIdentity: async (encodedAddress, publicKey) => {
            await kvSet(`identity_${encodedAddress}`, bufToB64(publicKey));
            return false;
        },
        loadPreKey: async keyId => {
            const raw = await kvGet(`prekey_${keyId}`);
            return raw ? kpFromJson(JSON.parse(raw)) : undefined;
        },
        storePreKey: async (keyId, keyPair) => {
            await kvSet(`prekey_${keyId}`, JSON.stringify(kpToJson(keyPair)));
        },
        removePreKey: async keyId => {
            await kvDel(`prekey_${keyId}`);
        },
        storeSession: async (encodedAddress, record) => {
            await kvSet(`session_${encodedAddress}`, record);
        },
        loadSession: async encodedAddress => {
            return (await kvGet(`session_${encodedAddress}`)) ?? undefined;
        },
        loadSignedPreKey: async keyId => {
            const raw = await kvGet(`signed_prekey_${keyId}`);
            return raw ? kpFromJson(JSON.parse(raw)) : undefined;
        },
        storeSignedPreKey: async (keyId, keyPair) => {
            await kvSet(
                `signed_prekey_${keyId}`,
                JSON.stringify(kpToJson(keyPair)),
            );
        },
        removeSignedPreKey: async keyId => {
            await kvDel(`signed_prekey_${keyId}`);
        },
    };
}

export { bufToB64, b64ToBuf };
