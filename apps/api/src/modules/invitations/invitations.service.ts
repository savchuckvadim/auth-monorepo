import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core';
import { ChatsService } from '@/modules/chats/services/chats.service';
import { CreateChatDto } from '@/modules/chats/dto';
import {
    ChatEncryptionMode,
    ChatType,
    InvitationStatus,
    InvitationType,
} from 'generated/prisma';
import { InvitationDto } from './dto/invitation.dto';

@Injectable()
export class InvitationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly chatsService: ChatsService,
    ) {}

    async createSecretPrivateInvite(fromUserId: string, toUserId: string) {
        if (fromUserId === toUserId) {
            throw new BadRequestException('Cannot invite yourself');
        }
        const peer = await this.prisma.user.findUnique({
            where: { id: toUserId },
            select: { id: true },
        });
        if (!peer) {
            throw new NotFoundException('User not found');
        }
        const existing = await this.prisma.invitation.findFirst({
            where: {
                type: InvitationType.SECRET_PRIVATE,
                status: InvitationStatus.PENDING,
                fromUserId,
                toUserId,
            },
        });
        if (existing) {
            const from = await this.prisma.user.findUnique({
                where: { id: existing.fromUserId },
                select: { name: true },
            });
            return new InvitationDto(existing, from?.name);
        }
        const inv = await this.prisma.invitation.create({
            data: {
                type: InvitationType.SECRET_PRIVATE,
                status: InvitationStatus.PENDING,
                fromUserId,
                toUserId,
            },
        });
        const fromU = await this.prisma.user.findUnique({
            where: { id: fromUserId },
            select: { name: true },
        });
        return new InvitationDto(inv, fromU?.name);
    }

    async listIncoming(userId: string) {
        const rows = await this.prisma.invitation.findMany({
            where: { toUserId: userId, status: InvitationStatus.PENDING },
            orderBy: { createdAt: 'desc' },
            include: {
                fromUser: { select: { name: true } },
            },
        });
        return rows.map(
            ({ fromUser, ...rest }) =>
                new InvitationDto(rest, fromUser?.name ?? undefined),
        );
    }

    async listOutgoing(userId: string) {
        const rows = await this.prisma.invitation.findMany({
            where: { fromUserId: userId, status: InvitationStatus.PENDING },
            orderBy: { createdAt: 'desc' },
            include: {
                toUser: { select: { name: true } },
            },
        });
        return rows.map(
            ({ toUser, ...rest }) => new InvitationDto(rest, toUser?.name),
        );
    }

    async accept(invitationId: string, userId: string) {
        const inv = await this.prisma.invitation.findUnique({
            where: { id: invitationId },
        });
        if (!inv) throw new NotFoundException('Invitation not found');
        if (inv.toUserId !== userId) {
            throw new ForbiddenException('Not your invitation');
        }
        if (inv.status !== InvitationStatus.PENDING) {
            throw new BadRequestException('Invitation is not pending');
        }
        if (inv.type !== InvitationType.SECRET_PRIVATE) {
            throw new BadRequestException('Unsupported invitation type');
        }

        const body: CreateChatDto = {
            type: ChatType.PRIVATE,
            memberIds: [inv.fromUserId, inv.toUserId],
            name: '',
            description: '',
            encryptionMode: ChatEncryptionMode.SIGNAL,
        };
        const chat = await this.chatsService.createChat(userId, body);

        await this.prisma.invitation.update({
            where: { id: invitationId },
            data: {
                status: InvitationStatus.ACCEPTED,
                resolvedChatId: chat.id,
            },
        });

        const updated = await this.prisma.invitation.findUniqueOrThrow({
            where: { id: invitationId },
        });
        return { chat, invitation: new InvitationDto(updated) };
    }

    async reject(invitationId: string, userId: string) {
        const inv = await this.prisma.invitation.findUnique({
            where: { id: invitationId },
        });
        if (!inv) throw new NotFoundException('Invitation not found');
        if (inv.toUserId !== userId) {
            throw new ForbiddenException('Not your invitation');
        }
        if (inv.status !== InvitationStatus.PENDING) {
            throw new BadRequestException('Invitation is not pending');
        }
        const updated = await this.prisma.invitation.update({
            where: { id: invitationId },
            data: { status: InvitationStatus.REJECTED },
        });
        return new InvitationDto(updated);
    }
}
