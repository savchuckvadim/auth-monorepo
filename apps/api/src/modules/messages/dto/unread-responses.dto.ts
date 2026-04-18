import { ApiProperty } from '@nestjs/swagger';

export class UnreadTotalResponseDto {
    @ApiProperty({
        example: 3,
        description: 'Total unread messages across all chats',
    })
    total: number;
}

export class UnreadCountResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Unread messages in this chat',
    })
    count: number;
}
