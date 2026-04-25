-- AlterTable
ALTER TABLE `messages` ADD COLUMN `likes_count` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `message_likes` (
    `id` VARCHAR(191) NOT NULL,
    `message_id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `message_likes_message_id_idx`(`message_id`),
    INDEX `message_likes_user_id_idx`(`user_id`),
    UNIQUE INDEX `message_likes_message_id_user_id_key`(`message_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `message_likes` ADD CONSTRAINT `message_likes_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message_likes` ADD CONSTRAINT `message_likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
