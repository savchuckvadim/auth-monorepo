// useCallEngine.ts
'use client';
import {
    CallAcceptedData,
    CallEndData,
    CallInitiatedData,
    IncomingCallData,
    PeerNegoDoneData,
    PeerNegoNeededData,
} from '@/modules/features/secret-chat/lib/types/webrtc.types';
import { connectCallsSocket, PeerService } from '@/modules/shared';
import { useAuth } from '@/modules/processes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ensurePeerConnection } from '../utils/ensure-peer-connection';

export const useCallEngine = (
    chatId: string,
    otherUserId: string,
    defaultType: 'VIDEO' | 'AUDIO',
    media: {
        myStream: MediaStream | null;
        getMedia: (type: 'VIDEO' | 'AUDIO') => Promise<MediaStream>;
        setMyStream: (s: MediaStream | null) => void;
        setRemoteStream: (s: MediaStream | null) => void;
        stopMyStream: () => void;
    }
) => {
    const { currentUser } = useAuth();
    const [peerService] = useState(() => new PeerService());
    const [socket, setSocket] = useState<any>(null);

    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);


    const [callType, setCallType] = useState(defaultType);
    const [isInCall, setIsInCall] = useState(false);
    const [callButton, setCallButton] = useState(true);
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [incomingCallData, setIncomingCallData] = useState<IncomingCallData | null>(null);
    const isProcessingIncomingCallRef = useRef(false);
    const processedAnswerRef = useRef<string | null>(null); // Для защиты от повторной обработки answer
    const processedIncomingCallRef = useRef<string | null>(null); // Для защиты от повторной обработки incoming call
    const iceCandidateBufferRef = useRef<RTCIceCandidateInit[]>([]); // Буфер для ICE candidates, которые пришли до установки remote description
    const remoteStreamRef = useRef<MediaStream | null>(null); // Для сбора всех remote треков в один стрим

    // ---------- socket init ----------
    useEffect(() => {
        if (!currentUser?.id) {
            console.log('⚠️ [SOCKET INIT] No current user');
            return;
        }

        console.log('🔌 [SOCKET INIT] Connecting to calls socket', {
            userId: currentUser.id,
            chatId,
            otherUserId
        });

        const s = connectCallsSocket(currentUser.id);
        setSocket(s);

        console.log('📤 [SOCKET INIT] Joining room', { chatId });
        s.emit('room:join', { chatId }, (res: any) => {
            console.log('✅ [SOCKET INIT] Room join response', {
                users: res?.users?.length || 0,
                response: res
            });

            const u = res?.users?.find((u: any) => u.userId === otherUserId);
            if (u?.socketId) {
                console.log('✅ [SOCKET INIT] Found other user socket', {
                    userId: otherUserId,
                    socketId: u.socketId
                });
                setRemoteSocketId(u.socketId);
            } else {
                console.log('⚠️ [SOCKET INIT] Other user not in room yet', {
                    userId: otherUserId
                });
            }
        });

        const joined = (d: any) => {
            console.log('👤 [SOCKET INIT] User joined', {
                userId: d.userId,
                socketId: d.socketId,
                isOtherUser: d.userId === otherUserId
            });

            if (d.userId === otherUserId) {
                console.log('✅ [SOCKET INIT] Setting remoteSocketId', { socketId: d.socketId });
                setRemoteSocketId(d.socketId);
            }
        };

        s.on('user:joined', joined);

        return () => {
            console.log('🧹 [SOCKET INIT] Cleaning up socket', { chatId });
            s.off('user:joined', joined);
            s.emit('room:leave', { chatId });
        };
    }, [currentUser?.id, chatId, otherUserId]);

    // ---------- incoming call ----------
    const onIncomingCall = useCallback(({ from, fromUserId, offer, type }: IncomingCallData) => {
        // Создаем уникальный идентификатор для этого входящего звонка
        const incomingCallId = `${from}-${offer.sdp?.substring(0, 50) || 'no-sdp'}`;

        console.log('📞 [INCOMING CALL] Received incoming call', {
            from,
            fromUserId,
            type,
            otherUserId,
            hasSocket: !!socket,
            isProcessing: isProcessingIncomingCallRef.current,
            isInCall,
            isIncomingCall,
            incomingCallId,
            alreadyProcessed: processedIncomingCallRef.current === incomingCallId
        });

        // Защита от повторной обработки того же звонка
        if (processedIncomingCallRef.current === incomingCallId) {
            console.log('⚠️ [INCOMING CALL] Already processed, skipping');
            return;
        }

        // Защита от множественных вызовов
        if (isProcessingIncomingCallRef.current || isInCall || isIncomingCall) {
            console.log('⚠️ [INCOMING CALL] Already processing/in call, ignoring duplicate');
            return;
        }

        // Помечаем как обработанный
        processedIncomingCallRef.current = incomingCallId;

        if (!socket) {
            console.log('❌ [INCOMING CALL] Rejected - no socket');
            return;
        }

        // Если otherUserId еще не установлен, но fromUserId совпадает с ожидаемым, принимаем звонок
        // Это может произойти, если событие пришло до того, как otherUserId был установлен
        if (otherUserId && fromUserId !== otherUserId) {
            console.log('❌ [INCOMING CALL] Rejected - wrong user', {
                fromUserId,
                otherUserId
            });
            return;
        }

        // Если otherUserId пустой, но это первый входящий звонок, принимаем его
        // (это может быть нормально, если событие пришло раньше установки otherUserId)
        if (!otherUserId) {
            console.log('⚠️ [INCOMING CALL] otherUserId not set yet, but accepting call anyway', {
                fromUserId
            });
        }

        // Сохраняем данные входящего звонка и показываем UI для принятия
        console.log('📥 [INCOMING CALL] Saving incoming call data, waiting for user to accept');
        setIncomingCallData({
            from,
            fromUserId,
            offer,
            type,
            callId: '', // Может быть пустым, если не передается
            chatId
        });
        setIsIncomingCall(true);
        setRemoteSocketId(from);
        setCallType(type);
    }, [socket, otherUserId, isInCall, isIncomingCall, chatId]);

    // Функция для принятия звонка
    const acceptCall = useCallback(async () => {
        console.log('📞 [ACCEPT CALL] acceptCall called', {
            hasIncomingCallData: !!incomingCallData,
            hasSocket: !!socket,
            incomingCallData: incomingCallData ? {
                from: incomingCallData.from,
                fromUserId: incomingCallData.fromUserId,
                type: incomingCallData.type,
                hasOffer: !!incomingCallData.offer
            } : null
        });

        if (!incomingCallData || !socket) {
            console.error('❌ [ACCEPT CALL] No incoming call data or socket', {
                hasIncomingCallData: !!incomingCallData,
                hasSocket: !!socket
            });
            return;
        }

        const { from, fromUserId, offer, type } = incomingCallData;
        console.log('✅ [ACCEPT CALL] Incoming call data extracted', {
            from,
            fromUserId,
            type,
            hasOffer: !!offer,
            offerType: offer?.type
        });

        if (isProcessingIncomingCallRef.current) {
            console.log('⚠️ [ACCEPT CALL] Already processing');
            return;
        }

        isProcessingIncomingCallRef.current = true;
        setIsIncomingCall(false);

        // Сбрасываем флаги обработанных событий для нового звонка
        processedAnswerRef.current = null;
        processedIncomingCallRef.current = null;
        iceCandidateBufferRef.current = []; // Очищаем буфер ICE candidates

        console.log('🔄 [ACCEPT CALL] Recreating peer connection');
        peerService.recreate();
        setRemoteSocketId(from);
        setCallType(type);

        // ВАЖНО: Останавливаем предыдущий стрим перед получением нового
        console.log('🛑 [ACCEPT CALL] Stopping previous stream if exists');
        media.stopMyStream();

        console.log('🎥 [ACCEPT CALL] Getting media stream', { type });
        let stream: MediaStream;
        try {
            stream = await media.getMedia(type);
        } catch (error: any) {
            console.error('❌ [ACCEPT CALL] Failed to get media stream', {
                error: error.message,
                errorName: error.name,
                type
            });

            // Если не удалось получить видео, пробуем только аудио
            if (type === 'VIDEO' && error.name === 'NotReadableError') {
                console.log('🔄 [ACCEPT CALL] Retrying with audio only');
                try {
                    stream = await media.getMedia('AUDIO');
                    setCallType('AUDIO'); // Меняем тип звонка на аудио
                } catch (audioError: any) {
                    console.error('❌ [ACCEPT CALL] Failed to get audio stream too', audioError);
                    isProcessingIncomingCallRef.current = false;
                    setIsIncomingCall(false);
                    setIncomingCallData(null);
                    return;
                }
            } else {
                isProcessingIncomingCallRef.current = false;
                setIsIncomingCall(false);
                setIncomingCallData(null);
                return;
            }
        }
        console.log('✅ [ACCEPT CALL] Media stream obtained', {
            streamId: stream.id,
            hasVideo: stream.getVideoTracks().length > 0,
            hasAudio: stream.getAudioTracks().length > 0,
            videoTracks: stream.getVideoTracks().length,
            audioTracks: stream.getAudioTracks().length
        });

        // ВАЖНО: Треки должны быть добавлены ДО создания answer, чтобы они были включены в SDP
        console.log('🎵 [ACCEPT CALL] Adding tracks to peer connection BEFORE creating answer', {
            streamId: stream.id,
            tracksCount: stream.getTracks().length
        });
        stream.getTracks().forEach((track, index) => {
            console.log(`➕ [ACCEPT CALL] Adding track ${index + 1}`, {
                trackId: track.id,
                trackKind: track.kind
            });
            peerService.addTrack(track, stream);
        });
        console.log('✅ [ACCEPT CALL] All tracks added', {
            totalSenders: peerService.connection?.getSenders().length || 0
        });

        console.log('📝 [ACCEPT CALL] Creating answer (tracks already added)', {
            offerType: offer.type,
            hasOfferSdp: !!offer.sdp,
            peerSignalingState: peerService.connection?.signalingState,
            sendersCount: peerService.connection?.getSenders().length || 0
        });

        const answer = await peerService.getAnswer(offer);
        console.log('✅ [ACCEPT CALL] Answer created', {
            type: answer.type,
            hasSdp: !!answer.sdp,
            signalingState: peerService.connection?.signalingState,
            sendersCount: peerService.connection?.getSenders().length || 0
        });

        // ВАЖНО: После getAnswer remote description (offer) уже установлен
        // Добавляем все буферизованные ICE candidates
        if (iceCandidateBufferRef.current.length > 0) {
            console.log('📦 [ACCEPT CALL] Processing buffered ICE candidates after getAnswer', {
                count: iceCandidateBufferRef.current.length
            });
            const bufferedCandidates = [...iceCandidateBufferRef.current];
            iceCandidateBufferRef.current = []; // Очищаем буфер

            for (const candidate of bufferedCandidates) {
                try {
                    peerService.connection!.addIceCandidate(candidate);
                    console.log('✅ [ACCEPT CALL] Buffered ICE candidate added', {
                        candidate: candidate.candidate?.substring(0, 50)
                    });
                } catch (error: any) {
                    console.error('❌ [ACCEPT CALL] Error adding buffered ICE candidate:', error);
                }
            }
        }

        console.log('📤 [ACCEPT CALL] Sending call:accepted', {
            to: from,
            fromSocketId: socket.id,
            answerType: answer.type,
            socketConnected: socket.connected,
            toSocketId: from
        });

        // ВАЖНО: Убеждаемся, что отправляем правильный socket ID
        if (!from) {
            console.error('❌ [ACCEPT CALL] Cannot send call:accepted - no target socket ID');
            return;
        }

        console.log('📡 [ACCEPT CALL] Emitting call:accepted event', {
            event: 'call:accepted',
            payload: {
                toSocketId: from, // ВАЖНО: используем toSocketId, а не to
                hasAnswer: !!answer,
                answerType: answer.type
            },
            mySocketId: socket.id,
            targetSocketId: from,
            socketConnected: socket.connected
        });

        // ВАЖНО: Сервер ожидает toSocketId, а не to
        socket.emit('call:accepted', { toSocketId: from, ans: answer }, (response: any) => {
            console.log('📨 [ACCEPT CALL] Server response received', {
                hasResponse: !!response,
                response,
                timestamp: new Date().toISOString()
            });
            if (response) {
                console.log('✅ [ACCEPT CALL] call:accepted sent, response:', response);
                if (response.error) {
                    console.error('❌ [ACCEPT CALL] Server error:', response.error);
                }
            } else {
                console.log('✅ [ACCEPT CALL] call:accepted sent (no response callback)');
            }
        });

        // Дополнительное логирование для отладки
        console.log('🔍 [ACCEPT CALL] Event emitted, waiting for server response...');

        console.log('✅ [ACCEPT CALL] Setting isInCall = true');
        setIsInCall(true);
        setCallButton(false);
        setIncomingCallData(null);
        isProcessingIncomingCallRef.current = false;
        console.log('✅ [ACCEPT CALL] Call accepted');
    }, [incomingCallData, socket, peerService, media]);

    // Функция для отклонения звонка
    const rejectCall = useCallback(() => {
        console.log('❌ [REJECT CALL] Rejecting incoming call');
        setIsIncomingCall(false);
        setIncomingCallData(null);
        isProcessingIncomingCallRef.current = false;

        // Можно отправить событие об отклонении звонка на сервер
        if (incomingCallData && socket) {
            // TODO: Отправить событие call:rejected если нужно
            console.log('📤 [REJECT CALL] Call rejected');
        }
    }, [incomingCallData, socket]);

    // ---------- outgoing ----------
    const callUser = useCallback(async (offer: RTCSessionDescriptionInit, type: 'VIDEO' | 'AUDIO') => {
        // Сбрасываем флаги обработанных событий для нового звонка
        processedAnswerRef.current = null;
        processedIncomingCallRef.current = null;
        iceCandidateBufferRef.current = []; // Очищаем буфер ICE candidates

        console.log('📞 [OUTGOING CALL] Initiating call', {
            type,
            toUserId: otherUserId,
            toSocketId: remoteSocketId,
            chatId,
            hasSocket: !!socket,
            offerType: offer.type,
            hasSdp: !!offer.sdp
        });

        if (!socket) {
            console.error('❌ [OUTGOING CALL] No socket available');
            return;
        }

        socket.emit('user:call', {
            toSocketId: remoteSocketId || undefined,
            toUserId: otherUserId,
            chatId,
            offer,
            type,
        });

        console.log('✅ [OUTGOING CALL] Call event sent', {
            type,
            toSocketId: remoteSocketId || 'will be found by userId'
        });

        console.log('🔄 [OUTGOING CALL] Setting callType', {
            newCallType: type,
            previousCallType: callType
        });
        setCallType(type);
        setCallButton(false);
        console.log('✅ [OUTGOING CALL] callType updated', {
            callType: type,
            isInCall
        });
        setIsInCall(true);
        console.log('✅ [OUTGOING CALL] isInCall updated to true');
    }, [socket, remoteSocketId, otherUserId, chatId, callType, isInCall]);

    // ---------- negotiation ----------
    useEffect(() => {
        const peer = peerService.connection;
        if (!peer) {
            console.log('⚠️ [NEGOTIATION] No peer connection available');
            return;
        }

        console.log('🎯 [NEGOTIATION] Setting up peer event handlers', {
            signalingState: peer.signalingState,
            connectionState: peer.connectionState
        });

        // Сбрасываем remote stream ref при создании нового peer connection
        remoteStreamRef.current = null;

        const handleTrack = (e: RTCTrackEvent) => {
            console.log('📹 [NEGOTIATION] Track received', {
                streamId: e.streams[0]?.id,
                trackId: e.track.id,
                trackKind: e.track.kind,
                trackEnabled: e.track.enabled,
                trackReadyState: e.track.readyState,
                streamsCount: e.streams.length,
                streamAudioTracks: e.streams[0]?.getAudioTracks().length || 0,
                streamVideoTracks: e.streams[0]?.getVideoTracks().length || 0
            });

            // ВАЖНО: На мобильных устройствах треки могут приходить в разных стримах
            // или вообще без стрима. Нужно собрать все треки в один стрим
            let stream = e.streams[0];

            if (!stream && e.track) {
                // Если трек пришел без стрима, создаем новый стрим или используем существующий
                if (!remoteStreamRef.current) {
                    remoteStreamRef.current = new MediaStream();
                    console.log('🆕 [NEGOTIATION] Created new remote stream for track without stream');
                }
                stream = remoteStreamRef.current;
                stream.addTrack(e.track);
                console.log('➕ [NEGOTIATION] Added track to remote stream', {
                    trackId: e.track.id,
                    trackKind: e.track.kind,
                    streamId: stream.id
                });
            } else if (stream) {
                // Если трек пришел со стримом, используем его
                remoteStreamRef.current = stream;
                console.log('✅ [NEGOTIATION] Using stream from track event', {
                    streamId: stream.id
                });
            }

            if (stream) {
                // Логируем все треки в стриме
                console.log('🎵 [NEGOTIATION] Stream tracks', {
                    streamId: stream.id,
                    totalTracks: stream.getTracks().length,
                    audioTracks: stream.getAudioTracks().map(t => ({
                        id: t.id,
                        enabled: t.enabled,
                        readyState: t.readyState,
                        kind: t.kind
                    })),
                    videoTracks: stream.getVideoTracks().map(t => ({
                        id: t.id,
                        enabled: t.enabled,
                        readyState: t.readyState,
                        kind: t.kind
                    }))
                });
            }

            // Устанавливаем remote stream только если есть треки
            if (stream && stream.getTracks().length > 0) {
                console.log('✅ [NEGOTIATION] Setting remote stream', {
                    streamId: stream.id,
                    hasStream: !!stream,
                    tracksCount: stream.getTracks().length,
                    audioTracks: stream.getAudioTracks().length,
                    videoTracks: stream.getVideoTracks().length
                });
                media.setRemoteStream(stream);
            } else {
                console.warn('⚠️ [NEGOTIATION] Track received but no valid stream', {
                    hasStream: !!stream,
                    tracksInStream: stream?.getTracks().length || 0
                });
            }
        };

        // Используем addEventListener для более надежной обработки
        peer.addEventListener('track', handleTrack);
        // Также устанавливаем ontrack для совместимости
        peer.ontrack = handleTrack;

        // ВАЖНО: Отключаем автоматический onnegotiationneeded
        // Переnegotiation должен происходить только через явные события peer:nego:needed
        // чтобы избежать циклов
        peer.onnegotiationneeded = null;
        console.log('✅ [NEGOTIATION] onnegotiationneeded disabled to prevent loops');

        // КРИТИЧНО: Обработка ICE candidates для установки соединения
        const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
            if (event.candidate) {
                console.log('📡 [NEGOTIATION] ICE candidate found', {
                    candidate: event.candidate.candidate,
                    sdpMid: event.candidate.sdpMid,
                    sdpMLineIndex: event.candidate.sdpMLineIndex
                });
                // Отправляем ICE-кандидата другому пиру
                if (socket && remoteSocketId) {
                    socket.emit('peer:ice-candidate', {
                        to: remoteSocketId,
                        candidate: event.candidate,
                    });
                }
            } else {
                console.log('📡 [NEGOTIATION] ICE gathering complete');
            }
        };
        peer.onicecandidate = handleIceCandidate;

        // Отслеживание состояния соединения
        peer.onconnectionstatechange = () => {
            console.log('🔄 [NEGOTIATION] Connection state changed', {
                state: peer.connectionState,
                iceConnectionState: peer.iceConnectionState,
                iceGatheringState: peer.iceGatheringState,
                signalingState: peer.signalingState
            });
        };

        peer.oniceconnectionstatechange = () => {
            console.log('🧊 [NEGOTIATION] ICE connection state changed', {
                state: peer.iceConnectionState,
                connectionState: peer.connectionState,
                iceGatheringState: peer.iceGatheringState
            });
        };

        peer.onicegatheringstatechange = () => {
            console.log('📡 [NEGOTIATION] ICE gathering state changed', {
                state: peer.iceGatheringState,
                connectionState: peer.connectionState,
                iceConnectionState: peer.iceConnectionState
            });
        };

        return () => {
            console.log('🧹 [NEGOTIATION] Cleaning up peer event handlers');
            peer.removeEventListener('track', handleTrack);
            if (peer.ontrack === handleTrack) {
                peer.ontrack = null;
            }
            peer.onnegotiationneeded = null;
            peer.onconnectionstatechange = null;
            peer.oniceconnectionstatechange = null;
            peer.onicegatheringstatechange = null;
            peer.onicecandidate = null;
            // Сбрасываем remote stream ref при размонтировании
            remoteStreamRef.current = null;
        };
    }, [peerService.connection, media.setRemoteStream, socket, remoteSocketId]);

    // ---------- call accepted handler ----------
    const handleCallAccepted = useCallback(async ({ ans }: CallAcceptedData) => {
        // Создаем уникальный идентификатор для этого answer (используем первые 50 символов SDP)
        const answerId = ans.sdp?.substring(0, 50) || '';

        console.log('✅ [CALL ACCEPTED] Received call:accepted', {
            answerType: ans.type,
            hasSdp: !!ans.sdp,
            hasPeer: !!peerService.connection,
            hasMyStream: !!media.myStream,
            peerSignalingState: peerService.connection?.signalingState,
            peerConnectionState: peerService.connection?.connectionState,
            answerId,
            alreadyProcessed: processedAnswerRef.current === answerId
        });

        if (!peerService.connection) {
            console.error('❌ [CALL ACCEPTED] Peer connection not initialized');
            return;
        }

        const peer = peerService.connection;

        // ВАЖНО: Сначала проверяем состояние signaling state
        // Это критично, чтобы избежать ошибки "Called in wrong state: stable"
        const currentState = peer.signalingState;
        const hasRemoteDesc = !!peer.remoteDescription;

        console.log('🔍 [CALL ACCEPTED] Checking peer connection state', {
            signalingState: currentState,
            hasRemoteDescription: hasRemoteDesc,
            remoteDescriptionType: peer.remoteDescription?.type,
            answerId,
            alreadyProcessed: processedAnswerRef.current === answerId
        });

        // Если уже в stable и есть remote description, пропускаем
        // Это самая важная проверка - нельзя устанавливать remote description в stable
        if (currentState === 'stable' && hasRemoteDesc) {
            console.log('⚠️ [CALL ACCEPTED] Peer already in stable state with remote description, skipping setRemoteDescription');
            // Помечаем как обработанный, но не устанавливаем remote description
            processedAnswerRef.current = answerId;
            setIsInCall(true);
            return;
        }

        // Если состояние stable, но нет remote description - это тоже проблема для answer
        if (currentState === 'stable' && !hasRemoteDesc) {
            console.warn('⚠️ [CALL ACCEPTED] Cannot set answer in stable state without remote description, skipping');
            processedAnswerRef.current = answerId;
            return;
        }

        // Защита от повторной обработки того же answer (после проверки состояния)
        if (processedAnswerRef.current === answerId) {
            console.log('⚠️ [CALL ACCEPTED] Answer already processed, skipping');
            return;
        }

        try {
            console.log('📝 [CALL ACCEPTED] Setting remote description', {
                beforeSignalingState: peer.signalingState,
                answerSdpLength: ans.sdp?.length || 0
            });

            // Помечаем как обработанный ДО установки, чтобы избежать повторных вызовов
            processedAnswerRef.current = answerId;

            // Устанавливаем remote description с обработкой ошибок
            await peerService.setRemoteDescription(ans);
            console.log('✅ [CALL ACCEPTED] Remote description set', {
                afterSignalingState: peerService.connection?.signalingState,
                connectionState: peerService.connection?.connectionState,
                iceConnectionState: peerService.connection?.iceConnectionState,
                iceGatheringState: peerService.connection?.iceGatheringState
            });
        } catch (error: any) {
            // Если ошибка связана с неправильным состоянием, просто логируем
            if (error.name === 'InvalidStateError' || error.message?.includes('wrong state')) {
                console.warn('⚠️ [CALL ACCEPTED] Cannot set remote description due to invalid state', {
                    error: error.message,
                    signalingState: peer.signalingState,
                    hasRemoteDesc: !!peer.remoteDescription
                });
                // Не пробрасываем ошибку дальше, так как это может быть нормальная ситуация
                // (например, если answer уже был установлен)
                return;
            }
            // Для других ошибок пробрасываем дальше
            console.error('❌ [CALL ACCEPTED] Error setting remote description:', error);
            throw error;
        }

        // ВАЖНО: После установки remote description добавляем все буферизованные ICE candidates
        if (iceCandidateBufferRef.current.length > 0) {
            console.log('📦 [CALL ACCEPTED] Processing buffered ICE candidates', {
                count: iceCandidateBufferRef.current.length
            });
            const bufferedCandidates = [...iceCandidateBufferRef.current];
            iceCandidateBufferRef.current = []; // Очищаем буфер

            for (const candidate of bufferedCandidates) {
                try {
                    peerService.connection!.addIceCandidate(candidate);
                    console.log('✅ [CALL ACCEPTED] Buffered ICE candidate added', {
                        candidate: candidate.candidate?.substring(0, 50)
                    });
                } catch (error: any) {
                    console.error('❌ [CALL ACCEPTED] Error adding buffered ICE candidate:', error);
                }
            }
        }

        // Проверяем, есть ли уже треки в соединении
        const receivers = peerService.connection.getReceivers();
        console.log('📊 [CALL ACCEPTED] Current receivers', {
            count: receivers.length,
            receivers: receivers.map(r => ({
                trackId: r.track?.id,
                trackKind: r.track?.kind,
                trackEnabled: r.track?.enabled,
                trackReadyState: r.track?.readyState
            }))
        });

        // ВАЖНО: Проверяем, есть ли уже треки в соединении
        // Треки должны быть добавлены ДО отправки offer в callUser
        // Но если их нет, добавляем их сейчас
        const existingSenders = peerService.connection.getSenders();
        console.log('📊 [CALL ACCEPTED] Existing senders in peer', {
            count: existingSenders.length,
            senders: existingSenders.map(s => ({
                trackId: s.track?.id,
                trackKind: s.track?.kind,
                trackEnabled: s.track?.enabled
            }))
        });

        if (media.myStream) {
            const existingTracks = existingSenders.map(s => s.track).filter(Boolean);
            const tracksToAdd = media.myStream.getTracks().filter(
                track => !existingTracks.includes(track)
            );

            if (tracksToAdd.length > 0) {
                console.log('🎵 [CALL ACCEPTED] Adding missing tracks to peer connection', {
                    streamId: media.myStream.id,
                    tracksToAdd: tracksToAdd.length,
                    totalTracks: media.myStream.getTracks().length,
                    videoTracks: media.myStream.getVideoTracks().length,
                    audioTracks: media.myStream.getAudioTracks().length
                });

                tracksToAdd.forEach(track => {
                    console.log('➕ [CALL ACCEPTED] Adding track', {
                        trackId: track.id,
                        trackKind: track.kind,
                        trackEnabled: track.enabled
                    });
                    peerService.addTrack(track, media.myStream!);
                });

                console.log('✅ [CALL ACCEPTED] Missing tracks added', {
                    totalSenders: peerService.connection.getSenders().length
                });
            } else {
                console.log('✅ [CALL ACCEPTED] All tracks already added', {
                    totalSenders: existingSenders.length
                });
            }
        } else {
            // Не предупреждаем, если треки уже есть в senders
            if (existingSenders.length === 0) {
                console.warn('⚠️ [CALL ACCEPTED] No myStream available and no tracks in senders');
            } else {
                console.log('✅ [CALL ACCEPTED] Tracks already present in senders, myStream not needed');
            }
        }

        console.log('✅ [CALL ACCEPTED] Setting isInCall = true', {
            previousIsInCall: isInCall,
            callType,
            hasMyStream: !!media.myStream
        });
        setIsInCall(true);
        console.log('✅ [CALL ACCEPTED] isInCall updated to true', {
            callType,
            willShowVideo: callType === 'VIDEO'
        });

        // Проверяем состояние соединения после установки remote description
        setTimeout(() => {
            const peer = peerService.connection;
            if (peer) {
                console.log('🔍 [CALL ACCEPTED] Peer connection state after 1s', {
                    connectionState: peer.connectionState,
                    iceConnectionState: peer.iceConnectionState,
                    iceGatheringState: peer.iceGatheringState,
                    signalingState: peer.signalingState,
                    receivers: peer.getReceivers().length,
                    senders: peer.getSenders().length,
                    hasRemoteStream: false // Will be set via setRemoteStream
                });
            }
        }, 1000);
    }, [peerService, media, isInCall, callType]);

    // ---------- socket events ----------
    useEffect(() => {
        if (!socket) {
            console.log('⚠️ [SOCKET EVENTS] No socket available');
            return;
        }

        console.log('📡 [SOCKET EVENTS] Registering socket event handlers', {
            socketId: socket.id,
            socketConnected: socket.connected
        });


        socket.on('incoming:call', (data: IncomingCallData) => {
            console.log('📥 [SOCKET EVENTS] incoming:call event received', {
                from: data.from,
                fromUserId: data.fromUserId,
                type: data.type,
                hasOffer: !!data.offer,
                offerType: data.offer?.type,
                hasSdp: !!data.offer?.sdp,
                fullData: data
            });
            console.log('🔄 [SOCKET EVENTS] Calling onIncomingCall handler');
            onIncomingCall(data);
            console.log('✅ [SOCKET EVENTS] onIncomingCall handler called');
        });
        console.log('✅ [SOCKET EVENTS] Registered incoming:call handler');

        socket.on('call:accepted', (data: CallAcceptedData) => {
            console.log('📥 [SOCKET EVENTS] call:accepted event received', {
                hasAnswer: !!data.ans,
                answerType: data.ans?.type,
                hasSdp: !!data.ans?.sdp,
                from: data.from,
                socketId: socket.id,
                socketConnected: socket.connected,
                timestamp: new Date().toISOString()
            });
            console.log('🔄 [SOCKET EVENTS] Calling handleCallAccepted');
            handleCallAccepted(data);
            console.log('✅ [SOCKET EVENTS] handleCallAccepted called');
        });


        console.log('✅ [SOCKET EVENTS] Registered call:accepted handler');

        socket.on('peer:nego:needed', async ({ from, offer }: PeerNegoNeededData) => {
            console.log('🔄 [PEER NEGO NEEDED] Received peer:nego:needed', {
                from,
                offerType: offer.type,
                hasPeer: !!peerService.connection,
                hasMyStream: !!media.myStream,
                peerSignalingState: peerService.connection?.signalingState,
                peerLocalDescription: !!peerService.connection?.localDescription,
                peerRemoteDescription: !!peerService.connection?.remoteDescription
            });

            const peer = peerService.connection;

            // Проверяем и создаем peer connection если нужно
            if (!peer) {
                console.log('⚠️ [PEER NEGO NEEDED] No peer connection, creating new one');
                ensurePeerConnection(peerService, media.myStream);
            } else {
                // Проверяем состояние peer connection
                const hasLocalDesc = !!peer.localDescription;
                const hasRemoteDesc = !!peer.remoteDescription;
                const signalingState = peer.signalingState;

                console.log('📊 [PEER NEGO NEEDED] Peer connection state', {
                    signalingState,
                    hasLocalDesc,
                    hasRemoteDesc,
                    connectionState: peer.connectionState
                });

                // Если peer connection уже в состоянии stable или имеет descriptions,
                // это может быть переnegotiation - нужно обработать аккуратно
                if (signalingState === 'stable' && (hasLocalDesc || hasRemoteDesc)) {
                    console.warn('⚠️ [PEER NEGO NEEDED] Peer in stable state - this is renegotiation');
                    console.log('🔄 [PEER NEGO NEEDED] Attempting to handle renegotiation');
                }
            }

            try {
                console.log('📝 [PEER NEGO NEEDED] Creating answer');
                const ans = await peerService.getAnswer(offer);
                console.log('✅ [PEER NEGO NEEDED] Answer created', {
                    answerType: ans.type,
                    hasSdp: !!ans.sdp,
                    newSignalingState: peerService.connection?.signalingState
                });

                console.log('📤 [PEER NEGO NEEDED] Sending peer:nego:done', { to: from });
                socket.emit('peer:nego:done', { to: from, ans });
                console.log('✅ [PEER NEGO NEEDED] peer:nego:done sent');
            } catch (error) {
                console.error('❌ [PEER NEGO NEEDED] Error creating answer:', error);
                // Если ошибка, пересоздаем peer connection и пробуем снова
                console.log('🔄 [PEER NEGO NEEDED] Recreating peer connection due to error');
                ensurePeerConnection(peerService, media.myStream);
                try {
                    const ans = await peerService.getAnswer(offer);
                    socket.emit('peer:nego:done', { to: from, ans });
                    console.log('✅ [PEER NEGO NEEDED] Retry successful');
                } catch (retryError) {
                    console.error('❌ [PEER NEGO NEEDED] Retry failed:', retryError);
                }
            }
        });

        console.log('✅ [SOCKET EVENTS] Registered peer:nego:needed handler');

        socket.on('peer:nego:done', ({ ans }: PeerNegoDoneData) => {
            console.log('✅ [PEER NEGO DONE] Received peer:nego:done', {
                answerType: ans.type,
                hasSdp: !!ans.sdp,
                hasPeer: !!peerService.connection,
                currentSignalingState: peerService.connection?.signalingState
            });

            if (!peerService.connection) {
                console.error('❌ [PEER NEGO DONE] Peer connection not initialized');
                return;
            }

            try {
                peerService.setRemoteDescription(ans);
                console.log('✅ [PEER NEGO DONE] Remote description set', {
                    newSignalingState: peerService.connection.signalingState
                });

                // ВАЖНО: После установки remote description добавляем все буферизованные ICE candidates
                if (iceCandidateBufferRef.current.length > 0) {
                    console.log('📦 [PEER NEGO DONE] Processing buffered ICE candidates', {
                        count: iceCandidateBufferRef.current.length
                    });
                    const bufferedCandidates = [...iceCandidateBufferRef.current];
                    iceCandidateBufferRef.current = []; // Очищаем буфер

                    for (const candidate of bufferedCandidates) {
                        try {
                            peerService.connection!.addIceCandidate(candidate);
                            console.log('✅ [PEER NEGO DONE] Buffered ICE candidate added');
                        } catch (error: any) {
                            console.error('❌ [PEER NEGO DONE] Error adding buffered ICE candidate:', error);
                        }
                    }
                }
            } catch (error) {
                console.error('❌ [PEER NEGO DONE] Error setting remote description:', error);
            }
        });

        console.log('✅ [SOCKET EVENTS] Registered peer:nego:done handler');

        // КРИТИЧНО: Обработка входящих ICE candidates
        socket.on('peer:ice-candidate', ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
            console.log('📥 [SOCKET EVENTS] peer:ice-candidate received', {
                from,
                hasCandidate: !!candidate,
                candidate: candidate?.candidate,
                sdpMid: candidate?.sdpMid,
                sdpMLineIndex: candidate?.sdpMLineIndex
            });

            const peer = peerService.connection;
            if (!peer) {
                console.warn('⚠️ [SOCKET EVENTS] No peer connection for ICE candidate, buffering');
                iceCandidateBufferRef.current.push(candidate);
                return;
            }

            // ВАЖНО: Нельзя добавлять ICE candidates до установки remote description
            const hasRemoteDescription = !!peer.remoteDescription;
            if (!hasRemoteDescription) {
                console.log('📦 [SOCKET EVENTS] Remote description not set yet, buffering ICE candidate', {
                    signalingState: peer.signalingState,
                    bufferedCount: iceCandidateBufferRef.current.length + 1
                });
                iceCandidateBufferRef.current.push(candidate);
                return;
            }

            try {
                console.log('➕ [SOCKET EVENTS] Adding ICE candidate to peer connection', {
                    signalingState: peer.signalingState,
                    hasRemoteDescription: true
                });
                peer.addIceCandidate(candidate);
                console.log('✅ [SOCKET EVENTS] ICE candidate added', {
                    signalingState: peer.signalingState,
                    iceConnectionState: peer.iceConnectionState
                });
            } catch (error: any) {
                console.error('❌ [SOCKET EVENTS] Error adding ICE candidate:', {
                    error: error.message,
                    errorName: error.name,
                    signalingState: peer.signalingState,
                    hasRemoteDescription: !!peer.remoteDescription
                });
            }
        });
        console.log('✅ [SOCKET EVENTS] Registered peer:ice-candidate handler');

        socket.on('call:end', ({ from }: CallEndData) => {
            console.log('📞 [CALL END] Received call:end', {
                from,
                remoteSocketId,
                incomingCallFrom: incomingCallData?.from,
                matchesRemoteSocketId: from === remoteSocketId,
                matchesIncomingCall: from === incomingCallData?.from,
                isIncomingCall,
                isInCall
            });

            // Проверяем, что событие от правильного пользователя
            const isFromRemoteSocket = from === remoteSocketId;
            const isFromIncomingCall = from === incomingCallData?.from;

            if (!isFromRemoteSocket && !isFromIncomingCall) {
                console.log('⚠️ [CALL END] Ignoring - from different socket', {
                    from,
                    remoteSocketId,
                    incomingCallFrom: incomingCallData?.from
                });
                return;
            }

            // Если это входящий звонок, который еще не принят - отменяем его
            if (isIncomingCall && isFromIncomingCall) {
                console.log('🛑 [CALL END] Cancelling incoming call (not yet accepted)');
                setIsIncomingCall(false);
                setIncomingCallData(null);
                isProcessingIncomingCallRef.current = false;
                remoteStreamRef.current = null; // Сбрасываем remote stream ref
                // Также сбрасываем remoteSocketId если он был установлен из incoming call
                if (remoteSocketId === from) {
                    setRemoteSocketId(null);
                }
                return;
            }

            // Если звонок уже принят или это исходящий звонок - завершаем его полностью
            console.log('🛑 [CALL END] Ending active call');
            remoteStreamRef.current = null; // Сбрасываем remote stream ref
            peerService.close();
            media.stopMyStream();
            media.setRemoteStream(null);
            setIsInCall(false);
            setIsIncomingCall(false);
            setIncomingCallData(null);
            setCallButton(true);
            isProcessingIncomingCallRef.current = false;
            console.log('✅ [CALL END] Call ended');
        });

        console.log('✅ [SOCKET EVENTS] Registered call:end handler');

        socket.on('call:initiated', ({ from }: CallInitiatedData) => {
            console.log('📞 [CALL INITIATED] Received call:initiated', {
                from,
                remoteSocketId,
                matches: from === remoteSocketId
            });

            if (from === remoteSocketId) {
                console.log('✅ [CALL INITIATED] Setting callButton = false');
                setCallButton(false);
            }
        });

        console.log('✅ [SOCKET EVENTS] Registered call:initiated handler');
        console.log('✅ [SOCKET EVENTS] All socket event handlers registered');

        return () => {
            console.log('🧹 [SOCKET EVENTS] Removing socket listeners');
            socket.off('incoming:call', onIncomingCall);
            socket.off('call:accepted', handleCallAccepted);
            socket.removeAllListeners('peer:nego:needed');
            socket.removeAllListeners('peer:nego:done');
            socket.removeAllListeners('call:end');
            socket.removeAllListeners('call:initiated');
            socket.removeAllListeners('peer:ice-candidate');
            // Сбрасываем флаги обработанных событий при размонтировании
            processedAnswerRef.current = null;
            processedIncomingCallRef.current = null;
        };
    }, [socket, onIncomingCall, handleCallAccepted, peerService, media, remoteSocketId, isIncomingCall, incomingCallData]);

    const endCall = useCallback(() => {
        console.log('🛑 [END CALL] Ending call manually', {
            hasRemoteSocketId: !!remoteSocketId,
            hasSocket: !!socket,
            isIncomingCall,
            isInCall
        });

        // ВАЖНО: Сбрасываем все состояния звонка, включая входящий звонок
        setIsIncomingCall(false);
        setIncomingCallData(null);
        isProcessingIncomingCallRef.current = false;
        remoteStreamRef.current = null; // Сбрасываем remote stream ref

        peerService.close();
        media.stopMyStream();
        media.setRemoteStream(null);
        setIsInCall(false);
        setCallButton(true);

        // Отправляем call:end если есть кому отправить
        // Используем remoteSocketId или incomingCallData?.from
        const targetSocketId = remoteSocketId || incomingCallData?.from;
        if (targetSocketId && socket) {
            console.log('📤 [END CALL] Sending call:end event', { toSocketId: targetSocketId });
            // ВАЖНО: Сервер ожидает toSocketId, а не to
            socket.emit('call:end', { toSocketId: targetSocketId });
        } else if (socket && !targetSocketId) {
            // Если нет targetSocketId, но есть socket, отправляем по otherUserId
            // Сервер сам найдет socketId через OnlineUsersService
            console.log('📤 [END CALL] Sending call:end without toSocketId, server will find by userId', { otherUserId });
            socket.emit('call:end', { toUserId: otherUserId });
        }

        console.log('✅ [END CALL] Call ended');
    }, [remoteSocketId, socket, peerService, media, isIncomingCall, incomingCallData]);

    // Отслеживание изменений критичных состояний
    useEffect(() => {
        console.log('🔄 [CALL ENGINE] isInCall changed', {
            isInCall,
            callType,
            willShowVideo: isInCall && callType === 'VIDEO'
        });
    }, [isInCall, callType]);

    useEffect(() => {
        console.log('🔄 [CALL ENGINE] callType changed', {
            callType,
            isInCall,
            willShowVideo: isInCall && callType === 'VIDEO'
        });
    }, [callType, isInCall]);

    return {
        peerService,
        callUser,
        endCall,
        isInCall,
        callButton,
        callType,
        isIncomingCall,
        acceptCall,
        rejectCall,
    };
};
