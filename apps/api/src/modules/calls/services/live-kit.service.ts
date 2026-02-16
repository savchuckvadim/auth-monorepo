import { Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class LiveKitService {
    private readonly apiKey = process.env.LIVEKIT_API_KEY;
    private readonly apiSecret = process.env.LIVEKIT_API_SECRET;

    async generateToken(roomName: string, participantIdentity: string) {
        const at = new AccessToken(this.apiKey, this.apiSecret, {
            identity: participantIdentity,
        });

        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
        });

        return at.toJwt();
    }
}
