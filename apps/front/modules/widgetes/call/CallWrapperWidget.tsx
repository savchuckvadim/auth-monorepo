import { VideoPlayer } from "@/modules/features/video-call";
import { CallControls } from "./CallControls";
import { CallProvider, useCallContext } from "@/modules/features/call/lib/context/call-context";
import { FC, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Phone, PhoneOff } from "lucide-react";

interface ICallWrapperWidgetProps {
    chatId: string;
    otherUserId: string;
    children: React.ReactNode;
}

const CallWrapperWidgetContent: FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const call = useCallContext();

    const {
        isInCall,
        callType,
        myStream,
        remoteStream,

        isAudioMute,
        isVideoOnHold,

        handleToggleAudio,
        handleToggleVideo,
        handleEndCall,
        isIncomingCall,
        acceptCall,
        rejectCall,
    } = call;

    // Логирование деструктурированных значений
    useEffect(() => {
        console.log('🔍 [CALL WRAPPER] Destructured values changed', {
            isInCall,
            callType,
            hasMyStream: !!myStream,
            hasRemoteStream: !!remoteStream,
            callObjectKeys: Object.keys(call),
            callIsInCall: call.isInCall,
            callCallType: call.callType
        });
    }, [isInCall, callType, myStream, remoteStream, call]);

    useEffect(() => {
        console.log('📊 [CALL WRAPPER] State update', {
            isInCall,
            callType,
            hasMyStream: !!myStream,
            myStreamId: myStream?.id,
            hasRemoteStream: !!remoteStream,
            remoteStreamId: remoteStream?.id,
            myStreamVideoTracks: myStream?.getVideoTracks().length || 0,
            myStreamAudioTracks: myStream?.getAudioTracks().length || 0,
            remoteStreamVideoTracks: remoteStream?.getVideoTracks().length || 0,
            remoteStreamAudioTracks: remoteStream?.getAudioTracks().length || 0,
            // Критичные значения для отображения
            willShowOverlay: isInCall,
            willShowVideoInOverlay: isInCall && callType === 'VIDEO',
            hasMyStreamForVideo: !!myStream && myStream.getVideoTracks().length > 0
        });
    }, [isInCall, callType, myStream, remoteStream]);

    useEffect(() => {
        if (remoteStream && isInCall) {
            console.log('✅ [CALL WRAPPER] Call established!', {
                hasMyStream: !!myStream,
                hasRemoteStream: !!remoteStream,
                myStreamActive: myStream?.active,
                remoteStreamActive: remoteStream?.active
            });
        }
    }, [remoteStream, isInCall, myStream]);

    // Отдельные эффекты для отслеживания изменений критичных значений
    useEffect(() => {
        console.log('🔄 [CALL WRAPPER] isInCall changed', {
            isInCall,
            callType,
            hasMyStream: !!myStream,
            willShowOverlay: isInCall,
            willShowVideo: isInCall && callType === 'VIDEO'
        });
    }, [isInCall]);

    useEffect(() => {
        console.log('🔄 [CALL WRAPPER] callType changed', {
            callType,
            isInCall,
            willShowVideo: isInCall && callType === 'VIDEO'
        });
    }, [callType]);


    // Логирование перед рендером
    console.log('🎨 [CALL WRAPPER] Render', {
        isInCall,
        callType,
        hasMyStream: !!myStream,
        hasRemoteStream: !!remoteStream,
        willShowOverlay: isInCall,
        willShowVideoInOverlay: isInCall && callType === 'VIDEO',
        myStreamVideoTracks: myStream?.getVideoTracks().length || 0
    });

    return (
        <div className="w-screen">

            {children}

            {/* Incoming call overlay */}
            {(() => {
                console.log('🔔 [CALL WRAPPER] Checking incoming call UI', {
                    isIncomingCall,
                    callType,
                    hasAcceptCall: typeof acceptCall === 'function',
                    hasRejectCall: typeof rejectCall === 'function'
                });
                return isIncomingCall && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="flex flex-col gap-4 items-center">
                            <div className="text-white text-xl font-semibold">
                                Входящий {callType === 'VIDEO' ? 'видео' : 'аудио'} звонок
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => {
                                        console.log('✅ [CALL WRAPPER] Accept button clicked');
                                        acceptCall();
                                    }}
                                    size="lg"
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Phone className="h-5 w-5 mr-2" />
                                    Принять
                                </Button>
                                <Button
                                    onClick={() => {
                                        console.log('❌ [CALL WRAPPER] Reject button clicked');
                                        rejectCall();
                                    }}
                                    size="lg"
                                    variant="destructive"
                                >
                                    <PhoneOff className="h-5 w-5 mr-2" />
                                    Отклонить
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Outgoing call waiting overlay - показываем когда звонок инициирован, но еще не принят */}
            {isInCall && !remoteStream && !isIncomingCall && (() => {
                console.log('📞 [CALL WRAPPER] Rendering outgoing call waiting overlay', {
                    isInCall,
                    hasMyStream: !!myStream,
                    hasRemoteStream: !!remoteStream,
                    isIncomingCall
                });
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="flex flex-col gap-4 items-center">
                            <div className="text-white text-xl font-semibold">
                                Звонок {callType === 'VIDEO' ? 'видео' : 'аудио'}...
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => {
                                        console.log('🛑 [CALL WRAPPER] Cancel call button clicked');
                                        handleEndCall();
                                    }}
                                    size="lg"
                                    variant="destructive"
                                >
                                    <PhoneOff className="h-5 w-5 mr-2" />
                                    Отменить вызов
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* overlay */}
            {isInCall && remoteStream && (() => {
                console.log('🎬 [CALL WRAPPER] Rendering overlay', {
                    isInCall,
                    callType,
                    hasMyStream: !!myStream,
                    hasRemoteStream: !!remoteStream,
                    myStreamVideoTracks: myStream?.getVideoTracks().length || 0,
                    willShowVideo: callType === 'VIDEO',
                    myStreamActive: myStream?.active
                });
                return (
                    <div className="fixed inset-0 z-50 bg-black">
                        {callType === 'VIDEO' && (() => {
                            console.log('🎥 [CALL WRAPPER] Rendering VIDEO in overlay', {
                                hasMyStream: !!myStream,
                                hasRemoteStream: !!remoteStream,
                                myStreamId: myStream?.id,
                                remoteStreamId: remoteStream?.id
                            });
                            return (
                                <div className="relative w-full h-full">
                                    {/* Большой экран - удаленное видео (на весь экран) */}
                                    <div className="absolute inset-0">
                                        <VideoPlayer
                                            stream={remoteStream}
                                            name=""
                                            className="w-full h-full rounded-none"
                                        />
                                    </div>

                                    {/* Маленький экран - локальное видео (справа внизу) */}
                                    {myStream && (
                                        <div className="absolute bottom-24 right-4 md:bottom-28 md:right-6 z-10">
                                            <VideoPlayer
                                                stream={myStream}
                                                name="You"
                                                isAudioMute
                                                className="w-28 h-36 sm:w-32 sm:h-44 md:w-56 md:h-72 rounded-lg border-2 border-white shadow-2xl"
                                            />
                                        </div>
                                    )}

                                    {/* Контролы внизу */}
                                    <div className="absolute bottom-0 left-0 right-0 pb-4 md:pb-6 flex justify-center z-20 px-4">
                                        <CallControls
                                            isAudioMute={isAudioMute}
                                            isVideoOnHold={isVideoOnHold}
                                            onToggleAudio={handleToggleAudio}
                                            onToggleVideo={handleToggleVideo}
                                            onEndCall={handleEndCall}
                                        />
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Для аудио звонков */}
                        {callType === 'AUDIO' && (
                            <div className="flex flex-col items-center justify-center h-full gap-8">
                                <div className="text-white text-2xl font-semibold">
                                    Аудио звонок
                                </div>
                                <CallControls
                                    isAudioMute={isAudioMute}
                                    isVideoOnHold={isVideoOnHold}
                                    onToggleAudio={handleToggleAudio}
                                    onToggleVideo={handleToggleVideo}
                                    onEndCall={handleEndCall}
                                />
                            </div>
                        )}
                    </div>
                );
            })()}
        </div>
    );
};

export const CallWrapperWidget: FC<ICallWrapperWidgetProps> = ({
    chatId,
    otherUserId,
    children,
}) => {
    return (
        <CallProvider chatId={chatId} otherUserId={otherUserId} defaultType="AUDIO">
            <CallWrapperWidgetContent>
                {children}
            </CallWrapperWidgetContent>
        </CallProvider>
    );
};
