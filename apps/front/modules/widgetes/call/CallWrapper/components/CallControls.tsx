'use client';

import { Button } from '@workspace/ui/components/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Save } from 'lucide-react';

interface CallControlsProps {
    isAudioMute: boolean;
    isVideoOnHold: boolean;
    onToggleAudio: () => void;
    onToggleVideo: () => void;
    onEndCall: () => void;
    onSaveHistory?: () => void;
    showSaveButton?: boolean;
}

export const CallControls: React.FC<CallControlsProps> = ({
    isAudioMute,
    isVideoOnHold,
    onToggleAudio,
    onToggleVideo,
    onEndCall,
    onSaveHistory,
    showSaveButton = false,
}) => {
    return (
        <div className="flex items-center justify-center gap-4 p-4 bg-background/80 backdrop-blur-sm rounded-lg">
            <Button
                variant={isAudioMute ? 'destructive' : 'default'}
                size="icon"
                onClick={onToggleAudio}
                title={isAudioMute ? 'Включить микрофон' : 'Выключить микрофон'}
            >
                {isAudioMute ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
                variant={isVideoOnHold ? 'destructive' : 'default'}
                size="icon"
                onClick={onToggleVideo}
                title={isVideoOnHold ? 'Включить камеру' : 'Выключить камеру'}
            >
                {isVideoOnHold ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>

            {showSaveButton && onSaveHistory && (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onSaveHistory}
                    title="Сохранить историю чата"
                >
                    <Save className="h-5 w-5" />
                </Button>
            )}

            <Button
                variant="destructive"
                size="icon"
                onClick={onEndCall}
                title="Завершить звонок"
            >
                <PhoneOff className="h-5 w-5" />
            </Button>
        </div>
    );
};

