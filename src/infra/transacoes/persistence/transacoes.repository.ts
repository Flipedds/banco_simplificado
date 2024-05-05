import { PrismaClient } from "@prisma/client";
import { Transacao } from "src/domain/transacoes/transacoes";
import { Carteira } from "src/infra/usuarios/persistence/usuarios.carteira.entity";
import { UsuarioEntidade } from "src/infra/usuarios/persistence/usuarios.entity";
import { TransacaoEntidade } from "./transacoes.entity";
import { IRepositorioDeTransacoesPrisma } from "./transacoes.interface.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositorioDeTransacoesPrisma implements IRepositorioDeTransacoesPrisma
{
  constructor(private readonly prisma: PrismaClient) {}

  async atualizarCarteira(id: number, valor: number): Promise<void> {
    await this.prisma.tb_carteira.update({
      where: { id: id },
      data: {
        saldo: valor,
      },
    });
  }

  async buscarPorDocumento(documento: string): Promise<UsuarioEntidade | null> {
    return await this.prisma.tb_usuario.findFirst({
      where: {
        documento: documento,
      },
    });
  }

    async buscarCarteira(idUsuario: number): Promise<Carteira> {
        return await this.prisma.tb_carteira.findFirst({
        where: {
            id_usuario: idUsuario,
        },
        });
    }

    async novaTransacao(transacao: Transacao): Promise<TransacaoEntidade | null> {
        return await this.prisma.tb_transacao.create({
        data: {
            id_origem: transacao.getIdOrigem,
            id_destino: transacao.getIdDestino,
            valor: transacao.getValor,
            tipo: transacao.getTipo,
        },
        });
    }
}