import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '@/core/guards/access-token.guard';
import { CurrentUser } from '@/core/decorators/auth/current-user.decorator';
import { TokenPayloadDto } from '@/modules/token';
import { NotificationsService } from './notifications.service';
import { RegisterPushDeviceDto } from './dto/register-push-device.dto';
import { DeactivatePushDeviceDto } from './dto/deactivate-push-device.dto';
import { PushDeviceDto } from './dto/push-device.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(AccessTokenGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @ApiOperation({ summary: 'Register or refresh push device token' })
    @ApiBody({ type: RegisterPushDeviceDto })
    @ApiOkResponse({ type: PushDeviceDto })
    @Post('devices/register')
    async registerPushDevice(
        @CurrentUser() user: TokenPayloadDto,
        @Body() body: RegisterPushDeviceDto,
    ) {
        return this.notificationsService.registerDevice(user.userId, body);
    }

    @ApiOperation({ summary: 'Deactivate push device token' })
    @ApiBody({ type: DeactivatePushDeviceDto })
    @ApiResponse({
        status: 200,
        schema: { properties: { success: { type: 'boolean' } } },
    })
    @Post('devices/deactivate')
    async deactivatePushDevice(
        @CurrentUser() user: TokenPayloadDto,
        @Body() body: DeactivatePushDeviceDto,
    ) {
        return this.notificationsService.deactivateDevice(
            user.userId,
            body.token,
        );
    }

    @ApiOperation({ summary: 'Get active push devices for current user' })
    @ApiOkResponse({ type: [PushDeviceDto] })
    @Get('devices')
    async getDevices(@CurrentUser() user: TokenPayloadDto) {
        return this.notificationsService.getActiveDevicesForUser(user.userId);
    }
}
