import { Injectable } from "@nestjs/common";
import { IRepositorioDeUsuariosAutenticacaoPrisma } from "./autenticacao.interface.repository";
import { PrismaClient } from "@prisma/client";
import { UsuarioAutenticacao } from "./autenticacao.entity";

@Injectable()
export class RepositorioDeUsuariosAutenticacaoPrisma
    implements IRepositorioDeUsuariosAutenticacaoPrisma {
    constructor(private readonly prisma: PrismaClient) { }

    async buscarPorEmail(email: string): Promise<UsuarioAutenticacao | null> {
        return await this.prisma.tb_usuario.findFirst({
            where: {
                email: email,
            },
        });
    }
}
