-- CreateTable
CREATE TABLE `message_attachments` (
    `id` VARCHAR(191) NOT NULL,
    `message_id` VARCHAR(255) NULL,
    `uploader_id` VARCHAR(255) NOT NULL,
    `kind` ENUM('IMAGE', 'VIDEO', 'AUDIO', 'VOICE', 'CIRCLE', 'FILE', 'POST_SHARE', 'FORWARD_SNAPSHOT') NOT NULL,
    `url` VARCHAR(500) NULL,
    `name` VARCHAR(255) NULL,
    `size` INTEGER NULL,
    `mime_type` VARCHAR(100) NULL,
    `duration_ms` INTEGER NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `thumbnail_url` VARCHAR(500) NULL,
    `metadata` JSON NULL,
    `post_id` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `message_attachments_message_id_idx`(`message_id`),
    INDEX `message_attachments_uploader_id_idx`(`uploader_id`),
    INDEX `message_attachments_post_id_idx`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `message_attachments` ADD CONSTRAINT `message_attachments_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
