'use client';

import { FC, useEffect, useState, useRef, useContext } from "react";
import { LiveKitRoom, RoomAudioRenderer, RoomContext, useTracks, VideoTrack } from '@livekit/components-react';
import '@livekit/components-styles';
import type { Room } from 'livekit-client';
import { RemoteParticipant, LocalParticipant, Track } from 'livekit-client';
import { CallControls } from "./components/CallControls";
import { useGlobalCallContext } from "@/modules/features";
import { useLiveKitControls } from "@/modules/features/call/lib/hook/livekit-controls.hook";
import { Button } from "@workspace/ui/components/button";
import { PhoneOff } from "lucide-react";
import { CallIncoming } from "./components/CallIncoming";
import { useUser } from "@/modules/entities/user/lib/hook/user.hook";
import { LoadingScreen } from "@/modules/shared";
import { useLivekitToken } from "@/modules/features/call/lib/hook/livekit.hook";

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'https://ws.sociopath-network.ru';

interface ICallWrapperWidgetProps {
    children: React.ReactNode;
}

/**
 * Компонент для отображения видео участника LiveKit
 * Заменяет VideoPlayer, но сохраняет тот же внешний вид
 */
const LiveKitVideoPlayer = ({
    participant,
    name,
    className
}: {
    participant: RemoteParticipant | LocalParticipant;
    name: string;
    className?: string;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const room = useContext(RoomContext) as Room | undefined;

    // ✅ Получаем ВСЕ треки (включая неподписанные), чтобы видеть их до подписки
    const allTracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: false },
            { source: Track.Source.ScreenShare, withPlaceholder: false }
        ],
        { onlySubscribed: false } // ✅ Важно: получаем все треки, даже неподписанные
    );

    // Находим видео трек для этого участника (фильтруем по подписке вручную)
    const videoTrack = allTracks.find((track) =>
        track.participant?.identity === participant.identity &&
        track.publication &&
        track.publication.kind === 'video' &&
        track.publication.isSubscribed && // ✅ Фильтруем только подписанные
        (track.source === Track.Source.Camera || track.source === Track.Source.ScreenShare)
    );

    // Логирование для диагностики
    useEffect(() => {
        if (!room || !participant) return;

        // Получаем все публикации треков
        const publishedTracks: any[] = [];
        participant.trackPublications.forEach((pub) => {
            publishedTracks.push(pub);
        });
        const videoPublications = publishedTracks.filter((pub: any) => pub.kind === 'video');

        console.log(`🎥 [LIVEKIT VIDEO PLAYER] ${name}`, {
            participantIdentity: participant.identity,
            isLocal: participant instanceof LocalParticipant,
            allTracksCount: allTracks.length,
            videoTrackFound: !!videoTrack,
            videoTrackSource: videoTrack?.source,
            videoTrackSubscribed: videoTrack?.publication?.isSubscribed,
            publishedTracksCount: publishedTracks.length,
            videoPublicationsCount: videoPublications.length,
        });

        // Для удаленных участников - убеждаемся, что подписываемся на треки
        if (participant instanceof RemoteParticipant) {
            participant.trackPublications.forEach((publication) => {
                if (publication.kind === 'video' && !publication.isSubscribed) {
                    console.log(`📡 [LIVEKIT VIDEO PLAYER] Subscribing to video track for ${name}`, {
                        trackSid: publication.trackSid,
                        source: publication.source,
                    });
                    publication.setSubscribed(true);
                }
            });
        }
    }, [room, participant, name, allTracks.length, videoTrack]);

    // Устанавливаем трек в video элемент
    useEffect(() => {
        if (!videoRef.current) return;

        if (videoTrack?.publication?.track) {
            const track = videoTrack.publication.track;
            console.log(`✅ [LIVEKIT VIDEO PLAYER] Attaching video track for ${name}`, {
                trackSid: track.sid,
                source: videoTrack.source,
            });
            track.attach(videoRef.current);

            // Пытаемся воспроизвести видео
            videoRef.current.play().catch((error) => {
                console.warn(`⚠️ [LIVEKIT VIDEO PLAYER] Video play failed for ${name}`, error);
            });

            return () => {
                console.log(`🔌 [LIVEKIT VIDEO PLAYER] Detaching video track for ${name}`);
                track.detach();
            };
        } else {
            // Очищаем video элемент если трека нет
            if (videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                videoRef.current.srcObject = null;
            }
        }
    }, [videoTrack, name]);

    return (
        <div className={`relative ${className}`}>
            {videoTrack ? (
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted={participant instanceof LocalParticipant} // Локальное видео должно быть muted
                />
            ) : (
                <div className="w-full h-full bg-black flex items-center justify-center text-white">
                    <div className="text-center">
                        <div className="text-sm mb-1">Нет видео</div>
                        <div className="text-xs text-gray-400">{name}</div>
                    </div>
                </div>
            )}
            {name && (
                <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-sm backdrop-blur-sm z-10">
                    {name}
                </div>
            )}
        </div>
    );
};

/**
 * Overlay для активного звонка
 * Использует LiveKit вместо WebRTC
 */
const CallOverlay = ({
    callType,
    remoteUserId
}: {
    callType: 'VIDEO' | 'AUDIO';
    remoteUserId: string | null;
}) => {
    const room = useContext(RoomContext) as Room | undefined;
    const { handleEndCall } = useGlobalCallContext();
    const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
    const [localParticipant, setLocalParticipant] = useState<LocalParticipant | null>(null);

    // ✅ Используем упрощенный хук для управления медиа в LiveKit
    const { isAudioMute, isVideoOnHold, toggleAudio, toggleVideo } = useLiveKitControls({
        room: room || null,
        localParticipant: localParticipant
    });

    // Получаем удаленного участника (не локального)
    const remoteParticipant = participants.find(p => p.identity !== localParticipant?.identity);
    const { user: remoteUser } = useUser(remoteUserId || '');

    // ✅ Инициализируем участников
    useEffect(() => {
        if (!room) return;

        setLocalParticipant(room.localParticipant);
        setParticipants(Array.from(room.remoteParticipants.values()));

        const updateParticipants = () => {
            setParticipants(Array.from(room.remoteParticipants.values()));
        };

        room.on('participantConnected', updateParticipants);
        room.on('participantDisconnected', updateParticipants);

        return () => {
            room.off('participantConnected', updateParticipants);
            room.off('participantDisconnected', updateParticipants);
        };
    }, [room]);

    // ✅ Отслеживаем события LiveKit
    useEffect(() => {
        if (!room) return;

        const logState = () => {
            console.log('🔍 [LIVEKIT] Room state:', {
                state: room.state,
                participantsCount: participants.length,
                remoteParticipant: remoteParticipant?.identity,
                localParticipant: localParticipant?.identity,
                isConnected: room.state === 'connected'
            });
        };

        logState();

        // Отслеживаем изменения состояния комнаты
        const handleStateChange = () => {
            logState();
        };

        room.on('connected', handleStateChange);
        room.on('disconnected', handleStateChange);
        room.on('reconnecting', handleStateChange);

        return () => {
            room.off('connected', handleStateChange);
            room.off('disconnected', handleStateChange);
            room.off('reconnecting', handleStateChange);
        };
    }, [room, room?.state, participants.length, remoteParticipant, localParticipant]);

    // ✅ Синхронизируем состояние медиа с LiveKit
    useEffect(() => {
        if (!localParticipant) return;

        const updateMediaState = () => {
            // Состояние обновляется автоматически через useLiveKitControls
        };

        // Обновляем состояние при изменении медиа
        localParticipant.on('trackMuted', updateMediaState);
        localParticipant.on('trackUnmuted', updateMediaState);

        return () => {
            localParticipant.off('trackMuted', updateMediaState);
            localParticipant.off('trackUnmuted', updateMediaState);
        };
    }, [localParticipant]);

    // ✅ Инициализируем участников при подключении комнаты
    useEffect(() => {
        if (!room) return;

        // ✅ КРИТИЧНО: Инициализируем участников сразу при подключении комнаты
        const updateParticipants = () => {
            const remoteParticipants = Array.from(room.remoteParticipants.values());
            setParticipants(remoteParticipants);
            setLocalParticipant(room.localParticipant);

            // ✅ Подписываемся на треки уже подключенных участников
            remoteParticipants.forEach((participant) => {
                participant.trackPublications.forEach((publication) => {
                    if (!publication.isSubscribed && publication.kind === 'video') {
                        console.log('📡 [LIVEKIT] Auto-subscribing to existing video track', {
                            participant: participant.identity,
                            trackSid: publication.trackSid,
                            source: publication.source,
                        });
                        publication.setSubscribed(true);
                    }
                });
            });
        };

        // Обновляем сразу при подключении
        updateParticipants();

        const handleParticipantConnected = (participant: RemoteParticipant) => {
            console.log('✅ [LIVEKIT] Participant connected:', participant.identity);
            updateParticipants();

            // Подписываемся на все треки удаленного участника
            participant.trackPublications.forEach((publication) => {
                if (!publication.isSubscribed && publication.kind === 'video') {
                    console.log('📡 [LIVEKIT] Auto-subscribing to video track', {
                        participant: participant.identity,
                        trackSid: publication.trackSid,
                        source: publication.source,
                    });
                    publication.setSubscribed(true);
                }
            });

            // Отслеживаем новые публикации треков
            participant.on('trackPublished', (publication) => {
                console.log('📹 [LIVEKIT] Track published', {
                    participant: participant.identity,
                    trackSid: publication.trackSid,
                    kind: publication.kind,
                    source: publication.source,
                });
                if (publication.kind === 'video' && !publication.isSubscribed) {
                    publication.setSubscribed(true);
                }
            });
        };

        const handleParticipantDisconnected = (participant: RemoteParticipant) => {
            console.log('❌ [LIVEKIT] Participant disconnected:', participant.identity);
            updateParticipants();
            // Если удаленный участник отключился, завершаем звонок
            if (participant.identity === remoteParticipant?.identity) {
                handleEndCall();
            }
        };

        // ✅ Также отслеживаем изменения состояния комнаты
        const handleRoomStateChanged = () => {
            if (room.state === 'connected') {
                updateParticipants();
            }
        };

        room.on('participantConnected', handleParticipantConnected);
        room.on('participantDisconnected', handleParticipantDisconnected);
        room.on('connected', handleRoomStateChanged);

        // Также отслеживаем публикации треков локального участника
        if (room.localParticipant) {
            room.localParticipant.on('trackPublished', (publication) => {
                console.log('📹 [LIVEKIT] Local track published', {
                    trackSid: publication.trackSid,
                    kind: publication.kind,
                    source: publication.source,
                });
            });
        }

        return () => {
            room.off('participantConnected', handleParticipantConnected);
            room.off('participantDisconnected', handleParticipantDisconnected);
            room.off('connected', handleRoomStateChanged);
            if (room.localParticipant) {
                room.localParticipant.off('trackPublished', () => { });
            }
        };
    }, [room, remoteParticipant, handleEndCall]);

    // ✅ Используем методы из useLiveKitControls
    const handleToggleAudioLiveKit = () => {
        toggleAudio();
    };

    const handleToggleVideoLiveKit = () => {
        toggleVideo();
    };

    const handleEndCallLiveKit = () => {
        if (room) {
            room.disconnect();
        }
        handleEndCall();
    };

    if (callType === 'VIDEO') {
        return (
            <div className="fixed inset-0 z-50 bg-black">
                {/* Удаленное видео - на весь экран */}
                {remoteParticipant ? (
                    <div className="absolute inset-0">
                        <LiveKitVideoPlayer
                            participant={remoteParticipant}
                            name={remoteUser?.name || ''}
                            className="w-full h-full rounded-none"
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center">
                            <div className="text-xl mb-2">Ожидание подключения...</div>
                            {remoteUser && (
                                <div className="text-sm text-gray-400">{remoteUser.name}</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Локальное видео - маленькое справа внизу */}
                {localParticipant && (
                    <div className="absolute bottom-24 right-4 md:bottom-28 md:right-6 z-10">
                        <LiveKitVideoPlayer
                            participant={localParticipant}
                            name="You"
                            className="w-28 h-36 sm:w-32 sm:h-44 md:w-56 md:h-72 rounded-lg border-2 border-white shadow-2xl"
                        />
                    </div>
                )}

                {/* Контролы внизу */}
                <div className="absolute bottom-0 left-0 right-0 pb-4 md:pb-6 flex justify-center z-20 px-4">
                    <CallControls
                        isAudioMute={isAudioMute}
                        isVideoOnHold={isVideoOnHold}
                        onToggleAudio={handleToggleAudioLiveKit}
                        onToggleVideo={handleToggleVideoLiveKit}
                        onEndCall={handleEndCallLiveKit}
                    />
                </div>
            </div>
        );
    }

    // Аудио звонок
    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-8">
            {remoteUser && (
                <div className="text-white text-2xl font-semibold">
                    {remoteUser.name}
                </div>
            )}
            <div className="text-white text-xl">
                Аудио звонок
            </div>
            <CallControls
                isAudioMute={isAudioMute}
                isVideoOnHold={isVideoOnHold}
                onToggleAudio={handleToggleAudioLiveKit}
                onToggleVideo={handleToggleVideoLiveKit}
                onEndCall={handleEndCallLiveKit}
            />
        </div>
    );
};

const CallWrapperWidgetContent: FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const call = useGlobalCallContext();
    const {
        isInCall,
        callType,
        isIncomingCall,
        remoteUserId,
        handleEndCall,
        chatId, // ✅ Получаем chatId из контекста
    } = call;

    // ✅ Генерируем roomName на основе chatId
    const roomName = chatId ? `chat-${chatId}` : null;

    // ✅ КЛЮЧЕВОЙ МОМЕНТ: Берем токен ТОЛЬКО когда есть активный звонок и roomName
    const { data: tokenData, isLoading: tokenLoading, error: tokenError } = useLivekitToken(roomName);

    // ✅ Отслеживаем ошибки токена
    useEffect(() => {
        if (tokenError) {
            console.error('❌ [LIVEKIT] Token error:', tokenError);
            // При ошибке токена завершаем звонок
            handleEndCall();
        }
    }, [tokenError, handleEndCall]);

    // ✅ Логирование состояния
    useEffect(() => {
        console.log('🎨 [CALL WRAPPER] State', {
            isInCall,
            callType,
            chatId,
            roomName,
            hasToken: !!tokenData?.token,
            tokenLoading,
            tokenError: !!tokenError,
        });
    }, [isInCall, callType, chatId, roomName, tokenData, tokenLoading, tokenError]);

    return (
        <div className="w-screen">
            {children}

            {/* Incoming call overlay */}
            {isIncomingCall && <CallIncoming />}

            {/* Outgoing call waiting overlay - показываем когда звонок инициирован, но еще не подключен к LiveKit */}
            {isInCall && (!tokenData?.token || tokenLoading) && !isIncomingCall && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col gap-4 items-center">
                        <div className="text-white text-xl font-semibold">
                            Звонок {callType === 'VIDEO' ? 'видео' : 'аудио'}...
                            {tokenLoading && ' (Подключение...)'}
                        </div>
                        {tokenLoading && (
                            <LoadingScreen />
                        )}
                        <div className="flex gap-4">
                            <Button
                                onClick={handleEndCall}
                                size="lg"
                                variant="destructive"
                            >
                                <PhoneOff className="h-5 w-5 mr-2" />
                                Отменить вызов
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ КЛЮЧЕВОЙ МОМЕНТ: Показываем LiveKitRoom только когда есть токен и активный звонок */}
            {isInCall && tokenData?.token && !tokenLoading && roomName && (
                <LiveKitRoom
                    video={callType === 'VIDEO'}
                    audio={true}
                    token={tokenData.token}
                    serverUrl={LIVEKIT_URL}
                    connect={true}
                    onDisconnected={(reason) => {
                        console.log('🔌 [LIVEKIT] Disconnected from room', {
                            reason,
                            reasonType: typeof reason,
                            reasonValue: reason
                        });
                        // ✅ НЕ вызываем handleEndCall автоматически - это может быть переподключение
                        // LiveKit сам попытается переподключиться
                        // Завершаем звонок только если это явное отключение (reason === DisconnectReason.CLIENT_INITIATED)
                        // reason: 2 обычно означает CLIENT_INITIATED или что-то подобное
                        // Проверяем, не было ли это инициировано пользователем
                    }}
                    onError={(error) => {
                        console.error('❌ [LIVEKIT] Room error:', {
                            error,
                            message: error?.message,
                            name: error?.name,
                            stack: error?.stack
                        });

                        // ✅ Игнорируем определенные ошибки, которые не критичны
                        const errorMessage = error?.message || '';
                        const ignoredErrors = [
                            'Client initiated disconnect',
                            'could not establish pc connection', // Может быть временная проблема сети
                            'publishing rejected as engine not connected within timeout', // Может быть временная проблема
                        ];

                        const shouldIgnore = ignoredErrors.some(ignored =>
                            errorMessage.toLowerCase().includes(ignored.toLowerCase())
                        );

                        if (!shouldIgnore) {
                            console.error('❌ [LIVEKIT] Critical error, ending call');
                            handleEndCall();
                        } else {
                            console.warn('⚠️ [LIVEKIT] Ignoring non-critical error:', errorMessage);
                        }
                    }}
                >
                    <CallOverlay callType={callType} remoteUserId={remoteUserId} />
                    <RoomAudioRenderer />
                </LiveKitRoom>
            )}
        </div>
    );
};

export const CallWrapperWidget: FC<ICallWrapperWidgetProps> = ({
    children,
}) => {
    return (
        <CallWrapperWidgetContent>
            {children}
        </CallWrapperWidgetContent>
    );
};
