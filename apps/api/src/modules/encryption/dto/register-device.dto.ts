import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PreKeyItemDto {
    @ApiProperty({ type: Number })
    @IsInt()
    keyId: number;

    @ApiProperty({ type: String })
    @IsString()
    @MaxLength(100_000)
    publicKey: string;
}

export class RegisterDeviceDto {
    @ApiProperty({ description: 'UUID v4 from client', type: String })
    @IsString()
    @MaxLength(255)
    clientDeviceId: string;

    @ApiProperty({ required: false, type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @ApiProperty({ example: 'web', type: String })
    @IsString()
    @MaxLength(50)
    type: string;

    @ApiProperty({ type: Number })
    @IsInt()
    registrationId: number;

    @ApiProperty({ type: String })
    @IsString()
    @MaxLength(100_000)
    identityKey: string;

    @ApiProperty({ type: String })
    @IsString()
    @MaxLength(100_000)
    signedPreKey: string;

    @ApiProperty({ type: String })
    @IsString()
    @MaxLength(100_000)
    signedPreKeySig: string;

    @ApiProperty({ type: [PreKeyItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PreKeyItemDto)
    preKeys: PreKeyItemDto[];

    @ApiProperty({ type: [PreKeyItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PreKeyItemDto)
    oneTimePreKeys: PreKeyItemDto[];
}
