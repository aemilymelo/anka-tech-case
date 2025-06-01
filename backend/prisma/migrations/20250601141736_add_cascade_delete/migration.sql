-- DropForeignKey
ALTER TABLE `Ativo` DROP FOREIGN KEY `Ativo_clienteId_fkey`;

-- DropIndex
DROP INDEX `Ativo_clienteId_fkey` ON `Ativo`;

-- AddForeignKey
ALTER TABLE `Ativo` ADD CONSTRAINT `Ativo_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
