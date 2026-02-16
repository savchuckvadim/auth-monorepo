/**
 * Утилита для шифрования данных на фронтенде
 * Использует Web Crypto API с AES-GCM
 */

const getKey = async (): Promise<CryptoKey> => {
    // Используем ключ из переменной окружения или дефолтный
    const keyString = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-encryption-key-32-chars!!';

    // Конвертируем строку в ArrayBuffer
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keyString);

    // Используем SHA-256 для получения 32-байтового (256-битного) ключа
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);

    // Импортируем ключ (256 бит = 32 байта)
    return await crypto.subtle.importKey(
        'raw',
        hashBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
};

/**
 * Шифрует текст
 */
export const encrypt = async (text: string): Promise<string> => {
    try {
        const key = await getKey();
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        // Генерируем случайный IV (96 бит для AES-GCM)
        const iv = crypto.getRandomValues(new Uint8Array(12));

        // Шифруем
        const encrypted = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            data
        );

        // Конвертируем в base64 для передачи
        const encryptedArray = new Uint8Array(encrypted);
        const encryptedBase64 = btoa(String.fromCharCode(...encryptedArray));
        const ivBase64 = btoa(String.fromCharCode(...iv));

        // Возвращаем в формате iv:encrypted
        return `${ivBase64}:${encryptedBase64}`;
    } catch (error) {
        console.error('Encryption error:', error);
        throw error;
    }
};

/**
 * Расшифровывает текст
 */
export const decrypt = async (encryptedText: string): Promise<string> => {
    try {
        const key = await getKey();
        const [ivBase64, encryptedBase64] = encryptedText.split(':');

        if (!ivBase64 || !encryptedBase64) {
            throw new Error('Invalid encrypted text format');
        }

        // Декодируем из base64
        const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
        const encrypted = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

        // Расшифровываем
        const decrypted = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            encrypted
        );

        // Конвертируем в строку
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (error) {
        console.error('Decryption error:', error);
        throw error;
    }
};

