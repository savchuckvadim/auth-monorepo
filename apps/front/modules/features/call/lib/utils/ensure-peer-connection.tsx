import { PeerService } from "@/modules/shared";

export const ensurePeerConnection = (
    peerService: PeerService,
    myStream: MediaStream | null
) => {
    console.log('🔍 [ENSURE PEER] Checking peer connection', {
        hasPeer: !!peerService.connection,
        hasStream: !!myStream,
        streamId: myStream?.id
    });

    if (!peerService.connection) {
        console.log('🔄 [ENSURE PEER] Recreating peer connection');
        peerService.recreate();
        console.log('✅ [ENSURE PEER] Peer connection recreated', {
            hasPeer: !!peerService.connection
        });

        if (myStream) {
            console.log('🎵 [ENSURE PEER] Adding tracks to new peer connection', {
                tracksCount: myStream.getTracks().length,
                videoTracks: myStream.getVideoTracks().length,
                audioTracks: myStream.getAudioTracks().length
            });

            myStream.getTracks().forEach((track, index) => {
                console.log(`➕ [ENSURE PEER] Adding track ${index + 1}`, {
                    trackId: track.id,
                    trackKind: track.kind
                });
                peerService.addTrack(track, myStream);
            });

            const connection = peerService.connection;
            if (connection) {
                console.log('✅ [ENSURE PEER] All tracks added', {
                    totalSenders: (connection as RTCPeerConnection).getSenders().length
                });
            } else {
                console.log('✅ [ENSURE PEER] All tracks added (connection check)');
            }
        } else {
            console.log('⚠️ [ENSURE PEER] No stream provided to add tracks');
        }
    } else {
        console.log('✅ [ENSURE PEER] Peer connection already exists', {
            signalingState: peerService.connection.signalingState,
            connectionState: peerService.connection.connectionState
        });
    }
};
