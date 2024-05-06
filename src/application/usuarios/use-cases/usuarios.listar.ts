import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import { IRepositorioDeUsuarios } from '../gateways/usuarios.interface';
import { IListarUsuarios } from './interfaces/usuarios.interface.listar';
import { HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsuarioSeguro } from 'src/infra/usuarios/controller/types/usuarios.types.seguro';

export class ListarUsuarios implements IListarUsuarios {
  constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
  async listarUsuarios(): Promise<UsuarioSeguro[] | HttpException> {
    return new Promise((resolve, reject) => {
      this.repositorio.listar()
        .then((usuarios: UsuarioEntidade[]) => {
          if (!usuarios) {
            reject(new NotFoundException('Usuários não encontrados'));
            return;
          }
          resolve(
            usuarios.map((usuario: UsuarioEntidade) => {
              return {
                id: usuario.id,
                nome_completo: usuario.nome_completo,
                email: usuario.email,
                tipo: usuario.tipo,
              };
            }),
          );
        })
        .catch((error) => {
          reject(
            new InternalServerErrorException({
              mensagem: 'Erro ao listar usuários',
              error: error,
            }),
          );
        });
    });
  }
}
