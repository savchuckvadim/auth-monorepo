// useCall.ts
'use client';
import { useCallMedia } from './call-media.hook';
import { useCallControls } from './call-controls.hook';
import { useCallEngine } from './call-engine.hook';
import { useState, useEffect } from 'react';
import { ensurePeerConnection } from '../utils/ensure-peer-connection';
import { logger } from '@/modules/shared';
import { useAuth } from '@/modules/processes';

export const useCall = (chatId: string, otherUserId: string, type: 'VIDEO' | 'AUDIO') => {
    const [saveHistory, setSaveHistory] = useState(false);
    const { currentUser } = useAuth();
    const media = useCallMedia();
    const engine = useCallEngine(chatId, otherUserId, type, media);
    const controls = useCallControls(engine.peerService);

    // Устанавливаем userId для logger
    useEffect(() => {
        if (currentUser?.id) {
            logger.setUserId(currentUser.id);
        }
    }, [currentUser?.id]);

    const handleCallUser = async (t: 'VIDEO' | 'AUDIO') => {
        logger.log('📞 [HANDLE CALL USER] Initiating call', {
            type: t,
            chatId,
            otherUserId,
            hasPeer: !!engine.peerService.connection
        });

        // ВАЖНО: Всегда пересоздаем peer connection для нового звонка
        console.log('🔄 [HANDLE CALL USER] Recreating peer connection');
        engine.peerService.recreate();
        console.log('✅ [HANDLE CALL USER] Peer connection recreated', {
            hasPeer: !!engine.peerService.connection
        });

        console.log('🎥 [HANDLE CALL USER] Getting media stream', { type: t });
        const stream = await media.getMedia(t);
        console.log('✅ [HANDLE CALL USER] Media stream obtained', {
            streamId: stream.id,
            hasVideo: stream.getVideoTracks().length > 0,
            hasAudio: stream.getAudioTracks().length > 0,
            videoTracks: stream.getVideoTracks().length,
            audioTracks: stream.getAudioTracks().length
        });

        // ВАЖНО: Используем возвращенный stream напрямую, а не media.myStream
        // потому что setMyStream асинхронный (useState) и состояние может еще не обновиться
        // getMedia уже вызывает setMyStream внутри, стрим будет сохранен
        // Также stream будет сохранен в ref в callUser для надежного доступа
        console.log('💾 [HANDLE CALL USER] Stream will be saved by getMedia (useState is async) and in ref in callUser');

        console.log('🎵 [HANDLE CALL USER] Adding tracks to peer connection', {
            tracksCount: stream.getTracks().length
        });
        stream.getTracks().forEach((track, index) => {
            console.log(`➕ [HANDLE CALL USER] Adding track ${index + 1}`, {
                trackId: track.id,
                trackKind: track.kind,
                trackEnabled: track.enabled,
                trackReadyState: track.readyState
            });
            engine.peerService.addTrack(track, stream);
        });

        console.log('✅ [HANDLE CALL USER] All tracks added', {
            totalSenders: engine.peerService.connection?.getSenders().length || 0
        });

        console.log('📝 [HANDLE CALL USER] Creating offer');
        const offer = await engine.peerService.getOffer();
        console.log('✅ [HANDLE CALL USER] Offer created', {
            offerType: offer.type,
            hasSdp: !!offer.sdp,
            signalingState: engine.peerService.connection?.signalingState,
            sendersCount: engine.peerService.connection?.getSenders().length || 0,
            // Проверяем, что треки включены в SDP
            sdpContainsAudio: offer.sdp?.includes('m=audio') || false,
            sdpContainsVideo: offer.sdp?.includes('m=video') || false,
            sdpLength: offer.sdp?.length || 0
        });

        console.log('📤 [HANDLE CALL USER] Sending call via callUser');
        await engine.callUser(offer, t);
        console.log('✅ [HANDLE CALL USER] Call initiated');
    };


    const handleSaveHistory = () => {
        // TODO: Реализовать сохранение истории в localStorage
        console.log('Saving chat history...', { chatId, saveHistory });
        setSaveHistory(!saveHistory);
    };

    // Логирование возвращаемых значений для отладки
    useEffect(() => {
        console.log('🔄 [USE CALL] Hook state changed', {
            isInCall: engine.isInCall,
            callType: engine.callType,
            hasMyStream: !!media.myStream,
            hasRemoteStream: !!media.remoteStream,
            myStreamId: media.myStream?.id,
            remoteStreamId: media.remoteStream?.id
        });
    }, [engine.isInCall, engine.callType, media.myStream, media.remoteStream]);

    // Явно деструктурируем значения из engine, чтобы React мог отслеживать изменения
    const {
        peerService,
        callUser: engineCallUser,
        endCall,
        isInCall,
        callButton,
        callType,
        isIncomingCall,
        acceptCall,
        rejectCall,
    } = engine;

    return {
        ...media,

        // Явно возвращаем значения из engine, чтобы React мог отслеживать изменения
        peerService,
        callUser: engineCallUser,
        endCall,
        isInCall,
        callButton,
        callType,
        isIncomingCall,
        acceptCall,
        rejectCall,

        isAudioMute: controls.isAudioMute,
        isVideoOnHold: controls.isVideoOnHold,
        setIsAudioMute: controls.setIsAudioMute,
        setIsVideoOnHold: controls.setIsVideoOnHold,

        handleToggleAudio: controls.toggleAudio,
        handleToggleVideo: controls.toggleVideo,

        handleEndCall: endCall,
        handleSaveHistory,
        handleCallUser,

    };
};
