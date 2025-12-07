import { Body, Controller, Get, Post, Res, Param, NotFoundException } from '@nestjs/common';
import { MailService } from './mail.service';
import { Response } from 'express';
import { StorageService, StorageType } from '@/core/storage';
import * as fs from 'fs';

import { ApiBody, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { SuccessResponseDto } from '@/core';
import { EmailTemplate, SendEmailOfferRequestDto, SendEmailRequestDto } from './mail.dto';


@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService,
        private readonly storageService: StorageService
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
