-- DropForeignKey
ALTER TABLE `tb_carteira` DROP FOREIGN KEY `tb_carteira_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tb_transacao` DROP FOREIGN KEY `tb_transacao_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tb_transacao` DROP FOREIGN KEY `tb_transacao_ibfk_2`;

-- AddForeignKey
ALTER TABLE `tb_carteira` ADD CONSTRAINT `tb_carteira_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuario`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tb_transacao` ADD CONSTRAINT `tb_transacao_ibfk_1` FOREIGN KEY (`id_origem`) REFERENCES `tb_carteira`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tb_transacao` ADD CONSTRAINT `tb_transacao_ibfk_2` FOREIGN KEY (`id_destino`) REFERENCES `tb_carteira`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
