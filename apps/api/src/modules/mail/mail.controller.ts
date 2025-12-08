import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';


import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponseDto } from '@/core';
import { SendEmailRequestDto } from './mail.dto';


@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService,

    ) { }

    @ApiOperation({ summary: 'Send email' })
    @ApiBody({ type: SendEmailRequestDto })
    @ApiResponse({
        status: 200, description: 'Email sent', type: SuccessResponseDto
    })
    @Post('send')
    async sendMail(@Body() dto: SendEmailRequestDto) {
        return await this.mailService.sendTestEmail(dto)

    }




}
