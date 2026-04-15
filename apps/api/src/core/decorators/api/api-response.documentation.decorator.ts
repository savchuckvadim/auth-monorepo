import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

type SwaggerDtoType = abstract new (...args: never[]) => unknown;

export const ApiSuccessResponse = (
    type: SwaggerDtoType,
    description = 'Успешный ответ',
) =>
    applyDecorators(
        ApiResponse({
            status: 200,
            description,
            schema: {
                allOf: [
                    { $ref: '#/components/schemas/SuccessResponseDto' },
                    {
                        properties: {
                            data: { $ref: `#/components/schemas/${type.name}` },
                        },
                    },
                ],
            },
        }),
    );

export const ApiErrorResponse = (
    status: number,
    type: SwaggerDtoType,
    description: string,
) =>
    applyDecorators(
        ApiResponse({
            status,
            description,
            type,
        }),
    );
