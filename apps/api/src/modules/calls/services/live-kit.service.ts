import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';
import {
    AUTH_DEFAULT_TTL,
    EnumAuthTtlEnv,
} from '@/lib/auth/auth-token-lifetime.config';

@Injectable()
export class LiveKitService {
    constructor(private readonly configService: ConfigService) {}

    async generateToken(roomName: string, participantIdentity: string) {
        const at = new AccessToken(
            this.configService.get<string>('LIVEKIT_API_KEY'),
            this.configService.get<string>('LIVEKIT_API_SECRET'),
            {
                identity: participantIdentity,
                ttl:
                    this.configService.get<string>(
                        EnumAuthTtlEnv.LIVEKIT_CALL_TOKEN,
                    ) ?? AUTH_DEFAULT_TTL.LIVEKIT_CALL_TOKEN,
            },
        );

        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
        });

        return at.toJwt();
    }
}
