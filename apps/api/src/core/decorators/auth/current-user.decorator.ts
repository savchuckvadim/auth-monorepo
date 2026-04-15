// src/core/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext): unknown => {
        const request = ctx.switchToHttp().getRequest<{
            user?: Record<string, unknown>;
        }>();
        const user = request.user;

        if (!data) {
            return user;
        }

        return user?.[data];
    },
);
