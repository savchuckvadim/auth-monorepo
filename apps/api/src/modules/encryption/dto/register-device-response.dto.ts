import { ApiProperty } from '@nestjs/swagger';

export class RegisterDeviceResponseDto {
    @ApiProperty({ type: Boolean })
    success: boolean;

    @ApiProperty({ description: 'Server Device.id', type: String })
    id: string;

    @ApiProperty({ type: String })
    clientDeviceId: string;
}
