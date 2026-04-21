-- AlterTable
ALTER TABLE `messages` ADD COLUMN `sender_device_id` VARCHAR(255) NULL;

-- CreateIndex
CREATE INDEX `messages_sender_device_id_idx` ON `messages`(`sender_device_id`);

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_device_id_fkey` FOREIGN KEY (`sender_device_id`) REFERENCES `devices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
