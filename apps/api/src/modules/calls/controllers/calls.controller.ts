import { Body, Controller, Post } from "@nestjs/common";
import { LiveKitService } from "../services/live-kit.service";

@Controller('calls')
export class CallsController {
    constructor(private readonly liveKitService: LiveKitService) { }

    @Post('token')
    async getToken(@Body() body: { roomName: string; userId: string }) {
        const token = await this.liveKitService.generateToken(body.roomName, body.userId);
        return { token };
    }
}
