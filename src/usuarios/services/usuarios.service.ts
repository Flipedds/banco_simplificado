import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DadosNovoUsuario } from '../dtos/usuarios.dto.novo';
import { Usuario } from '../domain/usuarios.entity';
import { IUsuariosRepository } from '../domain/usuarios.interface.repository';
import * as bcrypt from 'bcrypt';
import { IUsuariosService } from '../domain/usuarios.interface.service';
import { Carteira } from '../domain/usuarios.carteira.entity';
import { DadosAtualizarUsuario } from '../dtos/usuarios.dto.atualizar';

@Injectable()
export class UsuariosService implements IUsuariosService {
  constructor(
    @Inject('IUsuariosRepository')
    private readonly repository: IUsuariosRepository,
  ) { }

  async listarUsuarios(): Promise<Usuario[]> {
    return this.repository.listar().then((usuarios) => {
      if (!usuarios) throw new NotFoundException('Usuários não encontrados !');
      return usuarios;
    });
  }

  async criarUsuario(usuario: DadosNovoUsuario): Promise<{
    novoUsuario: Usuario;
    novaCarteira: Carteira;
  }> {
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
    return this.repository.criar(usuario).then((usuarioECarteira) => {
      return usuarioECarteira;
    });
  }

  async buscarUsuario(documento: string): Promise<Usuario> {
    return this.repository.buscarPorDocumento(documento).then((usuario) => {
      if (!usuario) throw new NotFoundException('Usuário não encontrado !');
      return usuario;
    });
  }

  async atualizarUsuario(
    documento: string,
    usuario: DadosAtualizarUsuario,
  ): Promise<Usuario> {
    if (usuario.senha) usuario.senha = await bcrypt.hash(usuario.senha, 10);
    return this.repository.buscarPorDocumento(documento)
      .then(async (usuarioBuscado) => {
        if (!usuarioBuscado) throw new NotFoundException('Usuário não encontrado !');
        const usuarioAtualizado = await this.repository.atualizar(documento, usuario);
        return usuarioAtualizado;
      });
  }

  async removerUsuario(documento: string): Promise<Usuario> {
    return this.repository.buscarPorDocumento(documento)
      .then(async (usuario) => {
        if (!usuario) throw new NotFoundException('Usuário não encontrado !');
        const usuarioRemovido = await this.repository.remover(documento);
        return usuarioRemovido;
      });
  }
}
