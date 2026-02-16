// useCallControls.ts
import { useState } from 'react';
import { PeerService } from '@/modules/shared';

export const useCallControls = (peerService: PeerService) => {
    const [isAudioMute, setIsAudioMute] = useState(false);
    const [isVideoOnHold, setIsVideoOnHold] = useState(false);



    const toggleAudio = () => {
        peerService.toggleAudio();
        setIsAudioMute(v => !v);
    };

    const toggleVideo = () => {
        peerService.toggleVideo();
        setIsVideoOnHold(v => !v);
    };


    return {
        isAudioMute,
        isVideoOnHold,
        setIsAudioMute,
        setIsVideoOnHold,
        toggleAudio,
        toggleVideo,
    };
};
