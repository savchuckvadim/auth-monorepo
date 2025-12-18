'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@workspace/ui/components/card';

interface VideoPlayerProps {
    stream: MediaStream | null;
    name: string;
    isAudioMute?: boolean;
    className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    stream,
    name,
    isAudioMute = false,
    className = '',
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <Card className={`relative overflow-hidden ${className}`}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isAudioMute}
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {name}
            </div>
        </Card>
    );
};

