import { PrismaClient } from '@prisma/client';
import { Transacao } from 'src/domain/transacoes/transacoes';
import { Carteira } from 'src/infra/usuarios/persistence/usuarios.carteira.entity';
import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import { TransacaoEntidade } from './transacoes.entity';
import { IRepositorioDeTransacoesPrisma } from './transacoes.interface.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RepositorioDeTransacoesPrisma
  implements IRepositorioDeTransacoesPrisma {
  constructor(private readonly prisma: PrismaClient) { }
  async buscarCarteiraPorId(id: number): Promise<Carteira> {
    return await this.prisma.tb_carteira.findFirst({
      where: {
        id: id,
      },
    });
  }
  async buscarPorEmail(email: string): Promise<UsuarioEntidade> {
    return await this.prisma.tb_usuario.findFirst({
      where: {
        email: email,
      },
    });
  }
  async buscarPorId(id: number): Promise<UsuarioEntidade> {
    return await this.prisma.tb_usuario.findFirst({
      where: {
        id: id,
      },
    });
  }

  async listar(id_carteira: number): Promise<TransacaoEntidade[]> {
    return await this.prisma.tb_transacao.findMany({
      orderBy: {
        dt_criacao: 'desc',
      },
      where: {
        OR: [
          {
            id_origem: id_carteira,
          },
          {
            id_destino: id_carteira,
          },
        ],
      }
    });
  }


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
