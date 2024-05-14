import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import { IRepositorioDeUsuarios } from '../gateways/usuarios.interface';
import { IBuscarUsuario } from './interfaces/usuarios.interface.buscar';
import { UsuarioResposta } from 'src/infra/usuarios/controller/types/usuarios.types.resposta';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Carteira } from 'src/infra/usuarios/persistence/usuarios.carteira.entity';

export class BuscarUsuario implements IBuscarUsuario {
  constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
  async buscarUsuario(documento: string): Promise<UsuarioResposta | null> {
    return new Promise((resolve, reject) => {
      this.repositorio.buscar(documento)
        .then((dados: { usuario: UsuarioEntidade; carteira: Carteira; }) => {
          if (!dados.usuario) {
            reject(new NotFoundException('Usuário não encontrado'));
            return;
          }
          if (!dados.carteira) {
            reject(new NotFoundException('Carteira não encontrada'));
            return;
          }
          resolve({
            mensagem: 'Usuário encontrado com sucesso',
            usuario: {
              id: dados.usuario.id,
              nome_completo: dados.usuario.nome_completo,
              email: dados.usuario.email,
              tipo: dados.usuario.tipo,
            },
            carteira: {
              saldo: dados.carteira.saldo,
              id_usuario: dados.carteira.id_usuario,
              dt_criacao: dados.carteira.dt_criacao
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
