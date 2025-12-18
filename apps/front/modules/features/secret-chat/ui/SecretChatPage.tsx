'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useAuth } from '@/modules/processes';
import { PeerService } from '@/lib/webrtc/peer-service';
import { connectCallsSocket, getCallsSocket } from '@/lib/socket/calls-socket';
import { VideoPlayer } from './VideoPlayer';
import { CallControls } from './CallControls';
import { Button } from '@workspace/ui/components/button';
import { Phone, Video, MessageSquare } from 'lucide-react';
import type {
    IncomingCallData,
    CallAcceptedData,
    PeerNegoNeededData,
    PeerNegoDoneData,
    CallEndData,
    CallInitiatedData,
} from '../lib/types/webrtc.types';

interface SecretChatPageProps {
    chatId: string;
    otherUserId: string;
    otherUserName: string;
    onClose?: () => void;
}

export const SecretChatPage: React.FC<SecretChatPageProps> = ({
    chatId,
    otherUserId,
    otherUserName,
    onClose,
}) => {
    const { currentUser } = useAuth();
    const [peerService] = useState(() => new PeerService());
    const [socket, setSocket] = useState<any>(null);

    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isAudioMute, setIsAudioMute] = useState(false);
    const [isVideoOnHold, setIsVideoOnHold] = useState(false);
    const [callButton, setCallButton] = useState(true);
    const [isInCall, setIsInCall] = useState(false);
    const [callType, setCallType] = useState<'VIDEO' | 'AUDIO'>('VIDEO');
    const [saveHistory, setSaveHistory] = useState(false);

    // Инициализация WebSocket
    useEffect(() => {
        if (!currentUser?.id) return;

        const callsSocket = connectCallsSocket(currentUser.id);
        setSocket(callsSocket);

        // Присоединяемся к комнате чата
        callsSocket.emit('room:join', { chatId }, (response: any) => {
            console.log('Room join response:', response);
            // Если в ответе есть информация о других пользователях в комнате
            if (response?.users) {
                const otherUser = response.users.find((u: any) => u.userId === otherUserId);
                if (otherUser?.socketId) {
                    setRemoteSocketId(otherUser.socketId);
                }
            }
        });

        // Слушаем событие о присоединении пользователя к комнате
        const handleUserJoined = (data: any) => {
            if (data.userId === otherUserId && data.socketId) {
                setRemoteSocketId(data.socketId);
            }
        };

        callsSocket.on('user:joined', handleUserJoined);

        return () => {
            callsSocket.off('user:joined', handleUserJoined);
            callsSocket.emit('room:leave', { chatId });
        };
    }, [currentUser?.id, chatId, otherUserId]);

    // Обработка входящего звонка
    const handleIncomingCall = useCallback(
        async ({ from, fromUserId, offer, type }: IncomingCallData) => {
            if (!socket || fromUserId !== otherUserId) return;

            // Пересоздаем peer connection если нужно
            if (!peerService.connection) {
                peerService.recreate();
            }

            setRemoteSocketId(from);
            setCallType(type || 'VIDEO');

            // Получаем медиа стрим
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: type === 'VIDEO',
            });
            setMyStream(stream);

            // Создаем answer
            const answer = await peerService.getAnswer(offer);
            socket.emit('call:accepted', { to: from, ans: answer });
            setIsInCall(true);
            setCallButton(false);
        },
        [socket, otherUserId, peerService]
    );

    // Отправка стримов
    const sendStreams = useCallback(() => {
        if (!myStream || !peerService.connection) return;

        for (const track of myStream.getTracks()) {
            peerService.addTrack(track, myStream);
        }
    }, [myStream, peerService]);

    // Обработка принятия звонка
    const handleCallAccepted = useCallback(
        ({ from, ans }: CallAcceptedData) => {
            peerService.setRemoteDescription(ans);
            sendStreams();
            setIsInCall(true);
        },
        [peerService, sendStreams]
    );

    // Обработка переговоров WebRTC
    const handleNegoNeededIncoming = useCallback(
        async ({ from, offer }: PeerNegoNeededData) => {
            if (!socket) return;

            const answer = await peerService.getAnswer(offer);
            socket.emit('peer:nego:done', { to: from, ans: answer });
        },
        [socket, peerService]
    );

    const handleNegoNeeded = useCallback(async () => {
        if (!socket || !remoteSocketId) return;

        const offer = await peerService.getOffer();
        socket.emit('peer:nego:needed', { offer, to: remoteSocketId });
    }, [remoteSocketId, socket, peerService]);

    const handleNegoFinal = useCallback(async ({ ans }: PeerNegoDoneData) => {
        await peerService.setRemoteDescription(ans);
    }, [peerService]);

    // Обработка завершения звонка
    const handleCallEnd = useCallback(
        ({ from }: CallEndData) => {
            if (from === remoteSocketId) {
                peerService.close();

                if (myStream) {
                    myStream.getTracks().forEach((track) => track.stop());
                    setMyStream(null);
                }

                setRemoteStream(null);
                setRemoteSocketId(null);
                setIsInCall(false);
                setCallButton(true);
            }
        },
        [remoteSocketId, myStream, peerService]
    );

    // Обработка инициации звонка
    const handleCallInitiated = useCallback(
        ({ from }: CallInitiatedData) => {
            if (from === remoteSocketId) {
                setCallButton(false);
            }
        },
        [remoteSocketId]
    );

    // WebRTC события
    useEffect(() => {
        const peer = peerService.connection;
        if (!peer) return;

        peer.addEventListener('negotiationneeded', handleNegoNeeded);

        return () => {
            peer.removeEventListener('negotiationneeded', handleNegoNeeded);
        };
    }, [handleNegoNeeded, peerService]);

    // Обработка получения треков
    useEffect(() => {
        const peer = peerService.connection;
        if (!peer) return;

        const handleTrack = async (ev: RTCTrackEvent) => {
            const remoteStream = ev.streams[0];
            if (remoteStream) {
                setRemoteStream(remoteStream);
            }
        };

        peer.addEventListener('track', handleTrack);

        return () => {
            peer.removeEventListener('track', handleTrack);
        };
    }, [peerService]);

    // Socket события
    useEffect(() => {
        if (!socket) return;

        socket.on('incoming:call', handleIncomingCall);
        socket.on('call:accepted', handleCallAccepted);
        socket.on('peer:nego:needed', handleNegoNeededIncoming);
        socket.on('peer:nego:done', handleNegoFinal);
        socket.on('call:end', handleCallEnd);
        socket.on('call:initiated', handleCallInitiated);

        return () => {
            socket.off('incoming:call', handleIncomingCall);
            socket.off('call:accepted', handleCallAccepted);
            socket.off('peer:nego:needed', handleNegoNeededIncoming);
            socket.off('peer:nego:done', handleNegoFinal);
            socket.off('call:end', handleCallEnd);
            socket.off('call:initiated', handleCallInitiated);
        };
    }, [
        socket,
        handleIncomingCall,
        handleCallAccepted,
        handleNegoNeededIncoming,
        handleNegoFinal,
        handleCallEnd,
        handleCallInitiated,
    ]);

    // Инициация звонка
    const handleCallUser = useCallback(
        async (type: 'VIDEO' | 'AUDIO') => {
            if (!socket) {
                console.warn('Socket not available');
                return;
            }

            // Бэкенд сам найдет socketId через OnlineUsersService по userId
            // remoteSocketId не обязателен для инициации звонка

            if (!peerService.connection) {
                peerService.recreate();
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: type === 'VIDEO',
            });

            if (isAudioMute) {
                const audioTracks = stream.getAudioTracks();
                audioTracks.forEach((track) => (track.enabled = false));
            }

            if (isVideoOnHold) {
                const videoTracks = stream.getVideoTracks();
                videoTracks.forEach((track) => (track.enabled = false));
            }

            const offer = await peerService.getOffer();

            console.log('Initiating call:', {
                toUserId: otherUserId,
                toSocketId: remoteSocketId,
                chatId,
                type,
            });

            socket.emit('user:call', {
                toSocketId: remoteSocketId || undefined, // Опционально, бэкенд найдет через userId
                toUserId: otherUserId,
                chatId,
                offer,
                type,
            }, (response: any) => {
                console.log('Call initiated response:', response);
                if (response?.error) {
                    console.error('Call initiation error:', response.error);
                    // Останавливаем стрим при ошибке
                    stream.getTracks().forEach((track) => track.stop());
                    setMyStream(null);
                    setCallButton(true);
                }
            });

            setMyStream(stream);
            setCallButton(false);
            setCallType(type);
        },
        [socket, remoteSocketId, otherUserId, chatId, isAudioMute, isVideoOnHold, peerService]
    );

    const handleToggleAudio = () => {
        peerService.toggleAudio();
        setIsAudioMute(!isAudioMute);
    };

    const handleToggleVideo = () => {
        peerService.toggleVideo();
        setIsVideoOnHold(!isVideoOnHold);
    };

    const handleEndCall = useCallback(() => {
        peerService.close();

        if (myStream) {
            myStream.getTracks().forEach((track) => track.stop());
            setMyStream(null);
        }

        setRemoteStream(null);
        setRemoteSocketId(null);
        setIsInCall(false);
        setCallButton(true);

        if (remoteSocketId && socket) {
            socket.emit('call:end', { to: remoteSocketId });
        }
    }, [myStream, remoteSocketId, socket, peerService]);

    const handleSaveHistory = () => {
        // TODO: Реализовать сохранение истории в localStorage
        console.log('Saving chat history...', { chatId, saveHistory });
        setSaveHistory(!saveHistory);
    };

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            peerService.close();
            if (myStream) {
                myStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [peerService, myStream]);

    return (
        <div className="flex flex-col h-screen w-full bg-background">
            {/* Заголовок */}
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <h2 className="text-lg font-semibold">Секретный чат</h2>
                    <p className="text-sm text-muted-foreground">{otherUserName}</p>
                </div>
                {onClose && (
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        Закрыть
                    </Button>
                )}
            </div>

            {/* Видео область */}
            <div className="flex-1 relative overflow-hidden">
                {remoteStream && (
                    <VideoPlayer
                        stream={remoteStream}
                        name={otherUserName}
                        className="absolute inset-0"
                    />
                )}
                {myStream && (
                    <div className="absolute bottom-4 right-4 w-48 h-36">
                        <VideoPlayer
                            stream={myStream}
                            name="Вы"
                            isAudioMute={isAudioMute}
                        />
                    </div>
                )}
            </div>

            {/* Кнопки управления */}
            <div className="p-4 border-t">
                {callButton && !isInCall && (
                    <div className="flex gap-2 justify-center">
                        <Button
                            onClick={() => handleCallUser('AUDIO')}
                            className="flex items-center gap-2"
                        >
                            <Phone className="h-4 w-4" />
                            Аудио звонок
                        </Button>
                        <Button
                            onClick={() => handleCallUser('VIDEO')}
                            className="flex items-center gap-2"
                        >
                            <Video className="h-4 w-4" />
                            Видео звонок
                        </Button>
                    </div>
                )}

                {isInCall && (myStream || remoteStream) && (
                    <CallControls
                        isAudioMute={isAudioMute}
                        isVideoOnHold={isVideoOnHold}
                        onToggleAudio={handleToggleAudio}
                        onToggleVideo={handleToggleVideo}
                        onEndCall={handleEndCall}
                        onSaveHistory={handleSaveHistory}
                        showSaveButton={true}
                    />
                )}
            </div>
        </div>
    );
};

