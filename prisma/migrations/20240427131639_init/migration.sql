-- CreateTable
CREATE TABLE `tb_carteira` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `saldo` DOUBLE NULL,
    `dt_criacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dt_alteracao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_transacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_origem` INTEGER NOT NULL,
    `id_destino` INTEGER NULL,
    `valor` DOUBLE NOT NULL,
    `tipo` CHAR(20) NOT NULL,
    `dt_criacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_destino`(`id_destino`),
    INDEX `id_origem`(`id_origem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` CHAR(20) NOT NULL,
    `nome_completo` VARCHAR(100) NOT NULL,
    `documento` CHAR(14) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `documento`(`documento`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_carteira` ADD CONSTRAINT `tb_carteira_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tb_transacao` ADD CONSTRAINT `tb_transacao_ibfk_1` FOREIGN KEY (`id_origem`) REFERENCES `tb_carteira`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tb_transacao` ADD CONSTRAINT `tb_transacao_ibfk_2` FOREIGN KEY (`id_destino`) REFERENCES `tb_carteira`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
