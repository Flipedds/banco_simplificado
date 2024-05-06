import { IRepositorioDeUsuarios } from '../gateways/usuarios.interface';
import * as bcrypt from 'bcrypt';
import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import { Carteira } from 'src/infra/usuarios/persistence/usuarios.carteira.entity';
import { DadosNovoUsuario } from 'src/infra/usuarios/controller/dtos/usuarios.dto.novo';
import { FabricaDeUsuarios } from '../../../domain/usuarios/usuarios.factory';
import { ICriarUsuario } from './interfaces/usuarios.interface.criar';
import { UsuarioResposta } from 'src/infra/usuarios/controller/types/usuarios.types.resposta';
import { HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

export class CriarUsuario implements ICriarUsuario {
  constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
  async criarUsuario(usuario: DadosNovoUsuario): Promise<UsuarioResposta | HttpException> {
    const usuarioDeDominio =
      FabricaDeUsuarios.comTipoNomeCompletoDocumentoEmailESenha(
        usuario.tipo,
        usuario.nome_completo,
        usuario.documento,
        usuario.email,
        usuario.senha,
      );
    usuarioDeDominio.setSenha = await bcrypt.hash(
      usuarioDeDominio.getSenha,
      10,
    );
    return new Promise((resolve, reject) => {
      this.repositorio.cadastrar(usuarioDeDominio)
        .then(
          (usuarioCriado: {
            novoUsuario: UsuarioEntidade;
            novaCarteira: Carteira;
          }) => {
            if (!usuarioCriado)
              reject(new NotFoundException('Usuário não retornado'));
            resolve({
              mensagem: 'Usuário criado com sucesso',
              usuario: {
                id: usuarioCriado.novoUsuario.id,
                nome_completo: usuarioCriado.novoUsuario.nome_completo,
                email: usuarioCriado.novoUsuario.email,
                tipo: usuarioCriado.novoUsuario.tipo,
              },
              carteira: {
                id_usuario: usuarioCriado.novaCarteira.id_usuario,
                saldo: usuarioCriado.novaCarteira.saldo,
                dt_criacao: usuarioCriado.novaCarteira.dt_criacao,
              },
            });
          },
        )
        .catch((error) => {
          reject(
            new InternalServerErrorException({
              mensagem: 'Erro ao criar usuário',
              error: error,
            }),
          );
        });
    });
  }
}
