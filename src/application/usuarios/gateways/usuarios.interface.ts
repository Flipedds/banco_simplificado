import { Usuario } from 'src/domain/usuarios/usuarios';
import { DadosAtualizarUsuario } from 'src/infra/usuarios/controller/dtos/usuarios.dto.atualizar';
import { Carteira } from 'src/infra/usuarios/persistence/usuarios.carteira.entity';
import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';

export interface IRepositorioDeUsuarios {
  cadastrar(
    usuario: Usuario,
  ): Promise<{ novoUsuario: UsuarioEntidade; novaCarteira: Carteira }>;
  buscar(documento: string): Promise<UsuarioEntidade | null>;
  listar(): Promise<UsuarioEntidade[]>;
  remover(documento: string): Promise<UsuarioEntidade>;
  atualizar(
    documento: string,
    usuario: DadosAtualizarUsuario,
  ): Promise<UsuarioEntidade>;
}
