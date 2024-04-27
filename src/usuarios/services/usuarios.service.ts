import { Inject, Injectable } from '@nestjs/common';
import { DadosNovoUsuario } from '../dtos/usuarios.dto.novo';
import { Usuario } from '../domain/usuarios.entity';
import { IUsuariosRepository } from '../domain/usuarios.interface.repository';
import { ErroAoCriarUsuario } from '../infra/exceptions/usuarios.exception.criacao';
import * as bcrypt from 'bcrypt';
import { IUsuariosService } from '../domain/usuarios.interface.service';
import { UsuarioNaoEncontrado } from '../infra/exceptions/usuarios.exception.404';
import { ErroAoBuscarUsuario } from '../infra/exceptions/usuarios.exception.buscar';
import { Carteira } from '../domain/usuarios.carteira.entity';
import { ErroAoAtualizarUsuario } from '../infra/exceptions/usuarios.exception.atualizar';
import { DadosAtualizarUsuario } from '../dtos/usuarios.dto.atualizar';
import { ErroAoRemoverUsuario } from '../infra/exceptions/usuarios.exception.remover';

@Injectable()
export class UsuariosService implements IUsuariosService {
  constructor(
    @Inject('IUsuariosRepository')
    private readonly repository: IUsuariosRepository,
  ) { }

  async criarUsuario(usuario: DadosNovoUsuario): Promise<{
    novoUsuario: Usuario;
    novaCarteira: Carteira;
  }> {
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
    return this.repository
      .criar(usuario)
      .then((usuarioECarteira) => {
        return usuarioECarteira;
      })
      .catch((error) => {
        throw new ErroAoCriarUsuario(error.message);
      });
  }

  async buscarUsuario(documento: string): Promise<Usuario> {
    return this.repository
      .buscarPorDocumento(documento)
      .then((usuario) => {
        if (!usuario) throw new UsuarioNaoEncontrado();
        return usuario;
      })
      .catch((error) => {
        if (error instanceof UsuarioNaoEncontrado)
          throw new UsuarioNaoEncontrado();
        throw new ErroAoBuscarUsuario(error);
      });
  }

  async atualizarUsuario(documento: string, usuario: DadosAtualizarUsuario): Promise<Usuario> {
    this.repository
      .buscarPorDocumento(documento)
      .then((usuario) => { if (!usuario) throw new UsuarioNaoEncontrado() });
    if (usuario.senha) usuario.senha = await bcrypt.hash(usuario.senha, 10);
    return this.repository
      .atualizar(documento, usuario)
      .then((usuario) => {
        return usuario;
      })
      .catch((error) => {
        throw new ErroAoAtualizarUsuario(error.message);
      });
  }

  async removerUsuario(documento: string): Promise<Usuario> {
    this.repository
      .buscarPorDocumento(documento)
      .then((usuario) => { if (!usuario) throw new UsuarioNaoEncontrado() });
    return this.repository
      .remover(documento)
      .then((usuario) => {
        return usuario;
      })
      .catch((error) => {
        throw new ErroAoRemoverUsuario(error);
      });
  }
}
