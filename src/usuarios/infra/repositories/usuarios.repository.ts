import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DadosNovoUsuario } from '../../dtos/usuarios.dto.novo';
import { Usuario } from '../../domain/usuarios.entity';
import { IUsuariosRepository } from 'src/usuarios/domain/usuarios.interface.repository';

@Injectable()
export class UsuariosRespository implements IUsuariosRepository {
  constructor(private readonly prisma: PrismaClient) {}

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

  async criar(usuario: DadosNovoUsuario): Promise<Usuario> {
    return await this.prisma.tb_usuario.create({ data: usuario });
  }
}
