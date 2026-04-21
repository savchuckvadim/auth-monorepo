/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { CallsService } from './calls.service';
import {
    CallEndedReason,
    CallStatus,
    CallType,
    ChatType,
} from 'generated/prisma';

describe('CallsService', () => {
    const prisma = {
        call: {
            create: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
        chat: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
        },
    } as any;

    const service = new CallsService(prisma);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('creates call with initiated status', async () => {
        prisma.call.create.mockResolvedValue({ id: 'c1' });

        const result = await service.createCall({
            chatId: 'chat1',
            initiatorId: 'u1',
            receiverId: 'u2',
            type: CallType.AUDIO,
        });

        expect(prisma.call.create).toHaveBeenCalledWith({
            data: {
                chatId: 'chat1',
                initiatorId: 'u1',
                receiverId: 'u2',
                type: CallType.AUDIO,
                status: CallStatus.INITIATED,
            },
        });
        expect(result).toEqual({ id: 'c1' });
    });

    it('marks call ended with reason', async () => {
        prisma.call.update.mockResolvedValue({ id: 'c1' });

        await service.endCallWithReason('c1', CallEndedReason.MISSED, 12);

        expect(prisma.call.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'c1' },
                data: expect.objectContaining({
                    status: CallStatus.ENDED,
                    endedReason: CallEndedReason.MISSED,
                    duration: 12,
                }),
            }),
        );
    });

    it('returns empty history for secret chats', async () => {
        prisma.chat.findFirst.mockResolvedValue({
            id: 'chat1',
            type: ChatType.SECRET,
        });

        const result = await service.getChatCallHistory('chat1', 'u1');

        expect(result).toEqual([]);
    });
});
