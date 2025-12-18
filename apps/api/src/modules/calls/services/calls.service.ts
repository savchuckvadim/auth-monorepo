import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core';
import { CallType, CallStatus } from 'generated/prisma';

@Injectable()
export class CallsService {
    constructor(private readonly prisma: PrismaService) { }

    async createCall(data: {
        chatId: string;
        initiatorId: string;
        receiverId?: string;
        type: CallType;
    }) {
        return this.prisma.call.create({
            data: {
                chatId: data.chatId,
                initiatorId: data.initiatorId,
                receiverId: data.receiverId,
                type: data.type,
                status: CallStatus.INITIATED,
            },
        });
    }

    async updateCallStatus(callId: string, status: CallStatus, startedAt?: Date) {
        return this.prisma.call.update({
            where: { id: callId },
            data: {
                status,
                startedAt,
            },
        });
    }

    async endCall(callId: string, duration?: number) {
        return this.prisma.call.update({
            where: { id: callId },
            data: {
                status: CallStatus.ENDED,
                endedAt: new Date(),
                duration,
            },
        });
    }
}

