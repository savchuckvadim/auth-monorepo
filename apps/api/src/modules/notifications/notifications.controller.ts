import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
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

    @ApiOperation({
        summary: 'Remove a push device installation',
        description:
            'Hard-deletes the device row scoped to the current user. ' +
            'Mobile apps should call this on logout so the backend stops ' +
            'dispatching pushes to this installation immediately, instead of ' +
            'waiting for APNS/FCM to report the token as unregistered.',
    })
    @ApiParam({
        name: 'installationId',
        description:
            'PushDevice.id returned by POST /notifications/devices/register',
    })
    @ApiResponse({
        status: 200,
        schema: {
            properties: {
                success: { type: 'boolean' },
                deleted: { type: 'number' },
            },
        },
    })
    @Delete('devices/:installationId')
    async removePushDevice(
        @CurrentUser() user: TokenPayloadDto,
        @Param('installationId') installationId: string,
    ) {
        return this.notificationsService.removeDevice(
            user.userId,
            installationId,
        );
    }
}
