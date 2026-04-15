import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserPrismaRepository } from './repositories/user.prisma.repository';
import { TokenModule } from '../token';
import { UserAdminController } from './controllers/user.admin.controller';

@Module({
    imports: [TokenModule],
    controllers: [UserController, UserAdminController],
    providers: [
        UserService,
        {
            provide: UserRepository,
            useClass: UserPrismaRepository,
        },
    ],
    exports: [UserService],
})
export class UserModule {}
