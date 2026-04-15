import { IsString } from 'class-validator';

export class CallInitiatedDto {
    @IsString()
    toUserId: string;
}
