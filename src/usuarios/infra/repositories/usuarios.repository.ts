import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DadosNovoUsuario } from '../../dtos/usuarios.dto.novo';
import { Usuario } from '../../domain/usuarios.entity';
import { IUsuariosRepository } from 'src/usuarios/domain/usuarios.interface.repository';
import { Carteira } from 'src/usuarios/domain/usuarios.carteira.entity';
import { DadosAtualizarUsuario } from 'src/usuarios/dtos/usuarios.dto.atualizar';

@Injectable()
export class UsuariosRespository implements IUsuariosRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listar(): Promise<Usuario[]> {
    return await this.prisma.tb_usuario.findMany({
      orderBy: {
        nome_completo: 'asc',
      },
    });
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return await this.prisma.tb_usuario.findFirst({
      where: {
        email: email,
      },
    });
  }
  async buscarPorDocumento(documento: string): Promise<Usuario | null> {
    return await this.prisma.tb_usuario.findFirst({
      where: {
        documento: documento,
      },
    });
  }

  async criar(usuario: DadosNovoUsuario): Promise<{
    novoUsuario: Usuario;
    novaCarteira: Carteira;
  }> {
    const novoUsuario = await this.prisma.tb_usuario.create({ data: usuario });
    const novaCarteira = await this.prisma.tb_carteira.create({
      data: {
        saldo: 0,
        id_usuario: novoUsuario.id,
      },
    });
    return { novoUsuario, novaCarteira };
  }

  async atualizar(
    documento: string,
    usuario: DadosAtualizarUsuario,
  ): Promise<Usuario> {
    return await this.prisma.tb_usuario.update({
      where: { documento: documento },
      data: usuario,
    });
  }

  async remover(documento: string): Promise<Usuario> {
    return await this.prisma.tb_usuario.delete({
      where: { documento: documento },
    });
  }
}
