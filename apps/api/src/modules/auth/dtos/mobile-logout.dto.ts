import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Body for `POST /auth-mobile/logout`.
 *
 * `installationId` is the `PushDevice.id` returned by
 * `POST /notifications/devices/register`. When provided, the backend hard-deletes
 * that push device row alongside revoking the refresh token, so further pushes
 * stop being dispatched immediately (no waiting for APNS/FCM to report the
 * token as unregistered).
 */
export class MobileLogoutDto {
    @ApiProperty({
        description: 'Refresh Token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;

    @ApiPropertyOptional({
        description:
            'PushDevice.id of the current installation (returned by /notifications/devices/register). ' +
            'When provided, the device row is deleted as part of the logout.',
        example: '3fbe2a6a-1234-4a3b-9c7e-1234567890ab',
    })
    @IsOptional()
    @IsString()
    installationId?: string;
}
