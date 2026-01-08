import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CallEndDto {
    @IsString()
    toUserId: string;

    @IsOptional()
    @IsString()
    callId?: string;

    @IsOptional()
    @IsNumber()
    duration?: number;
}

