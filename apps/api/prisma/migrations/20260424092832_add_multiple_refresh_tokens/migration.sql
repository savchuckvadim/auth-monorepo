-- Prepare data: drop rows that would break the upcoming UNIQUE(refresh_token) constraint.
DELETE FROM `tokens` WHERE `refresh_token` IS NULL OR `refresh_token` = '';

DELETE t1 FROM `tokens` t1
INNER JOIN `tokens` t2
    ON t1.`refresh_token` = t2.`refresh_token`
   AND t1.`id` < t2.`id`;

-- AlterTable: add new columns. `expires_at` is added nullable first so we can backfill it.
ALTER TABLE `tokens`
    ADD COLUMN `device_id` VARCHAR(255) NULL,
    ADD COLUMN `expires_at` DATETIME(3) NULL,
    ADD COLUMN `ip_address` VARCHAR(45) NULL,
    ADD COLUMN `user_agent` VARCHAR(500) NULL,
    MODIFY `refresh_token` VARCHAR(512) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- Backfill: existing tokens live for 30 more days from their creation.
UPDATE `tokens`
SET `expires_at` = DATE_ADD(IFNULL(`createdAt`, CURRENT_TIMESTAMP(3)), INTERVAL 30 DAY)
WHERE `expires_at` IS NULL;

ALTER TABLE `tokens` MODIFY `expires_at` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tokens_refresh_token_key` ON `tokens`(`refresh_token`);

-- CreateIndex
CREATE INDEX `tokens_expires_at_idx` ON `tokens`(`expires_at`);

-- RenameIndex
ALTER TABLE `tokens` RENAME INDEX `tokens_user_id_fkey` TO `tokens_user_id_idx`;
