import { PrismaClient } from '@prisma/client';
import { UsuarioEntidade } from './usuarios.entity';
import { Usuario } from 'src/domain/usuarios/usuarios';
import { DadosAtualizarUsuario } from '../controller/dtos/usuarios.dto.atualizar';
import { Injectable } from '@nestjs/common';
import { IRepositorioDeUsuariosPrisma } from './usuarios.interface.repository';
import { Carteira } from './usuarios.carteira.entity';

@Injectable()
export class RepositorioDeUsuariosPrisma implements IRepositorioDeUsuariosPrisma {
  constructor(private readonly prisma: PrismaClient) {}

  async listar(): Promise<UsuarioEntidade[]> {
    return await this.prisma.tb_usuario.findMany({
      orderBy: {
        nome_completo: 'asc',
      },
    });
  }

  async buscarPorEmail(email: string): Promise<UsuarioEntidade | null> {
    return await this.prisma.tb_usuario.findFirst({
      where: {
        email: email,
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

  async criar(usuario: Usuario): Promise<{
    novoUsuario: UsuarioEntidade;
    novaCarteira: Carteira;
  }> {
    const novoUsuario = await this.prisma.tb_usuario.create({ data: {
      nome_completo: usuario.getNomeCompleto,
      documento: usuario.getDocumento,
      tipo: usuario.getTipo,
      email: usuario.getEmail,
      senha: usuario.getSenha
    } });
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
  ): Promise<UsuarioEntidade> {
    return await this.prisma.tb_usuario.update({
      where: { documento: documento },
      data: usuario,
    });
  }

  async remover(documento: string): Promise<UsuarioEntidade> {
    return await this.prisma.tb_usuario.delete({
      where: { documento: documento },
    });
  }
}
