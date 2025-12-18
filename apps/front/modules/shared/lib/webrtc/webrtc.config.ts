/**
 * WebRTC конфигурация для секретных чатов
 * Использует публичные STUN серверы для NAT traversal
 */
export const WEBRTC_CONFIG: RTCConfiguration = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:global.stun.twilio.com:3478',
            ],
        },
    ],
};

