# Сквозное шифрование для чатов и звонков (React Native)

## Назначение

Реализовать сквозное шифрование (End-to-End Encryption, E2EE) для чатов и звонков по типу протокола Signal в React Native приложении. Обеспечить полную конфиденциальность сообщений и звонков, чтобы только участники могли видеть содержимое.

## ⚠️ КРИТИЧЕСКИ ВАЖНО: Multi-Device архитектура

**В production каждое устройство = отдельная крипто-сущность.**

Это означает:
- Каждое устройство (мобильное, веб, планшет) имеет свой собственный набор ключей
- Сообщения шифруются отдельно для каждого устройства получателя
- Если получатель имеет 3 устройства, сообщение должно быть зашифровано 3 раза
- **Сообщения видны только на том устройстве, на котором они были расшифрованы**
- При потере устройства все сессии с этим устройством становятся недействительными
- **Если вы отправили сообщение с мобильного приложения, оно будет видно только на том устройстве получателя, где оно было расшифровано**

## Справочная информация

**Протокол Signal** ([Wikipedia](https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%BE%D1%82%D0%BE%D0%BA%D0%BE%D0%BB_Signal)):
- Использует **Double Ratchet Algorithm** для постоянного обновления ключей
- **X3DH** - протокол установления сессии
- **Prekeys** и расширенный протокол тройного обмена ключами Диффи-Хеллмана (3-DH)
- Криптографические примитивы: **Curve25519**, **AES-256**, **HMAC-SHA256**
- Обеспечивает: конфиденциальность, целостность, аутентификацию, прямую секретность, пост-скомпрометированную безопасность
- Поддерживает асинхронную связь (оффлайновые сообщения)
- Устойчив к искаженному порядку сообщений

## Требования

### Функционал

1. **Сквозное шифрование для чатов**:
   - Шифрование сообщений на клиенте перед отправкой
   - Расшифровка на клиенте получателя
   - Сервер не может видеть содержимое сообщений
   - Поддержка для обычных и секретных чатов
   - **Multi-device**: шифрование для всех устройств получателя

2. **Сквозное шифрование для звонков**:
   - Шифрование медиа-потоков в LiveKit
   - Использование DTLS-SRTP для звонков
   - Защита аудио и видео данных

3. **Управление ключами**:
   - Генерация ключевых пар для каждого устройства
   - Обмен ключами через сервер (prekeys)
   - Хранение ключей в Secure Storage (НЕ AsyncStorage)
   - Ротация ключей (Double Ratchet)
   - **Управление deviceId**: генерация и хранение

4. **Безопасность**:
   - Forward secrecy (прямая секретность)
   - Post-compromise security (безопасность после компрометации)
   - Аутентификация участников
   - Защита от MITM атак

## Установка библиотек

### Шаг 1: Установка libsignal

```bash
cd apps/mobile  # или путь к вашему React Native проекту
npm install @privacyresearch/libsignal-protocol-typescript
```

**Альтернативные библиотеки**:
- `libsignal-client` (через WASM) - более производительная, но требует настройки для React Native
- `react-native-libsodium` - нативная библиотека, но требует дополнительной настройки

**Рекомендация**: Использовать `@privacyresearch/libsignal-protocol-typescript` для начала, так как она:
- Полностью на TypeScript
- Хорошо документирована
- Поддерживает все необходимые функции Signal Protocol
- Работает в React Native без дополнительных настроек

### Шаг 2: Установка Secure Storage

**ВАЖНО**: В React Native НЕЛЬЗЯ хранить приватные ключи в AsyncStorage. Используем Secure Storage.

#### Для Expo:

```bash
npx expo install expo-secure-store
```

#### Для React Native CLI:

```bash
npm install react-native-encrypted-storage
# или
npm install @react-native-async-storage/async-storage react-native-keychain
```

**Рекомендация**: Использовать `expo-secure-store` для Expo или `react-native-encrypted-storage` для React Native CLI.

### Шаг 3: Установка дополнительных зависимостей

```bash
npm install uuid
npm install --save-dev @types/uuid
```

Для работы с AsyncStorage (только для несекретных данных):

```bash
# Для Expo
npx expo install @react-native-async-storage/async-storage

# Для React Native CLI
npm install @react-native-async-storage/async-storage
```

### Шаг 4: Установка полифиллов (если нужно)

Если библиотека libsignal использует Node.js API, может потребоваться полифилл:

```bash
npm install react-native-get-random-values
```

В `index.js` или `App.tsx` (в самом начале):

```typescript
import 'react-native-get-random-values';
```

## Архитектура

### Структура модулей

```
src/
├── modules/
│   ├── encryption/
│   │   ├── index.ts
│   │   ├── components/
│   │   │   └── EncryptionStatus.tsx
│   │   ├── hooks/
│   │   │   ├── useEncryption.ts
│   │   │   ├── useKeyExchange.ts
│   │   │   ├── useEncryptedMessage.ts
│   │   │   └── useDevice.ts
│   │   ├── services/
│   │   │   ├── encryption.service.ts
│   │   │   └── signal-protocol.service.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts
│   │   │   ├── signal-store.ts
│   │   │   └── device-manager.ts
│   │   └── types/
│   │       └── encryption.types.ts
│   └── messages/
│       └── hooks/
│           └── useSendMessage.ts (обновить)
```

## Детальная реализация

### 1. Secure Storage обёртка

```typescript
// storage/secure-storage.ts
import * as SecureStore from 'expo-secure-store';
// или для React Native CLI:
// import EncryptedStorage from 'react-native-encrypted-storage';

export class SecureStorage {
    /**
     * Сохранить значение в Secure Storage
     */
    static async setItem(key: string, value: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (error) {
            console.error('Failed to save to secure storage:', error);
            throw error;
        }
    }

    /**
     * Получить значение из Secure Storage
     */
    static async getItem(key: string): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.error('Failed to get from secure storage:', error);
            return null;
        }
    }

    /**
     * Удалить значение из Secure Storage
     */
    static async removeItem(key: string): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.error('Failed to remove from secure storage:', error);
        }
    }

    /**
     * Очистить все значения
     */
    static async clear(): Promise<void> {
        // SecureStore не имеет метода clear, удаляем по ключам
        // В production нужно хранить список ключей
    }
}
```

### 2. Управление deviceId

```typescript
// storage/device-manager.ts
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info'; // опционально

const DEVICE_ID_KEY = 'signal_device_id';
const DEVICE_NAME_KEY = 'signal_device_name';

export class DeviceManager {
    /**
     * Получить или создать deviceId
     *
     * ВАЖНО: deviceId НЕ должен быть:
     * - MAC address
     * - hardware id
     * - IMEI
     *
     * Только случайный UUID v4
     */
    static async getDeviceId(): Promise<string> {
        try {
            let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

            if (!deviceId) {
                // Генерируем новый UUID v4
                deviceId = uuidv4();
                await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
            }

            return deviceId;
        } catch (error) {
            console.error('Failed to get device ID:', error);
            throw error;
        }
    }

    /**
     * Получить имя устройства
     */
    static async getDeviceName(): Promise<string> {
        try {
            let deviceName = await AsyncStorage.getItem(DEVICE_NAME_KEY);

            if (!deviceName) {
                // Определяем тип устройства
                const deviceType = Platform.OS === 'ios' ? 'iOS' : 'Android';
                const deviceModel = await DeviceInfo.getModel(); // опционально

                deviceName = `${deviceType} Device`;
                if (deviceModel) {
                    deviceName = `${deviceType} ${deviceModel}`;
                }

                await AsyncStorage.setItem(DEVICE_NAME_KEY, deviceName);
            }

            return deviceName;
        } catch (error) {
            console.error('Failed to get device name:', error);
            return 'Mobile Device';
        }
    }

    /**
     * Получить тип устройства
     */
    static getDeviceType(): 'mobile' | 'web' | 'desktop' {
        return 'mobile';
    }
}
```

### 3. Signal Store для React Native

```typescript
// storage/signal-store.ts
import {
    IdentityKeyPair,
    PreKeyBundle,
    PreKeyPair,
    SignedPreKeyPair,
    SessionRecord,
} from '@privacyresearch/libsignal-protocol-typescript';
import { SecureStorage } from './secure-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ключи для хранения в Secure Storage
const IDENTITY_KEY_KEY = 'signal_identity_key';
const REGISTRATION_ID_KEY = 'signal_registration_id';

// Ключи для хранения в AsyncStorage (несекретные данные)
const PREKEYS_KEY = 'signal_prekeys';
const SIGNED_PREKEYS_KEY = 'signal_signed_prekeys';
const SESSIONS_KEY = 'signal_sessions';

export class SignalStore {
    /**
     * Identity Key Pair
     */
    async getIdentityKeyPair(): Promise<IdentityKeyPair | undefined> {
        const data = await SecureStorage.getItem(IDENTITY_KEY_KEY);
        if (!data) return undefined;
        return JSON.parse(data);
    }

    async saveIdentityKeyPair(keyPair: IdentityKeyPair): Promise<void> {
        await SecureStorage.setItem(IDENTITY_KEY_KEY, JSON.stringify(keyPair));
    }

    /**
     * Registration ID
     */
    async getRegistrationId(): Promise<number | undefined> {
        const data = await SecureStorage.getItem(REGISTRATION_ID_KEY);
        return data ? parseInt(data, 10) : undefined;
    }

    async saveRegistrationId(registrationId: number): Promise<void> {
        await SecureStorage.setItem(REGISTRATION_ID_KEY, registrationId.toString());
    }

    /**
     * Prekeys
     */
    async getPreKey(keyId: number): Promise<PreKeyPair | undefined> {
        const data = await AsyncStorage.getItem(PREKEYS_KEY);
        if (!data) return undefined;
        const prekeys = JSON.parse(data);
        return prekeys[keyId];
    }

    async savePreKey(keyId: number, preKey: PreKeyPair): Promise<void> {
        const data = await AsyncStorage.getItem(PREKEYS_KEY);
        const prekeys = data ? JSON.parse(data) : {};
        prekeys[keyId] = preKey;
        await AsyncStorage.setItem(PREKEYS_KEY, JSON.stringify(prekeys));
    }

    async removePreKey(keyId: number): Promise<void> {
        const data = await AsyncStorage.getItem(PREKEYS_KEY);
        if (!data) return;
        const prekeys = JSON.parse(data);
        delete prekeys[keyId];
        await AsyncStorage.setItem(PREKEYS_KEY, JSON.stringify(prekeys));
    }

    /**
     * Signed Prekeys
     */
    async getSignedPreKey(keyId: number): Promise<SignedPreKeyPair | undefined> {
        const data = await AsyncStorage.getItem(SIGNED_PREKEYS_KEY);
        if (!data) return undefined;
        const signedPreKeys = JSON.parse(data);
        return signedPreKeys[keyId];
    }

    async saveSignedPreKey(keyId: number, signedPreKey: SignedPreKeyPair): Promise<void> {
        const data = await AsyncStorage.getItem(SIGNED_PREKEYS_KEY);
        const signedPreKeys = data ? JSON.parse(data) : {};
        signedPreKeys[keyId] = signedPreKey;
        await AsyncStorage.setItem(SIGNED_PREKEYS_KEY, JSON.stringify(signedPreKeys));
    }

    /**
     * Sessions
     */
    async getSession(userId: string, deviceId: string): Promise<SessionRecord | undefined> {
        const key = `${userId}:${deviceId}`;
        const data = await AsyncStorage.getItem(SESSIONS_KEY);
        if (!data) return undefined;
        const sessions = JSON.parse(data);
        return sessions[key];
    }

    async saveSession(userId: string, deviceId: string, session: SessionRecord): Promise<void> {
        const key = `${userId}:${deviceId}`;
        const data = await AsyncStorage.getItem(SESSIONS_KEY);
        const sessions = data ? JSON.parse(data) : {};
        sessions[key] = session;
        await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }

    async removeSession(userId: string, deviceId: string): Promise<void> {
        const key = `${userId}:${deviceId}`;
        const data = await AsyncStorage.getItem(SESSIONS_KEY);
        if (!data) return;
        const sessions = JSON.parse(data);
        delete sessions[key];
        await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }

    async removeAllSessions(userId: string): Promise<void> {
        const data = await AsyncStorage.getItem(SESSIONS_KEY);
        if (!data) return;
        const sessions = JSON.parse(data);

        Object.keys(sessions).forEach(key => {
            if (key.startsWith(`${userId}:`)) {
                delete sessions[key];
            }
        });

        await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }
}
```

### 4. Signal Protocol Service

```typescript
// services/signal-protocol.service.ts
import {
    KeyHelper,
    SessionBuilder,
    SessionCipher,
    SignalProtocolAddress,
    PreKeyBundle,
    PreKeyPair,
    SignedPreKeyPair,
    IdentityKeyPair,
} from '@privacyresearch/libsignal-protocol-typescript';
import { SignalStore } from '../storage/signal-store';
import { DeviceManager } from '../storage/device-manager';
import { EncryptionService } from './encryption.service';

export class SignalProtocolService {
    private store: SignalStore;
    private registrationId: number | null = null;
    private deviceId: string | null = null;

    constructor() {
        this.store = new SignalStore();
    }

    /**
     * Инициализация: получение deviceId и регистрация на сервере
     */
    async initialize(): Promise<void> {
        // Получаем deviceId
        this.deviceId = await DeviceManager.getDeviceId();

        // Проверяем, зарегистрировано ли устройство
        const identityKey = await this.store.getIdentityKeyPair();

        if (!identityKey) {
            // Первая инициализация - генерируем ключи
            await this.generateKeys();
        }
    }

    /**
     * Генерация всех ключей
     */
    async generateKeys(): Promise<{
        identityKeyPair: IdentityKeyPair;
        registrationId: number;
        signedPreKey: SignedPreKeyPair;
        preKeys: PreKeyPair[];
    }> {
        // Identity Key Pair
        const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
        await this.store.saveIdentityKeyPair(identityKeyPair);

        // Registration ID
        const registrationId = await KeyHelper.generateRegistrationId();
        this.registrationId = registrationId;
        await this.store.saveRegistrationId(registrationId);

        // Signed PreKey
        const signedPreKeyId = 1;
        const signedPreKey = await KeyHelper.generateSignedPreKey(
            identityKeyPair,
            signedPreKeyId
        );
        await this.store.saveSignedPreKey(signedPreKeyId, signedPreKey);

        // PreKeys (100 штук)
        const preKeys: PreKeyPair[] = [];
        for (let i = 1; i <= 100; i++) {
            const preKey = await KeyHelper.generatePreKey(i);
            preKeys.push(preKey);
            await this.store.savePreKey(i, preKey);
        }

        return {
            identityKeyPair,
            registrationId,
            signedPreKey,
            preKeys,
        };
    }

    /**
     * Регистрация устройства на сервере
     */
    async registerDevice(): Promise<void> {
        if (!this.deviceId) {
            await this.initialize();
        }

        const identityKey = await this.store.getIdentityKeyPair();
        if (!identityKey) {
            await this.generateKeys();
        }

        const keys = await this.generateKeys();

        // Получаем все prekeys из store
        const preKeys: PreKeyPair[] = [];
        for (let i = 1; i <= 100; i++) {
            const preKey = await this.store.getPreKey(i);
            if (preKey) {
                preKeys.push(preKey);
            }
        }

        // Отправляем на сервер
        const encryptionService = new EncryptionService();
        await encryptionService.registerDevice({
            deviceId: this.deviceId!,
            name: await DeviceManager.getDeviceName(),
            type: DeviceManager.getDeviceType(),
            registrationId: keys.registrationId,
            identityKey: this.serializeKey(keys.identityKeyPair.pubKey),
            signedPreKey: this.serializeKey(keys.signedPreKey.keyPair.pubKey),
            signedPreKeySig: this.serializeSignature(keys.signedPreKey.signature),
            preKeys: preKeys.map(pk => ({
                keyId: pk.keyId,
                publicKey: this.serializeKey(pk.keyPair.pubKey),
            })),
            oneTimePreKeys: [], // Генерируем отдельно
        });
    }

    /**
     * Создание сессии с пользователем (X3DH)
     */
    async createSession(
        userId: string,
        deviceId: string,
        preKeyBundle: PreKeyBundle
    ): Promise<void> {
        const address = new SignalProtocolAddress(userId, parseInt(deviceId) || 1);
        const sessionBuilder = new SessionBuilder(this.store, address);

        await sessionBuilder.processPreKeyBundle(preKeyBundle);
    }

    /**
     * Шифрование сообщения
     */
    async encryptMessage(
        userId: string,
        deviceId: string,
        message: string
    ): Promise<{
        type: 'prekey' | 'whisper';
        body: string;
        registrationId: number;
    }> {
        const address = new SignalProtocolAddress(userId, parseInt(deviceId) || 1);
        const sessionCipher = new SessionCipher(this.store, address);

        // Проверяем, есть ли сессия
        const session = await this.store.getSession(userId, deviceId);

        if (!session) {
            // Нет сессии - нужно получить prekey bundle
            throw new Error('Session not found. Call createSession first.');
        }

        const ciphertext = await sessionCipher.encrypt(message);

        return {
            type: ciphertext.type === 1 ? 'prekey' : 'whisper',
            body: ciphertext.body,
            registrationId: this.registrationId || 0,
        };
    }

    /**
     * Расшифровка сообщения
     */
    async decryptMessage(
        userId: string,
        deviceId: string,
        encryptedMessage: {
            type: 'prekey' | 'whisper';
            body: string;
            registrationId?: number;
        }
    ): Promise<string> {
        const address = new SignalProtocolAddress(userId, parseInt(deviceId) || 1);
        const sessionCipher = new SessionCipher(this.store, address);

        if (encryptedMessage.type === 'prekey') {
            const plaintext = await sessionCipher.decryptPreKeyWhisperMessage(
                encryptedMessage.body,
                'binary'
            );
            return plaintext;
        } else {
            const plaintext = await sessionCipher.decryptWhisperMessage(
                encryptedMessage.body,
                'binary'
            );
            return plaintext;
        }
    }

    /**
     * Получение prekey bundle для пользователя (multi-device)
     */
    async getPreKeyBundles(userId: string): Promise<PreKeyBundle[]> {
        const encryptionService = new EncryptionService();
        const bundles = await encryptionService.getPreKeyBundle(userId);

        // Конвертируем в формат libsignal
        return bundles.map(bundle => ({
            identityKey: this.deserializeKey(bundle.identityKey),
            registrationId: bundle.registrationId,
            signedPreKey: {
                keyId: bundle.signedPreKey.keyId,
                publicKey: this.deserializeKey(bundle.signedPreKey.publicKey),
                signature: this.deserializeSignature(bundle.signedPreKey.signature),
            },
            preKey: bundle.preKey ? {
                keyId: bundle.preKey.keyId,
                publicKey: this.deserializeKey(bundle.preKey.publicKey),
            } : undefined,
        }));
    }

    // Утилиты для сериализации/десериализации ключей
    private serializeKey(key: Uint8Array): string {
        // В React Native используем base64
        return Buffer.from(key).toString('base64');
    }

    private deserializeKey(keyString: string): Uint8Array {
        return Buffer.from(keyString, 'base64');
    }

    private serializeSignature(sig: Uint8Array): string {
        return Buffer.from(sig).toString('base64');
    }

    private deserializeSignature(sigString: string): Uint8Array {
        return Buffer.from(sigString, 'base64');
    }
}
```

### 5. API Service

```typescript
// services/encryption.service.ts
import { apiClient } from '../api'; // ваш API клиент

export interface RegisterDeviceDto {
    deviceId: string;
    name: string;
    type: 'mobile' | 'web' | 'desktop';
    registrationId: number;
    identityKey: string;
    signedPreKey: string;
    signedPreKeySig: string;
    preKeys: Array<{ keyId: number; publicKey: string }>;
    oneTimePreKeys: Array<{ keyId: number; publicKey: string }>;
}

export interface PreKeyBundleDto {
    deviceId: string;
    identityKey: string;
    signedPreKey: {
        keyId: number;
        publicKey: string;
        signature: string;
    };
    registrationId: number;
    preKey?: {
        keyId: number;
        publicKey: string;
    };
}

export class EncryptionService {
    async registerDevice(dto: RegisterDeviceDto): Promise<void> {
        await apiClient.post('/api/encryption/devices/register', dto);
    }

    async getPreKeyBundle(userId: string): Promise<PreKeyBundleDto[]> {
        const response = await apiClient.get(`/api/encryption/prekey-bundle/${userId}`);
        return response.data;
    }

    async getDevices(): Promise<Array<{ deviceId: string; name: string | null; type: string }>> {
        const response = await apiClient.get('/api/encryption/devices/me');
        return response.data;
    }

    async deleteDevice(deviceId: string): Promise<void> {
        await apiClient.delete(`/api/encryption/devices/${deviceId}`);
    }
}
```

### 6. React Hooks

```typescript
// hooks/useEncryption.ts
import { useEffect, useState } from 'react';
import { SignalProtocolService } from '../services/signal-protocol.service';

export const useEncryption = () => {
    const [signalService, setSignalService] = useState<SignalProtocolService | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const service = new SignalProtocolService();
                await service.initialize();

                // Проверяем, зарегистрировано ли устройство
                const encryptionService = new EncryptionService();
                const devices = await encryptionService.getDevices();
                const deviceId = await DeviceManager.getDeviceId();

                const isRegistered = devices.some(d => d.deviceId === deviceId);

                if (!isRegistered) {
                    await service.registerDevice();
                }

                setSignalService(service);
                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize encryption:', error);
            }
        };

        init();
    }, []);

    return { signalService, isInitialized };
};
```

```typescript
// hooks/useEncryptedMessage.ts
import { useEncryption } from './useEncryption';
import { SignalProtocolService } from '../services/signal-protocol.service';
import { EncryptionService } from '../services/encryption.service';
import { DeviceManager } from '../storage/device-manager';

export const useEncryptedMessage = (chatId: string, recipientId: string) => {
    const { signalService, isInitialized } = useEncryption();

    const encryptMessage = async (content: string): Promise<Array<{
        toDeviceId: string;
        encryptedContent: string;
        messageType: 'prekey' | 'whisper';
        registrationId: number;
    }>> => {
        if (!signalService || !isInitialized) {
            throw new Error('Signal Protocol not initialized');
        }

        // Получаем все устройства получателя
        const bundles = await signalService.getPreKeyBundles(recipientId);

        const encryptedMessages = await Promise.all(
            bundles.map(async (bundle) => {
                // Создаём сессию, если её нет
                try {
                    await signalService.createSession(recipientId, bundle.deviceId, bundle);
                } catch (error) {
                    // Сессия уже существует - это нормально
                }

                // Шифруем сообщение
                const encrypted = await signalService.encryptMessage(
                    recipientId,
                    bundle.deviceId,
                    content
                );

                return {
                    toDeviceId: bundle.deviceId,
                    encryptedContent: encrypted.body,
                    messageType: encrypted.type,
                    registrationId: encrypted.registrationId,
                };
            })
        );

        return encryptedMessages;
    };

    const decryptMessage = async (
        encryptedContent: string,
        senderId: string,
        deviceId: string,
        messageType: 'prekey' | 'whisper',
        registrationId?: number
    ): Promise<string> => {
        if (!signalService || !isInitialized) {
            throw new Error('Signal Protocol not initialized');
        }

        // Получаем prekey bundle для создания сессии (если нужно)
        if (messageType === 'prekey') {
            const encryptionService = new EncryptionService();
            const bundles = await encryptionService.getPreKeyBundle(senderId);
            const bundle = bundles.find(b => b.deviceId === deviceId);

            if (bundle) {
                await signalService.createSession(senderId, deviceId, bundle as any);
            }
        }

        return await signalService.decryptMessage(senderId, deviceId, {
            type: messageType,
            body: encryptedContent,
            registrationId,
        });
    };

    return { encryptMessage, decryptMessage, isInitialized };
};
```

### 7. Интеграция с сообщениями

**Обновление useSendMessage**:

```typescript
// hooks/useSendMessage.ts
import { useEncryptedMessage } from '../encryption/hooks/useEncryptedMessage';
import { DeviceManager } from '../encryption/storage/device-manager';

export const useSendMessage = (chatId: string, recipientId: string) => {
    const { encryptMessage } = useEncryptedMessage(chatId, recipientId);
    const chat = useChat(chatId);
    const isEncrypted = chat?.type === 'SECRET' || chat?.isEncrypted;

    const sendMessage = async (content: string) => {
        if (isEncrypted) {
            // Шифруем для всех устройств получателя
            const encryptedMessages = await encryptMessage(content);

            // Отправляем на все устройства
            await api.messagesCreateEncrypted({
                chatId,
                recipientId,
                encryptedMessages,
            });
        } else {
            // Обычное незашифрованное сообщение
            await api.messagesCreate({
                chatId,
                content,
            });
        }
    };

    return { sendMessage };
};
```

**Обновление useChatMessages**:

```typescript
// hooks/useChatMessages.ts
import { useEncryptedMessage } from '../encryption/hooks/useEncryptedMessage';
import { DeviceManager } from '../encryption/storage/device-manager';

export const useChatMessages = (chatId: string) => {
    const { decryptMessage } = useEncryptedMessage(chatId, senderId);
    const chat = useChat(chatId);
    const isEncrypted = chat?.type === 'SECRET' || chat?.isEncrypted;
    const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

    useEffect(() => {
        DeviceManager.getDeviceId().then(setCurrentDeviceId);
    }, []);

    const messages = useQuery({
        queryKey: ['messages', chatId],
        queryFn: async () => {
            const messages = await api.messagesGetByChatId(chatId);

            if (isEncrypted && currentDeviceId) {
                // Расшифровываем только сообщения для текущего устройства
                return Promise.all(
                    messages.map(async (msg) => {
                        if (msg.isEncrypted && msg.toDeviceId === currentDeviceId) {
                            try {
                                const decrypted = await decryptMessage(
                                    msg.encryptedContent,
                                    msg.senderId,
                                    msg.toDeviceId || '',
                                    msg.messageType || 'whisper',
                                    msg.registrationId
                                );
                                return { ...msg, content: decrypted, decrypted: true };
                            } catch (error) {
                                console.error('Failed to decrypt message:', error);
                                return { ...msg, content: '[Не удалось расшифровать]', decrypted: false };
                            }
                        }
                        return msg;
                    })
                );
            }

            return messages;
        }
    });

    return messages;
};
```

### 8. UI компоненты

**EncryptionStatus**:

```typescript
// components/EncryptionStatus.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native'; // или другая иконка

export const EncryptionStatus = ({ chatId }: { chatId: string }) => {
    const { isEncrypted, encryptionStatus } = useEncryption(chatId);

    if (!isEncrypted) return null;

    return (
        <View style={styles.container}>
            <Lock size={12} color="#666" />
            <Text style={styles.text}>
                {encryptionStatus === 'verified' && 'Зашифровано и проверено'}
                {encryptionStatus === 'unverified' && 'Зашифровано (не проверено)'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    text: {
        fontSize: 12,
        color: '#666',
    },
});
```

## Задачи

### Этап 1: Установка и базовая инфраструктура

- [ ] Установить `@privacyresearch/libsignal-protocol-typescript`
- [ ] Установить `expo-secure-store` или `react-native-encrypted-storage`
- [ ] Установить `uuid` и `@react-native-async-storage/async-storage`
- [ ] Установить `react-native-get-random-values` (если нужно)
- [ ] Создать модуль `encryption` с базовой структурой
- [ ] Реализовать `DeviceManager` для управления deviceId
- [ ] Реализовать `SecureStorage` обёртку
- [ ] Реализовать `SignalStore` для хранения ключей

### Этап 2: Signal Protocol

- [ ] Реализовать `SignalProtocolService` (обёртка над libsignal)
- [ ] Реализовать регистрацию устройства на сервере
- [ ] Реализовать создание сессий (X3DH)
- [ ] Реализовать шифрование/расшифровку сообщений
- [ ] Реализовать поддержку multi-device (шифрование для всех устройств)

### Этап 3: Интеграция с чатами

- [ ] Интегрировать шифрование в `useSendMessage`
- [ ] Интегрировать расшифровку в `useChatMessages`
- [ ] Обновить WebSocket для работы с зашифрованными сообщениями
- [ ] Добавить UI индикаторы шифрования
- [ ] Реализовать отправку на все устройства получателя

### Этап 4: Интеграция с звонками

- [ ] Настроить E2EE в LiveKit
- [ ] Реализовать E2EEKeyProvider
- [ ] Протестировать зашифрованные звонки

### Этап 5: Безопасность

- [ ] Реализовать верификацию ключей (fingerprint)
- [ ] Реализовать forward secrecy
- [ ] Реализовать post-compromise security
- [ ] Добавить защиту от MITM атак
- [ ] Реализовать автоматическую ротацию ключей

### Этап 6: Тестирование

- [ ] Unit тесты для криптографических функций
- [ ] Integration тесты для обмена ключами
- [ ] E2E тесты для зашифрованных чатов и звонков
- [ ] Тесты multi-device сценариев

## Файлы для работы

### Создать

- `src/modules/encryption/` - новый модуль
- `src/modules/encryption/storage/device-manager.ts`
- `src/modules/encryption/storage/secure-storage.ts`
- `src/modules/encryption/storage/signal-store.ts`
- `src/modules/encryption/services/signal-protocol.service.ts`
- `src/modules/encryption/services/encryption.service.ts`
- `src/modules/encryption/hooks/useEncryption.ts`
- `src/modules/encryption/hooks/useEncryptedMessage.ts`
- `src/modules/encryption/hooks/useDevice.ts`
- `src/modules/encryption/components/EncryptionStatus.tsx`

### Обновить

- `src/modules/messages/hooks/useSendMessage.ts`
- `src/modules/messages/hooks/useChatMessages.ts`
- `src/modules/call/hooks/useLiveKitCall.ts`

## Связанные задачи

- [Backend задача по сквозному шифрованию](../../backend/tasks/end-to-end-encryption.md) - связанная backend задача
- [Next.js Frontend задача по сквозному шифрованию](./end-to-end-encryption.md) - связанная Next.js задача

## Примечания

- **Сообщения видны только на том устройстве, на котором они были расшифрованы**
- **НЕЛЬЗЯ хранить приватные ключи в AsyncStorage** - только в Secure Storage
- Использовать проверенные криптографические библиотеки
- Не изобретать собственные криптографические алгоритмы
- Следовать принципам Signal Protocol
- Обеспечить совместимость с существующими чатами (постепенное внедрение)
- Тестировать на разных устройствах (iOS и Android)
- **deviceId генерируется клиентом и хранится в AsyncStorage (это не секрет)**
- **Приватные ключи хранятся в Secure Storage**
- **Каждое устройство имеет свой набор ключей**
- **При потере устройства все сессии с этим устройством становятся недействительными**

## Production Checklist

- [ ] HTTPS only для всех API запросов
- [ ] WSS only для WebSocket
- [ ] Secure Storage для приватных ключей (НЕ AsyncStorage)
- [ ] AsyncStorage только для несекретных данных (deviceId, deviceName)
- [ ] Автоматическая ротация signed prekeys
- [ ] Мониторинг количества one-time prekeys
- [ ] Уведомление пользователей о новых устройствах
- [ ] Предупреждение при удалении устройства
- [ ] Backup ключей (опционально, через encrypted backup)
- [ ] Тестирование на iOS и Android

## Дополнительные зависимости (опционально)

Если нужна дополнительная информация об устройстве:

```bash
npm install react-native-device-info
```

Для работы с Buffer в React Native (если libsignal требует):

```bash
npm install buffer
```

В `index.js` или `App.tsx`:

```typescript
import { Buffer } from 'buffer';
global.Buffer = Buffer;
```
