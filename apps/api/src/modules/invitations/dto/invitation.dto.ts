import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus, InvitationType } from 'generated/prisma';

export class InvitationDto {
    @ApiProperty()
    id: string;
    @ApiProperty({ enum: InvitationType })
    type: InvitationType;
    @ApiProperty({ enum: InvitationStatus })
    status: InvitationStatus;
    @ApiProperty()
    fromUserId: string;
    @ApiProperty()
    toUserId: string;
    @ApiProperty({ required: false })
    resolvedChatId?: string | null;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
    /** Other party name (sender for incoming, recipient for outgoing). */
    @ApiProperty({ required: false })
    counterpartyName?: string;

    constructor(
        row: {
            id: string;
            type: InvitationType;
            status: InvitationStatus;
            fromUserId: string;
            toUserId: string;
            resolvedChatId: string | null;
            createdAt: Date;
            updatedAt: Date;
        },
        counterpartyName?: string,
    ) {
        this.id = row.id;
        this.type = row.type;
        this.status = row.status;
        this.fromUserId = row.fromUserId;
        this.toUserId = row.toUserId;
        this.resolvedChatId = row.resolvedChatId;
        this.createdAt = row.createdAt;
        this.updatedAt = row.updatedAt;
        this.counterpartyName = counterpartyName;
    }
}
