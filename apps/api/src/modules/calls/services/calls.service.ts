import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core';
import {
    CallType,
    CallStatus,
    CallEndedReason,
    ChatType,
} from 'generated/prisma';

@Injectable()
export class CallsService {
    constructor(private readonly prisma: PrismaService) {}

    async createCall(data: {
        chatId: string; // Обязательный - звонок всегда из чата
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

    async updateCallStatus(
        callId: string,
        status: CallStatus,
        startedAt?: Date,
    ) {
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

    async endCallWithReason(
        callId: string,
        endedReason: CallEndedReason,
        duration?: number,
    ): Promise<{
        id: string;
        type: CallType;
        status: CallStatus;
        startedAt: Date | null;
        endedAt: Date | null;
        duration: number | null;
        endedReason: CallEndedReason | null;
        createdAt: Date;
        chatId: string;
        initiatorId: string;
        receiverId: string | null;
    }> {
        return this.prisma.call.update({
            where: { id: callId },
            data: {
                status: CallStatus.ENDED,
                endedAt: new Date(),
                duration,
                endedReason,
            },
        });
    }

    async markMissed(callId: string) {
        return this.prisma.call.update({
            where: { id: callId },
            data: {
                status: CallStatus.MISSED,
                endedReason: CallEndedReason.MISSED,
                endedAt: new Date(),
            },
        });
    }

    async getCallById(callId: string): Promise<{
        chatId: string;
        status: CallStatus;
    } | null> {
        return this.prisma.call.findUnique({
            where: { id: callId },
            select: {
                chatId: true,
                status: true,
            },
        });
    }

    async isSecretChat(chatId: string): Promise<boolean> {
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
            select: { type: true },
        });
        return chat?.type === ChatType.SECRET;
    }

    async getChatCallHistory(chatId: string, userId: string) {
        const chat = await this.prisma.chat.findFirst({
            where: { id: chatId, members: { some: { userId } } },
            select: { id: true, type: true },
        });

        if (!chat || chat.type === ChatType.SECRET) {
            return [];
        }

        return this.prisma.call.findMany({
            where: { chatId },
            orderBy: { createdAt: 'desc' },
            include: {
                initiator: { select: { id: true, name: true } },
                receiver: { select: { id: true, name: true } },
            },
        });
    }
}
