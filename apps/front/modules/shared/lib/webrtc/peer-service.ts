import { WEBRTC_CONFIG } from './webrtc.config';
import { logger } from '../utils/logger';

/**
 * Сервис для управления WebRTC Peer Connection
 * Инкапсулирует логику работы с RTCPeerConnection
 */
export class PeerService {
    private peer: RTCPeerConnection | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.peer = new RTCPeerConnection(WEBRTC_CONFIG);
        }
    }

    get connection(): RTCPeerConnection | null {
        return this.peer;
    }

    /**
     * Устанавливает remote description (answer от другого пира)
     */
    async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
        if (!this.peer) {
            throw new Error('Peer connection not initialized');
        }

        // Проверяем состояние signaling перед установкой
        const signalingState = this.peer.signalingState;
        const hasRemoteDesc = !!this.peer.remoteDescription;

        // Если уже в stable и есть remote description, нельзя устанавливать снова
        if (signalingState === 'stable' && hasRemoteDesc) {
            console.warn('⚠️ [PEER SERVICE] Cannot set remote description: already in stable state with remote description', {
                signalingState,
                remoteDescriptionType: this.peer.remoteDescription?.type,
                newDescriptionType: description.type
            });
            return; // Просто возвращаемся без ошибки
        }

        // Если состояние stable, но нет remote description, это тоже проблема
        // (для answer нужно состояние "have-local-offer")
        if (signalingState === 'stable' && !hasRemoteDesc && description.type === 'answer') {
            console.warn('⚠️ [PEER SERVICE] Cannot set answer in stable state without remote description', {
                signalingState,
                descriptionType: description.type
            });
            return;
        }

        try {
            await this.peer.setRemoteDescription(new RTCSessionDescription(description));
        } catch (error: any) {
            // Если ошибка связана с неправильным состоянием, логируем и пробрасываем
            if (error.name === 'InvalidStateError') {
                console.error('❌ [PEER SERVICE] InvalidStateError setting remote description', {
                    signalingState,
                    hasRemoteDesc,
                    descriptionType: description.type,
                    error: error.message
                });
            }
            throw error;
        }
    }

    /**
     * Создает answer на основе полученного offer
     */
    async getAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
        if (!this.peer) {
            throw new Error('Peer connection not initialized');
        }

        await this.peer.setRemoteDescription(offer);
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(answer));
        return answer;
    }

    /**
     * Создает offer для инициации звонка
     */
    async getOffer(): Promise<RTCSessionDescriptionInit> {
        if (!this.peer) {
            throw new Error('Peer connection not initialized');
        }

        // ВАЖНО: Проверяем, что треки добавлены перед созданием offer
        const senders = this.peer.getSenders();
        logger.log('📝 [PEER SERVICE] Creating offer', {
            sendersCount: senders.length,
            senders: senders.map(s => ({
                trackId: s.track?.id,
                trackKind: s.track?.kind,
                trackEnabled: s.track?.enabled
            }))
        });

        const offer = await this.peer.createOffer();

        // ВАЖНО: Проверяем, что треки включены в SDP
        logger.log('📝 [PEER SERVICE] Offer created', {
            offerType: offer.type,
            hasSdp: !!offer.sdp,
            sdpLength: offer.sdp?.length || 0,
            sdpContainsAudio: offer.sdp?.includes('m=audio') || false,
            sdpContainsVideo: offer.sdp?.includes('m=video') || false,
            audioLineCount: (offer.sdp?.match(/m=audio/g) || []).length,
            videoLineCount: (offer.sdp?.match(/m=video/g) || []).length
        });

        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
    }

    /**
     * Переключает аудио (включить/выключить микрофон)
     */
    toggleAudio(): void {
        if (!this.peer) return;

        const audioSender = this.peer.getSenders().find(
            (sender) => sender.track?.kind === 'audio'
        );

        if (audioSender?.track) {
            audioSender.track.enabled = !audioSender.track.enabled;
        }
    }

    /**
     * Переключает видео (включить/выключить камеру)
     */
    toggleVideo(): void {
        if (!this.peer) return;

        const videoSender = this.peer.getSenders().find(
            (sender) => sender.track?.kind === 'video'
        );

        if (videoSender?.track) {
            videoSender.track.enabled = !videoSender.track.enabled;
        }
    }

    /**
     * Добавляет медиа трек в peer connection
     */
    addTrack(track: MediaStreamTrack, stream: MediaStream): void {
        if (this.peer) {
            this.peer.addTrack(track, stream);
        }
    }

    /**
     * Закрывает peer connection
     */
    close(): void {
        if (this.peer) {
            this.peer.close();
            this.peer = null;
        }
    }

    /**
     * Пересоздает peer connection
     */
    recreate(): void {
        this.close();
        if (typeof window !== 'undefined') {
            this.peer = new RTCPeerConnection(WEBRTC_CONFIG);
        }
    }

    /**
     * Проверяет, включен ли аудио
     */
    isAudioEnabled(): boolean {
        if (!this.peer) return false;
        const audioSender = this.peer.getSenders().find(
            (sender) => sender.track?.kind === 'audio'
        );
        return audioSender?.track?.enabled ?? false;
    }

    /**
     * Проверяет, включено ли видео
     */
    isVideoEnabled(): boolean {
        if (!this.peer) return false;
        const videoSender = this.peer.getSenders().find(
            (sender) => sender.track?.kind === 'video'
        );
        return videoSender?.track?.enabled ?? false;
    }
}

