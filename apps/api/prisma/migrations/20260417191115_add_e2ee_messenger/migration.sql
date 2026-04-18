-- AlterTable
ALTER TABLE `chats` ADD COLUMN `encryption_mode` ENUM('NONE', 'SIGNAL') NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE `messages` ADD COLUMN `is_encrypted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `registration_id` INTEGER NULL,
    ADD COLUMN `signal_message_type` VARCHAR(50) NULL,
    ADD COLUMN `to_device_id` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `devices` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `client_device_id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `type` VARCHAR(50) NOT NULL,
    `registration_id` INTEGER NOT NULL,
    `identity_key` TEXT NOT NULL,
    `signed_pre_key` TEXT NOT NULL,
    `signed_pre_key_sig` TEXT NOT NULL,
    `signed_pre_key_expiry` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `last_seen_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `devices_client_device_id_key`(`client_device_id`),
    INDEX `devices_user_id_idx`(`user_id`),
    INDEX `devices_client_device_id_idx`(`client_device_id`),
    UNIQUE INDEX `devices_user_id_client_device_id_key`(`user_id`, `client_device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prekeys` (
    `id` VARCHAR(191) NOT NULL,
    `device_id` VARCHAR(255) NOT NULL,
    `key_id` INTEGER NOT NULL,
    `public_key` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `prekeys_device_id_idx`(`device_id`),
    UNIQUE INDEX `prekeys_device_id_key_id_key`(`device_id`, `key_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `one_time_prekeys` (
    `id` VARCHAR(191) NOT NULL,
    `device_id` VARCHAR(255) NOT NULL,
    `key_id` INTEGER NOT NULL,
    `public_key` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `used_at` DATETIME(3) NULL,

    INDEX `one_time_prekeys_device_id_idx`(`device_id`),
    INDEX `one_time_prekeys_used_at_idx`(`used_at`),
    UNIQUE INDEX `one_time_prekeys_device_id_key_id_key`(`device_id`, `key_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `chats_encryption_mode_idx` ON `chats`(`encryption_mode`);

-- CreateIndex
CREATE INDEX `messages_is_encrypted_idx` ON `messages`(`is_encrypted`);

-- CreateIndex
CREATE INDEX `messages_to_device_id_idx` ON `messages`(`to_device_id`);

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_to_device_id_fkey` FOREIGN KEY (`to_device_id`) REFERENCES `devices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prekeys` ADD CONSTRAINT `prekeys_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `one_time_prekeys` ADD CONSTRAINT `one_time_prekeys_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
