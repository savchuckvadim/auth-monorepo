/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { NotificationsService } from './notifications.service';
import { PushPlatform, PushProvider } from 'generated/prisma';

describe('NotificationsService', () => {
    const prisma = {
        pushDevice: {
            findUnique: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            updateMany: jest.fn(),
            findMany: jest.fn(),
        },
    } as any;

    const service = new NotificationsService(prisma);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('creates device when token does not exist', async () => {
        prisma.pushDevice.findUnique.mockResolvedValue(null);
        prisma.pushDevice.create.mockResolvedValue({ id: 'dev1' });

        const result = await service.registerDevice('u1', {
            platform: PushPlatform.ANDROID,
            provider: PushProvider.FCM,
            token: 't1',
        });

        expect(prisma.pushDevice.create).toHaveBeenCalled();
        expect(result).toEqual({ id: 'dev1' });
    });

    it('updates device when token exists', async () => {
        prisma.pushDevice.findUnique.mockResolvedValue({
            id: 'dev1',
            token: 't1',
        });
        prisma.pushDevice.update.mockResolvedValue({ id: 'dev1', token: 't1' });

        const result = await service.registerDevice('u1', {
            platform: PushPlatform.IOS,
            provider: PushProvider.APNS,
            token: 't1',
            voipToken: 'v1',
        });

        expect(prisma.pushDevice.update).toHaveBeenCalled();
        expect(result).toEqual({ id: 'dev1', token: 't1' });
    });

    it('deactivates token for user', async () => {
        prisma.pushDevice.updateMany.mockResolvedValue({ count: 1 });

        const result = await service.deactivateDevice('u1', 't1');

        expect(prisma.pushDevice.updateMany).toHaveBeenCalledWith({
            where: { userId: 'u1', token: 't1', isActive: true },
            data: { isActive: false },
        });
        expect(result).toEqual({ success: true });
    });
});
