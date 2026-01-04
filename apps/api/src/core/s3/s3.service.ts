import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
    private s3: S3Client | null = null;
    private bucket: string;
    private region: string;

    constructor() {
        // Проверяем наличие необходимых переменных окружения
        const region = process.env.AWS_REGION;
        const accessKeyId = process.env.AWS_ACCESS_KEY;
        const secretAccessKey = process.env.AWS_SECRET_KEY;
        const bucket = process.env.AWS_BUCKET_NAME;

        if (!region || !accessKeyId || !secretAccessKey || !bucket) {
            console.warn('⚠️ AWS S3 credentials not configured. File uploads will fail.');
            console.warn('Required environment variables: AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME');
            return;
        }

        this.bucket = bucket;
        this.region = region;

        try {
            this.s3 = new S3Client({
                region: region,
                credentials: {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                },
                followRegionRedirects: true, // Автоматически следовать редиректам регионов
            });
        } catch (error) {
            console.error('❌ Failed to initialize S3 client:', error);
        }
    }

    private validateS3Config(): void {
        if (!this.s3 || !this.bucket || !this.region) {
            throw new BadRequestException(
                'S3 storage is not configured. Please set AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY, and AWS_BUCKET_NAME environment variables.'
            );
        }
    }

    /**
     * Загружает файл в S3
     * @param file - файл из multer
     * @param folder - папка для организации файлов (например, 'avatars', 'hero', 'posts')
     * @returns URL загруженного файла
     */
    async uploadFile(file: Express.Multer.File, folder?: string): Promise<{ url: string }> {
        this.validateS3Config();

        // Генерируем уникальное имя файла
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${randomUUID()}.${fileExtension}`;
        const key = folder ? `${folder}/${fileName}` : fileName;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3!.send(command);

        // Формируем URL - используем правильный регион из конфигурации
        // Если бакет в другом регионе, SDK автоматически перенаправит, но URL нужно формировать правильно
        const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
        return { url };
    }

    /**
     * Загружает аватар пользователя
     */
    async uploadAvatar(file: Express.Multer.File, userId: string): Promise<{ url: string }> {
        this.validateS3Config();

        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${userId}-${randomUUID()}.${fileExtension}`;
        const key = `avatars/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3!.send(command);

        // Формируем URL с правильным регионом
        const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
        return { url };
    }

    /**
     * Загружает hero изображение пользователя
     */
    async uploadHero(file: Express.Multer.File, userId: string): Promise<{ url: string }> {
        this.validateS3Config();

        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${userId}-${randomUUID()}.${fileExtension}`;
        const key = `hero/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3!.send(command);

        // Формируем URL с правильным регионом
        const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
        return { url };
    }

    /**
     * Загружает медиа файл для поста (изображение или видео)
     */
    async uploadPostMedia(file: Express.Multer.File, userId: string): Promise<{ url: string }> {
        this.validateS3Config();

        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${userId}-${randomUUID()}.${fileExtension}`;
        const folder = file.mimetype.startsWith('video/') ? 'posts/videos' : 'posts/images';
        const key = `${folder}/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3!.send(command);

        // Формируем URL с правильным регионом
        const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
        return { url };
    }
}
