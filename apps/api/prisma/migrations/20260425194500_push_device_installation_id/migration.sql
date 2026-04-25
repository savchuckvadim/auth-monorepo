-- AlterTable
ALTER TABLE `push_devices` ADD COLUMN `installation_id` VARCHAR(128) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `push_devices_user_installation_uidx` ON `push_devices`(`user_id`, `installation_id`);
