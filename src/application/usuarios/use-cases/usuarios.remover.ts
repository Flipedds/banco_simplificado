import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import { IRepositorioDeUsuarios } from '../gateways/usuarios.interface';
import { IRemoverUsuario } from './interfaces/usuarios.interface.remover';
import { HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsuarioResposta } from 'src/infra/usuarios/controller/types/usuarios.types.resposta';

export class RemoverUsuario implements IRemoverUsuario {
  constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
  async removerUsuario(documento: string): Promise<UsuarioResposta | HttpException> {
    return new Promise((resolve, reject) => {
      this.repositorio.buscar(documento)
        .then(async (usuarioBuscado: UsuarioEntidade) => {
          if (!usuarioBuscado) {
            reject(new NotFoundException('Usuário não encontrado'));
            return;
          }
          this.repositorio.remover(documento)
            .then((usuario: UsuarioEntidade) => {
              if (!usuario) {
                reject(new NotFoundException('Usuário não retornado'));
                return;
              }
              resolve({
                mensagem: 'Usuário removido com sucesso',
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
                  mensagem: 'Erro ao remover usuário',
                  error: error,
                }),
              );
            });
        })
        .catch((error) => {
          reject(
            new InternalServerErrorException({
              mensagem: 'Erro ao remover usuário',
              error: error,
            }),
          );
        });
    });
  }
}
