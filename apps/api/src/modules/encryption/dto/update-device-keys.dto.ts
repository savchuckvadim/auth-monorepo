import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PreKeyItemDto } from './register-device.dto';

export class UpdateDeviceKeysDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100_000)
    signedPreKey?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100_000)
    signedPreKeySig?: string;

    @ApiProperty({ type: [PreKeyItemDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PreKeyItemDto)
    preKeys?: PreKeyItemDto[];

    @ApiProperty({ type: [PreKeyItemDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PreKeyItemDto)
    oneTimePreKeys?: PreKeyItemDto[];
}

export class UploadOneTimePreKeysDto {
    @ApiProperty({ type: () => [PreKeyItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PreKeyItemDto)
    oneTimePreKeys: PreKeyItemDto[];
}
