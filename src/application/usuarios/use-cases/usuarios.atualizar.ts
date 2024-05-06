import { DadosAtualizarUsuario } from 'src/infra/usuarios/controller/dtos/usuarios.dto.atualizar';
import { IRepositorioDeUsuarios } from '../gateways/usuarios.interface';
import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import * as bcrypt from 'bcrypt';
import { IAtualizarUsuario } from './interfaces/usuarios.interface.atualizar';
import { HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsuarioResposta } from 'src/infra/usuarios/controller/types/usuarios.types.resposta';

export class AtualizarUsuario implements IAtualizarUsuario {
  constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
  async atualizarUsuario(
    documento: string,
    dados: DadosAtualizarUsuario,
  ): Promise<UsuarioResposta | HttpException> {
    if (dados.senha) dados.senha = await bcrypt.hash(dados.senha, 10);
    return new Promise((resolve, reject) => {
      this.repositorio
        .buscar(documento)
        .then(async (usuarioBuscado: UsuarioEntidade) => {
          if (!usuarioBuscado) {
            reject(new NotFoundException('Usuário não encontrado'));
            return;
          }
          this.repositorio.atualizar(documento, dados)
            .then((usuarioAtualizado: UsuarioEntidade) => {
              if (!usuarioAtualizado){
                reject(new NotFoundException('Usuário não retornado'));
                return;
              }
              resolve({
                mensagem: 'Usuário atualizado com sucesso',
                usuario: {
                  id: usuarioAtualizado.id,
                  nome_completo: usuarioAtualizado.nome_completo,
                  email: usuarioAtualizado.email,
                  tipo: usuarioAtualizado.tipo,
                },
              });
            })
            .catch((error) => {
              reject(
                new InternalServerErrorException({
                  mensagem: 'Erro ao atualizar usuário',
                  error: error,
                }),
              );
            });
        })
        .catch((error) => {
          reject(
            new InternalServerErrorException({
              mensagem: 'Erro ao atualizar usuário',
              error: error,
            }),
          );
        });
    });
  }
}
