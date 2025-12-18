import { WEBRTC_CONFIG } from './webrtc.config';

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
        await this.peer.setRemoteDescription(new RTCSessionDescription(description));
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

        const offer = await this.peer.createOffer();
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

        // Также переключаем локальные треки
        const localStreams = this.peer.getLocalStreams();
        if (localStreams.length > 0) {
            const audioTracks = localStreams[0].getAudioTracks();
            audioTracks.forEach((track) => {
                track.enabled = !track.enabled;
            });
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

