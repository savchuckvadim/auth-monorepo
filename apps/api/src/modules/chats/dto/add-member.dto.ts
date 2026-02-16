import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ChatMemberRole } from 'generated/prisma';

export class AddMemberDto {
    @IsUUID('4')
    userId: string;

    @IsOptional()
    @IsEnum(ChatMemberRole)
    role?: ChatMemberRole;
}

