import { Prisma } from "generated/prisma";

export type ChatMemberWithUser =
    Prisma.ChatMemberGetPayload<{
        include: {
            user: {
                select: {
                    id: true;
                    name: true;
                    email: true;
                };
            };
        };
    }>;
