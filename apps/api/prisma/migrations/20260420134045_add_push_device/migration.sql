-- AlterTable
ALTER TABLE `calls` ADD COLUMN `ended_reason` ENUM('ACCEPTED', 'REJECTED', 'MISSED', 'CANCELED', 'FAILED', 'TIMEOUT') NULL;

-- CreateTable
CREATE TABLE `push_devices` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `platform` ENUM('IOS', 'ANDROID', 'WEB') NOT NULL,
    `provider` ENUM('FCM', 'APNS', 'APNS_VOIP') NOT NULL,
    `token` VARCHAR(512) NOT NULL,
    `voip_token` VARCHAR(512) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_seen_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `push_devices_token_key`(`token`),
    INDEX `push_devices_user_id_is_active_idx`(`user_id`, `is_active`),
    INDEX `push_devices_platform_provider_idx`(`platform`, `provider`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `push_devices` ADD CONSTRAINT `push_devices_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
