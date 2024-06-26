import { IRepositorioDeUsuarios } from 'src/application/usuarios/gateways/usuarios.interface';
import { Usuario } from 'src/domain/usuarios/usuarios';
import { IRepositorioDeUsuariosPrisma } from '../persistence/usuarios.interface.repository';
import { UsuarioEntidade } from '../persistence/usuarios.entity';
import { Carteira } from '../persistence/usuarios.carteira.entity';
import { DadosAtualizarUsuario } from '../controller/dtos/usuarios.dto.atualizar';

export class RepositorioDeUsuarios implements IRepositorioDeUsuarios {
  constructor(private readonly repositorio: IRepositorioDeUsuariosPrisma) {}
  atualizar(
    documento: string,
    usuario: DadosAtualizarUsuario,
  ): Promise<UsuarioEntidade> {
    return this.repositorio.atualizar(documento, usuario);
  }
  remover(documento: string): Promise<UsuarioEntidade> {
    return this.repositorio.remover(documento);
  }
  listar(): Promise<UsuarioEntidade[]> {
    return this.repositorio.listar();
  }
  buscar(documento: string): Promise<{ usuario: UsuarioEntidade; carteira: Carteira; }> {
    return this.repositorio.buscarPorDocumento(documento);
  }
  cadastrar(
    usuario: Usuario,
  ): Promise<{ novoUsuario: UsuarioEntidade; novaCarteira: Carteira }> {
    return this.repositorio.criar(usuario);
  }
}
