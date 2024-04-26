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

@Injectable()
export class UsuariosService implements IUsuariosService {
  constructor(
    @Inject('IUsuariosRepository')
    private readonly repository: IUsuariosRepository,
  ) {}

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
}
