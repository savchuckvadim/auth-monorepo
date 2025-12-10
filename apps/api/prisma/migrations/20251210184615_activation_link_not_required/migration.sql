/*
  Warnings:

  - A unique constraint covering the columns `[activationLink]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `users_activation_link_unique` ON `users`(`activationLink`);
