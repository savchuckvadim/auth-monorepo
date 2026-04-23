import { Injectable, Logger } from '@nestjs/common';
import { CreateIosLogDto } from './dto/create-ios-log.dto';

@Injectable()
export class MobileLogsService {
    private readonly logger = new Logger(MobileLogsService.name);

    ingestIosLog(dto: CreateIosLogDto): { success: true } {
        const payload = {
            level: dto.level,
            message: dto.message,
            scope: dto.scope ?? 'unknown',
            platform: dto.platform ?? 'ios',
            appVersion: dto.appVersion ?? 'unknown',
            deviceModel: dto.deviceModel ?? 'unknown',
            osVersion: dto.osVersion ?? 'unknown',
            tags: dto.tags ?? [],
            context: dto.context ?? {},
        };

        this.logger.log(`ios-log ${JSON.stringify(payload)}`);
        return { success: true };
    }
}
