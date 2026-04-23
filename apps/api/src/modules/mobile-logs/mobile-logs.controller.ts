import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateIosLogDto } from './dto/create-ios-log.dto';
import { MobileLogsService } from './mobile-logs.service';

@ApiTags('Mobile Logs')
@Controller('mobile-logs')
export class MobileLogsController {
    constructor(private readonly service: MobileLogsService) {}

    @Post('ios')
    @ApiOperation({
        summary: 'Ingest logs from iOS app',
    })
    @ApiBody({ type: CreateIosLogDto })
    @ApiOkResponse({
        schema: { properties: { success: { type: 'boolean' } } },
    })
    ingestIosLog(@Body() dto: CreateIosLogDto) {
        return this.service.ingestIosLog(dto);
    }
}
