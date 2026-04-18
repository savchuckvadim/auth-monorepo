import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { TokenPayloadDto } from '@/modules/token/token.dto';
import { EncryptionService } from './encryption.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import {
    UpdateDeviceKeysDto,
    UploadOneTimePreKeysDto,
} from './dto/update-device-keys.dto';
import { EncryptionRateLimitGuard } from './guards/encryption-rate-limit.guard';
import { RegisterDeviceResponseDto } from './dto/register-device-response.dto';

@ApiTags('Encryption')
@Controller('encryption')
@UseGuards(AccessTokenGuard, EncryptionRateLimitGuard)
export class EncryptionController {
    constructor(private readonly encryptionService: EncryptionService) {}

    @Post('devices/register')
    @ApiOperation({ summary: 'Register Signal device (prekeys)' })
    @ApiOkResponse({ type: RegisterDeviceResponseDto })
    async register(
        @CurrentUser() user: TokenPayloadDto,
        @Body() dto: RegisterDeviceDto,
    ) {
        return this.encryptionService.registerDevice(user.userId, dto);
    }

    @Get('devices/me')
    @ApiOperation({ summary: 'List my devices' })
    async listMine(@CurrentUser() user: TokenPayloadDto) {
        return this.encryptionService.listMyDevices(user.userId);
    }

    @Delete('devices/:clientDeviceId')
    @ApiOperation({ summary: 'Delete device by client device id' })
    async delete(
        @CurrentUser() user: TokenPayloadDto,
        @Param('clientDeviceId') clientDeviceId: string,
    ) {
        return this.encryptionService.deleteDevice(user.userId, clientDeviceId);
    }

    @Put('devices/:clientDeviceId/keys')
    @ApiOperation({ summary: 'Update device public keys' })
    async updateKeys(
        @CurrentUser() user: TokenPayloadDto,
        @Param('clientDeviceId') clientDeviceId: string,
        @Body() dto: UpdateDeviceKeysDto,
    ) {
        return this.encryptionService.updateDeviceKeys(
            user.userId,
            clientDeviceId,
            dto,
        );
    }

    @Post('devices/:clientDeviceId/one-time-prekeys')
    @ApiOperation({ summary: 'Upload one-time prekeys' })
    async uploadOt(
        @CurrentUser() user: TokenPayloadDto,
        @Param('clientDeviceId') clientDeviceId: string,
        @Body() dto: UploadOneTimePreKeysDto,
    ) {
        return this.encryptionService.uploadOneTimePreKeys(
            user.userId,
            clientDeviceId,
            dto,
        );
    }

    @Get('devices/:clientDeviceId/one-time-prekeys/count')
    @ApiOperation({ summary: 'Count unused one-time prekeys' })
    async otCount(
        @CurrentUser() user: TokenPayloadDto,
        @Param('clientDeviceId') clientDeviceId: string,
    ) {
        return this.encryptionService.getOneTimePreKeyCount(
            user.userId,
            clientDeviceId,
        );
    }

    @Get('prekey-bundle/:userId')
    @ApiOperation({ summary: 'Prekey bundles for all devices of user' })
    async bundleForUser(
        @CurrentUser() user: TokenPayloadDto,
        @Param('userId') userId: string,
    ) {
        return this.encryptionService.getPreKeyBundlesForUser(
            userId,
            user.userId,
        );
    }

    @Get('prekey-bundle/:userId/:clientDeviceId')
    @ApiOperation({ summary: 'Prekey bundle for one device' })
    async bundleForDevice(
        @CurrentUser() user: TokenPayloadDto,
        @Param('userId') userId: string,
        @Param('clientDeviceId') clientDeviceId: string,
    ) {
        return this.encryptionService.getPreKeyBundleForDevice(
            userId,
            clientDeviceId,
            user.userId,
        );
    }

    @Get('users/:userId/fingerprint')
    @ApiOperation({ summary: 'Identity fingerprints (MITM check)' })
    async fingerprint(
        @CurrentUser() user: TokenPayloadDto,
        @Param('userId') userId: string,
    ) {
        void user;
        return this.encryptionService.getFingerprints(userId);
    }
}
