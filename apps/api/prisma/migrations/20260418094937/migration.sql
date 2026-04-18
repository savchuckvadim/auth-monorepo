-- AlterTable
ALTER TABLE `chats` ADD COLUMN `disappearing_message_seconds` INTEGER NULL,
    ADD COLUMN `scheduled_deletion_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `messages` ADD COLUMN `expires_at` DATETIME(3) NULL;
