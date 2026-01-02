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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
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

            {/* overlay */}
            {isInCall && (() => {
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="flex flex-col gap-4">

                            {callType === 'VIDEO' && (() => {
                                console.log('🎥 [CALL WRAPPER] Rendering VIDEO in overlay', {
                                    hasMyStream: !!myStream,
                                    hasRemoteStream: !!remoteStream,
                                    myStreamId: myStream?.id,
                                    remoteStreamId: remoteStream?.id
                                });
                                return (
                                    <>
                                        <VideoPlayer
                                            stream={remoteStream}
                                            name="Remote"
                                            className="w-[600px] h-[400px]"
                                        />
                                        <VideoPlayer
                                            stream={myStream}
                                            name="You"
                                            isAudioMute
                                            className="w-[200px] h-[150px] absolute bottom-4 right-4"
                                        />
                                    </>
                                );
                            })()}

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
