import { Module } from '@nestjs/common';
import { EncryptionController } from './encryption.controller';
import { EncryptionService } from './encryption.service';
import { PrismaModule } from '@/core/prisma';
import { TokenModule } from '@/modules/token/token.module';

@Module({
    imports: [PrismaModule, TokenModule],
    controllers: [EncryptionController],
    providers: [EncryptionService],
    exports: [EncryptionService],
})
export class EncryptionModule {}
