// useCallMedia.ts
import { useCallback, useEffect, useState } from 'react';

export const useCallMedia = () => {
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        console.log('📹 [CALL MEDIA] myStream changed', {
            streamId: myStream?.id,
            hasStream: !!myStream,
            videoTracks: myStream?.getVideoTracks().length || 0,
            audioTracks: myStream?.getAudioTracks().length || 0,
            active: myStream?.active
        });
    }, [myStream]);

    useEffect(() => {
        console.log('📹 [CALL MEDIA] remoteStream changed', {
            streamId: remoteStream?.id,
            hasStream: !!remoteStream,
            videoTracks: remoteStream?.getVideoTracks().length || 0,
            audioTracks: remoteStream?.getAudioTracks().length || 0,
            active: remoteStream?.active
        });
    }, [remoteStream]);



    const getMedia = useCallback(async (type: 'VIDEO' | 'AUDIO') => {
        console.log('🎥 [GET MEDIA] Requesting media', { type });

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: type === 'VIDEO',
            });

            console.log('✅ [GET MEDIA] Media obtained', {
                streamId: stream.id,
                hasVideo: stream.getVideoTracks().length > 0,
                hasAudio: stream.getAudioTracks().length > 0,
                videoTracks: stream.getVideoTracks().length,
                audioTracks: stream.getAudioTracks().length
            });

            console.log('💾 [GET MEDIA] Saving stream to myStream');
            setMyStream(stream);

            console.log('✅ [GET MEDIA] Stream saved', {
                myStreamId: stream.id
            });

            return stream;
        } catch (error) {
            console.error('❌ [GET MEDIA] Error getting media:', error);
            throw error;
        }
    }, []);

    const stopMyStream = useCallback(() => {
        console.log('🛑 [STOP MY STREAM] Stopping stream', {
            hasStream: !!myStream,
            streamId: myStream?.id
        });

        if (!myStream) {
            console.log('⚠️ [STOP MY STREAM] No stream to stop');
            return;
        }

        myStream.getTracks().forEach((t, index) => {
            console.log(`🛑 [STOP MY STREAM] Stopping track ${index + 1}`, {
                trackId: t.id,
                trackKind: t.kind,
                trackState: t.readyState
            });
            t.stop();
        });

        setMyStream(null);
        console.log('✅ [STOP MY STREAM] Stream stopped and cleared');
    }, [myStream]);

    return {
        myStream,
        remoteStream,
        setRemoteStream,
        getMedia,
        setMyStream,
        stopMyStream,
    };
};
