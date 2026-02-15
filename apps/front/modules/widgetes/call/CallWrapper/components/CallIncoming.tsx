import { useUser } from "@/modules/entities/user/lib/hook/user.hook";
import { useGlobalCallContext } from "@/modules/features";
import { Avatar } from "@/modules/shared";
import { Button } from "@workspace/ui/components/button";
import { Phone, PhoneOff } from "lucide-react";


export const CallIncoming = () => {
    const { callType, incomingCallFromUserId, acceptCall, rejectCall } = useGlobalCallContext();

    const { user } = useUser(incomingCallFromUserId || '');
    console.log('🔍 [CALL INCOMING] user', user);
  
    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col gap-4 items-center">
                <div className="text-white text-xl font-semibold">
                    <p className="text-foreground font-semibold mb-10">
                        Входящий {callType === 'VIDEO' ? 'видео' : 'аудио'} звонок
                    </p>
                    {user && (
                        <div className="text-sm flex items-center flex-col gap-2 mt-2">
                            <Avatar src={user.avatarUrl || '/logo.svg'} name={user.name} size="lg" />
                            <p className="text-sm text-primary font-semibold mt-2">{user.name}</p>
                        </div>
                    )}
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

    )

}
