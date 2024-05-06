import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import { IRepositorioDeUsuarios } from '../gateways/usuarios.interface';
import { IBuscarUsuario } from './interfaces/usuarios.interface.buscar';
import { UsuarioResposta } from 'src/infra/usuarios/controller/types/usuarios.types.resposta';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

export class BuscarUsuario implements IBuscarUsuario {
  constructor(private readonly repositorio: IRepositorioDeUsuarios) {}
  async buscarUsuario(documento: string): Promise<UsuarioResposta | null> {
    return new Promise((resolve, reject) => {
      this.repositorio.buscar(documento)
        .then((usuario: UsuarioEntidade) => {
          if (!usuario) reject(new NotFoundException('Usuário não encontrado'));
          resolve({
            mensagem: 'Usuário encontrado com sucesso',
            usuario: {
              id: usuario.id,
              nome_completo: usuario.nome_completo,
              email: usuario.email,
              tipo: usuario.tipo,
            },
          });
        })
        .catch((error) => {
          reject(
            new InternalServerErrorException({
              mensagem: 'Erro ao buscar usuário',
              error: error,
            }),
          );
        });
    });
  }
}
