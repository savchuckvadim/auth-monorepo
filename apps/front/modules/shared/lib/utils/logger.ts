'use client';

import { getTelegram, TelegramSendMessageDtoApp } from '@workspace/nest-api';

/**
 * Логгер с поддержкой Telegram и консольного логирования
 *
 * Управление через переменные окружения:
 * - NEXT_PUBLIC_ENABLE_LOGS=false - отключить все логи (по умолчанию включено)
 * - NEXT_PUBLIC_ENABLE_TELEGRAM_LOGS=true - включить отправку в Telegram (по умолчанию выключено)
 */
class Logger {
    private logsEnabled: boolean;
    private telegramEnabled: boolean;
    private app: TelegramSendMessageDtoApp = 'konstruktor';
    private domain: string;
    private userId: string | null = null;
    private deviceInfo: string;

    constructor() {
        // Проверяем, включены ли логи вообще
        if (typeof window === 'undefined') {
            this.logsEnabled = false;
            this.telegramEnabled = false;
        } else {
            const logsEnv = process.env.NEXT_PUBLIC_ENABLE_LOGS || "true";
            // По умолчанию логи включены, отключаются только если явно установлено 'false'
            this.logsEnabled = logsEnv !== 'false';

            const telegramEnv = process.env.NEXT_PUBLIC_ENABLE_TELEGRAM_LOGS || "true";
            // По умолчанию Telegram выключен, включается только если явно установлено 'true'
            this.telegramEnabled = telegramEnv === 'true';
        }

        // Определяем домен
        this.domain = typeof window !== 'undefined'
            ? window.location.hostname
            : 'unknown';

        // Определяем информацию об устройстве
        if (typeof window !== 'undefined') {
            const ua = navigator.userAgent;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
            const isIOS = /iPhone|iPad|iPod/i.test(ua);
            const isAndroid = /Android/i.test(ua);

            let deviceType = 'Desktop';
            if (isIOS) deviceType = 'iOS';
            else if (isAndroid) deviceType = 'Android';
            else if (isMobile) deviceType = 'Mobile';

            const screenInfo = typeof window.screen !== 'undefined'
                ? `${window.screen.width}x${window.screen.height}`
                : 'unknown';

            this.deviceInfo = `${deviceType} | ${screenInfo} | ${ua.substring(0, 50)}...`;
        } else {
            this.deviceInfo = 'Server';
        }
    }

    /**
     * Устанавливает userId для логирования
     */
    setUserId(userId: string | null) {
        this.userId = userId;
    }

    /**
     * Включает/выключает Telegram логирование программно
     */
    setTelegramEnabled(enabled: boolean) {
        this.telegramEnabled = enabled && this.logsEnabled;
    }

    /**
     * Включает/выключает все логи программно
     */
    setLogsEnabled(enabled: boolean) {
        this.logsEnabled = enabled;
        if (!enabled) {
            this.telegramEnabled = false;
        }
    }

    /**
     * Отправляет лог
     */
    private async sendLog(level: string, message: string, data?: any) {
        // Если логи полностью отключены - ничего не делаем
        if (!this.logsEnabled) {
            return;
        }

        // Всегда логируем в консоль (если логи включены)
        const consoleMethod = level === 'ERROR' ? console.error :
            level === 'WARN' ? console.warn :
                console.log;
        consoleMethod(`[${level}]`, message, data || '');

        // Если Telegram включен - отправляем туда
        if (this.telegramEnabled) {
            // Отправляем асинхронно, чтобы не блокировать выполнение
            (async () => {
                try {
                    const text = this.formatLogMessage(level, message, data);

                    const { telegramGetTelegram } = getTelegram();
                    await telegramGetTelegram({
                        app: this.app,
                        text,
                        domain: this.domain,
                        userId: this.userId || 'anonymous',
                    });
                } catch (error) {
                    // В случае ошибки отправки в Telegram, только логируем в консоль
                    console.error('Failed to send log to Telegram:', error);
                }
            })();
        }
    }

    /**
     * Форматирует сообщение для Telegram
     */
    private formatLogMessage(level: string, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const userIdPart = this.userId ? `👤 User: ${this.userId}\n` : '';
        const devicePart = `📱 Device: ${this.deviceInfo}\n`;
        const levelPart = this.getLevelEmoji(level);
        const messagePart = `💬 ${message}`;

        let dataPart = '';
        if (data) {
            try {
                // Ограничиваем размер данных для Telegram (макс 4096 символов)
                const dataStr = JSON.stringify(data, null, 2);
                const maxLength = 2000; // Оставляем место для остального текста
                dataPart = dataStr.length > maxLength
                    ? `\n📊 Data: ${dataStr.substring(0, maxLength)}... (truncated)`
                    : `\n📊 Data: ${dataStr}`;
            } catch (e) {
                dataPart = `\n📊 Data: [Unable to stringify]`;
            }
        }

        return `${levelPart} [${level}] ${timestamp}\n${userIdPart}${devicePart}${messagePart}${dataPart}`;
    }

    /**
     * Возвращает эмодзи для уровня логирования
     */
    private getLevelEmoji(level: string): string {
        switch (level) {
            case 'INFO': return 'ℹ️';
            case 'WARN': return '⚠️';
            case 'ERROR': return '❌';
            case 'DEBUG': return '🔍';
            default: return '📝';
        }
    }

    /**
     * Логирование уровня INFO
     */
    log(message: string, data?: any) {
        this.sendLog('INFO', message, data);
    }

    /**
     * Логирование уровня WARN
     */
    warn(message: string, data?: any) {
        this.sendLog('WARN', message, data);
    }

    /**
     * Логирование уровня ERROR
     */
    error(message: string, data?: any) {
        this.sendLog('ERROR', message, data);
    }

    /**
     * Логирование уровня DEBUG
     */
    debug(message: string, data?: any) {
        this.sendLog('DEBUG', message, data);
    }
}

// Создаем singleton экземпляр
export const logger = new Logger();

// Экспортируем также как telegramLogger для обратной совместимости
export const telegramLogger = logger;
