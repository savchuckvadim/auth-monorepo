import { Body, Controller, Post } from "@nestjs/common";
import { LiveKitService } from "../services/live-kit.service";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiBody, ApiOperation, ApiProperty, ApiResponse } from "@nestjs/swagger";


export class GetTokenDto {

    @ApiProperty({ description: 'Room name', example: 'room1' })
    @IsString()
    @IsNotEmpty()
    roomName: string;

    @ApiProperty({ description: 'User id', example: '1' })
    @IsString()
    @IsNotEmpty()
    userId: string;
}


export class CallTokenDto {
    @ApiProperty({ description: 'Token', example: 'token123' })
    @IsString()
    @IsNotEmpty()
    token: string;
}
@Controller('calls')
export class CallsController {
    constructor(private readonly liveKitService: LiveKitService) { }


    @ApiOperation({ summary: 'Get token' })
    @ApiResponse({ status: 200, type: CallTokenDto })
    @ApiBody({ type: GetTokenDto })
    @Post('token')
    async getToken(@Body() body: GetTokenDto) {
        const token = await this.liveKitService.generateToken(body.roomName, body.userId);
        return { token };
    }
}
