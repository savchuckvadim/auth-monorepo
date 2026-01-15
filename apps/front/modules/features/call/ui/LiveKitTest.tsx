import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'https://livekit.sociopath-network.ru';
export const VideoCall = ({ token }: { token: string }) => {
    return (
        <div className="h-screen">
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={LIVEKIT_URL} // URL вашего сервиса LiveKit в Dockploy
                connect={true}
            >
                {/* Это готовый UI с сеткой видео, чатом и кнопками управления */}
                <VideoConference />
                {/* Обязательно для звука */}
                <RoomAudioRenderer />
            </LiveKitRoom>
        </div>
    );
};
